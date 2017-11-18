import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  ART,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image
} from 'react-native';
const {Path} = ART;
const TIME=60;
const ROUND=16;
import { connect } from 'react-redux'
const {height, width} = Dimensions.get('window');
import { Button ,SearchBar,Icon ,InputItem,Popup,Modal,ActionSheet} from 'antd-mobile';
import {setRoomId ,setDeskList} from '../../other/actions';
import domain from '../../other/domain';
import wordJson from '../../other/word';
import AdjustInput from '../component/AdjustInput';
import AnimateText from '../component/AnimateText';
const colorArray= ['#fff','#000','#9b9b9b','#ff4c62','#FdC30F',
                '#Fcf902','#91c601','#506cfd','#9BCef1','#9b7bfe',
                '#01A64c','#CBA76C','#EFD780','#FEC3D5','#FE00b1'
                ];

class DrawingEntry extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header:null
    });
    constructor(props){
      super(props);
      this.state={
        paths:null,
        persons:props.navigation.state.params.gamer,
        colorBoardShow:false,
        textColor:'#fff',
        shapeList:[],
        strokeWidth:5,
        time:TIME,
        drawer:props.navigation.state.params.gamer[0],
        word:{
            value:'',
            tips:'',
        },
        countdownShow:false,
        inputText:'',
        logs:[],//聊天记录
        count:0,//回合统计
        roundEnd:false,//回合结束
        gameOver:false,//游戏结束
        anwerRightCount:0,//统计回答正确的人数，全部答对就结束回合
        isAnwerRight:false,//是否回答正确，答对就不能再答了
      }
      this.drawPath=new Path();
      this.offsetX=0;
      this.offsetY=0;
      this.unMount=false;
    }

    componentWillMount(){
        //生成词汇数组
        const {drawer}=this.state;
        const {roomId}=this.props;
        this.listener();
        if(drawer.id==this.props.localStorageData.id){
            let wordArray=Object.values(wordJson).slice(0,15);
            socket.emit('client',{
                type:'drawRoom',
                action:'createWord',
                id:roomId,
                wordArray,
            })
        }
        
    }
    componentWillUnmount(){
        this.unMount=true;
        clearTimeout(this.timer);
        clearTimeout(this.roundEndTimer);
        clearTimeout(this.countdownTimer);
        clearTimeout(this.nextRoundTimer);
    }
    clock=()=>{
        if(this.state.time!=0){
            if(this.unMount) return;
            this.timer=setTimeout(()=>{
               if(!this.unMount){
                    this.setState(({time})=>({time:time-1}));
                    this.clock();
               }
            }, 1000);
        }else{
            this.roundEndHandle();
        }
    }
    //游戏开始前的初始化
    init=()=>{
         this.countdown();
    }

    listener=()=>{
        const {roomId}=this.props;
        try{
            socket.on(`drawRoom${roomId}`,(data)=>{
                if(this.unMount) return ;
                if(data.action=='begin'){
                    if(this.props.localStorageData.id == data.drawer) return;
                    this.drawPath.moveTo(data.x,data.y); 
                }else if(data.action=='move'){
                    if(this.props.localStorageData.id == data.drawer) return;
                    this.drawPath.lineTo(data.x,data.y);
                    this.setState({
                        paths:this.drawPath
                    })
                }else if(data.action=='anwer'){
                    if(data.anwerText==this.state.word.value){
                        //如果答对
                        if(this.state.isAnwerRight) return ;
                        this.setState({isAnwerRight:true})
                        let persons=this.state.persons;
                        let anwerRightCount=this.state.anwerRightCount+1;
                        persons=persons.map(item=>{
                            if(item.id==data.gamer.id){
                                item.score+=3;
                            }else if(item.id==this.state.drawer.id){
                                item.score++;
                            }
                            return item;
                        })
                        this.setState({persons,anwerRightCount});
                        this.showLog(data.gamer.id,data.gamer.user_name,data.anwerText,true);
                        if(anwerRightCount==persons.length-1){
                            clearTimeout(this.timer);
                            this.nextRoundTimer=setTimeout(()=>{
                                this.roundEndHandle();
                            },2000)
                        }
                    }else{
                        this.showLog(data.gamer.id,data.gamer.user_name,data.anwerText,false)
                    }
                }else if(data.action=='createWord'){
                    this.setState({wordAray:data.wordArray},()=>this.gameNext())
                }else if(data.action=='leave'){//离开或断线
                    let persons=this.state.persons;
                    let temp=persons.map(item=>{
                        if(item.id ==data.gamerId){
                           item.isLeave=true;
                        }
                        return item;
                    })
                    this.setState({persons:temp})
                }else if(data.action=='switchColor'){
                    this.state.shapeList.push({
                        textColor:this.state.textColor,
                        path:this.drawPath,
                        strokeWidth:this.state.strokeWidth
                    })
                    this.drawPath=new Path();
                    this.setState({
                        textColor:data.color,
                        shapeList:this.state.shapeList,
                    })
                }else if(data.action=='rollback'){
                    this.drawPath=new Path();
                }else if(data.action=='clearBoard'){
                    this.drawPath=new Path();
                    this.setState({
                        shapeList:[],
                    })
                }else if(data.action=='joinRoom'){
                    socket.emit('client',{
                        type:'drawRoom',
                        action:'inGame',
                        id:this.props.roomId,
                    })
                }
            })
        }catch(err){
            log(err)
        }     
    }


    //每一轮开始之前的初始化
    gameNext=()=>{
        let {drawer,persons,time,shapeList,word,count,anwerRightCount,wordAray}=this.state;
        if(count ==ROUND){
            return this.gameOverHandle();
         }
        //初始化时间
        time=TIME;
        //初始化画板
        this.drawPath=new Path();
        shapeList=[];
        //初始化 画画的人
        if(!drawer || drawer.desk==persons.length-1){
            drawer=persons[0]
        }else{
            drawer=persons[drawer.desk+1]
        }
        //初始化答对人数
        anwerRightCount=0;
         //初始化给定单词
        word=wordAray[count];
        //回合数改变
        count++;
        this.setState({
            drawer,
            time,
            shapeList,
            word,
            count,
            anwerRightCount

        },()=>this.countdown())
    }
    drawStart=(e)=>{
        const {roomId}=this.props;
        let px=e.nativeEvent.pageX;
        let py=e.nativeEvent.pageY;
        let lx=e.nativeEvent.locationX;
        let ly=e.nativeEvent.locationY;
        this.offsetX=lx-px;//因为e.nativeEvent.locationX，locationY在移动的时候没有改变
        this.offsetY=ly-py;
        this.drawPath.moveTo(lx,ly);
        socket.emit('client',{
            type:'drawRoom',
            action:'begin',
            id:roomId,
            x:lx,
            y:ly,
            drawer:this.props.localStorageData.id
        })
       
    }
    drawMove=(e)=>{
        const {roomId}=this.props;
        let x=e.nativeEvent.pageX+this.offsetX;
        let y=e.nativeEvent.pageY+this.offsetY;
        this.drawPath.lineTo(x,y);
        this.setState({
            paths:this.drawPath
        })
        try{
            socket.emit('client',{
                type:'drawRoom',
                action:'move',
                id:roomId,
                x,
                y,
                drawer:this.props.localStorageData.id,
            })
        }catch(err){
               (err)
        }
    }
    drawEnd=(e)=>{

    }
    selectColor=(color)=>{
        this.setState({
            colorBoardShow:false
        })
        socket.emit('client',{
            type:'drawRoom',
            action:'switchColor',
            id:this.props.roomId,
            color,
        })
    }
    roundEndHandle=()=>{
        this.setState({roundEnd:true});
        clearTimeout(this.roundEndTimer);
        this.roundEndTimer=setTimeout(()=>{
            this.setState({roundEnd:false},()=>this.gameNext())
        },4000)
    }
    createColorBoard=()=>{
        let temp=[];
        for(let i=0;i<colorArray.length;i++){
            if((i+1)%5==0){
                temp.push(
                    <View style={styles.colorRow} key={i}>
                        <TouchableOpacity onPress={()=>this.selectColor(colorArray[i-4])}><View style={[styles.colorItem,{backgroundColor:colorArray[i-4]}]}></View></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.selectColor(colorArray[i-3])}><View style={[styles.colorItem,{backgroundColor:colorArray[i-3]}]}></View></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.selectColor(colorArray[i-2])}><View style={[styles.colorItem,{backgroundColor:colorArray[i-2]}]}></View></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.selectColor(colorArray[i-1])}><View style={[styles.colorItem,{backgroundColor:colorArray[i-1]}]}></View></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.selectColor(colorArray[i])}><View style={[styles.colorItem,{backgroundColor:colorArray[i]}]}></View></TouchableOpacity>
                    </View>
                )
            }
        }
        return temp;
    }
    switchColorBoard=()=>{
        this.setState({
            colorBoardShow:!this.state.colorBoardShow
        })
    }
    clearDrawBoard=()=>{
        socket.emit('client',{
            type:'drawRoom',
            action:'clearBoard',
            id:this.props.roomId,
        })
    }
    rollback=()=>{
        socket.emit('client',{
            type:'drawRoom',
            action:'rollback',
            id:this.props.roomId,
        })
    }
    countdown=()=>{
        this.setState({
            countdownShow:true
        },()=>{
           this.countdownTimer = setTimeout(()=>{
                this.setState({
                    countdownShow:false
                },()=>{
                    clearTimeout(this.timer)
                    this.clock();
                })
            },1500)
        })
    }
    submitText=()=>{
        let text=this.state.inputText;
        const {roomId}=this.props;
        if(!text) return;
        this.setState({inputText:''},()=>{
            socket.emit('client',{
                type:'drawRoom',
                action:'anwer',
                id:roomId,
                gamer:this.props.localStorageData,
                anwerText:text
            })
        })
    }
    gameOverHandle=()=>{
        this.setState({gameOver:true})
    }
    backToRoom=()=>{
        //this.props.navigation.goBack();
        this.setState({gameOver:false})
        this.props.navigation.navigate('Index');
    }
    showLog=(id,name,text,flag)=>{
        this.setState(({logs})=>{
            logs.push({id,name,text,flag});
            return ({
                logs
            })
        })
    }
    quitGame=()=>{
        const {roomId,localStorageData}=this.props;
        const {token,id}=localStorageData;
        const BUTTONS = ['确定', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '你确定要退出游戏？退出后将不能重新进入已经进行游戏',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                let desks=new Array(8).fill({}).map((item,index)=>({
                    id:index,
                    text:'坐下',
                    desker:null,
                
                }));
                this.props.dispatch(setRoomId(null));
                this.props.dispatch(setDeskList(desks));
                socket.emit('client',{
                    type:'drawRoom',
                    action:'leave',
                    id:roomId,
                    token,
                    gamerId:id
                })
                this.props.navigation.navigate('Index');
            }
          });
    }

    render() { 
        const {paths,persons,colorBoardShow,strokeWidth,textColor,shapeList,time,drawer,word,countdownShow ,inputText,logs ,roundEnd,count,gameOver}=this.state;
        const {localStorageData}=this.props;
        let shapes=[...shapeList,{
            textColor,
            strokeWidth,
            path:this.drawPath   
        }];

        const shapeRender=shapes.map((item,index)=>(
            <ART.Shape
                key={index}
                d={item.path} 
                stroke = {item.textColor}
                strokeWidth={item.strokeWidth}
            />
        ))
        const roundEndRender=roundEnd
                            ?<View style={styles.roundEnd}>
                                <Text style={styles.roundEndTitle}>回合结束</Text>
                                <Text style={styles.roundEndAnwer}>答案：{word.value}</Text>                                
                            </View>
                            :null;
        const isdrawer=(drawer.id==localStorageData.id);

        const drawBoardRender=<ART.Surface width={width} height={300}>
                                    <ART.Group>
                                        {shapeRender}
                                    </ART.Group>
                                </ART.Surface>
        const avators=persons.map((item,index)=>{
            const drawing=(drawer.id==item.id)?<View style={styles.deawing}><Icon type={"\uE692"} size={50} color={'#f60'}/></View>:null;
            const isLeaveRender=item.isLeave?<View style={styles.isLeave}><Text style={styles.isLeaveText}>离线</Text></View>:null;
            return (
                <View style={styles.avatorItem} key={index}>
                    <Text>{item.id==this.props.localStorageData.id?'我':item.user_name}</Text>
                    <View style={styles.avatorWrap}>
                        <Image key={index} source={{uri:`${domain}${item.user_faceSrc}`}} style={styles.avator}/>
                        {isLeaveRender}
                    </View>
                    <Text>{item.score}</Text>
                    {drawing}
                </View>
            )
        })
        const tipsRender=<View style={styles.adviseTextWrap}>
                            <Text style={styles.adviseText}>{isdrawer?'我画：'+word.value:`提示：${word.value.length}个字（${word.tips}）`}</Text>
                            <Text style={styles.adviseText}>{time}</Text>
                         </View>
        const colorBoardRender=colorBoardShow
                            ?<View style={styles.colorBoard}>
                                {this.createColorBoard()}
                            </View>
                            :null;
        const drawEditorRender=(isdrawer)
                            ?<View 
                                style={styles.drawBoard} 
                                ref='drawboard'
                                onStartShouldSetResponder={() => true}
                                onMoveShouldSetResponder={()=> true}
                                onResponderGrant={this.drawStart}
                                onResponderMove={this.drawMove}
                                onResponderRelease={this.drawEnd} 
                            ></View>
                            :null;
        const countdownRender=countdownShow
                            ?<View style={styles.countdown}>
                                    <View  style={styles.countdownWrap}>
                                        <Text style={styles.countdownText}>第{count}/{ROUND}轮 :{
                                            localStorageData.id==drawer.id?`我画：${word.value}`:`${drawer.user_name}画，我猜`
                                        }</Text>
                                    </View>
                             </View>
                             :null;
        const toolbarRender=isdrawer
                           ?<View style={styles.toolbar}>
                                <TouchableOpacity onPress={this.switchColorBoard}>
                                    <View style={[styles.tool,{backgroundColor:textColor}]}></View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.rollback}><Icon type={"\uE612"} color='#666' size={30}/></TouchableOpacity>
                                <TouchableOpacity onPress={this.clearDrawBoard}><Icon type={"\uE69F"} color='#666' size={30}/></TouchableOpacity>
                            </View>
                            :<View style={styles.toolbar}>
                                <View style={styles.inputWrap}>
                                    <InputItem placeholder='聊天，最多输入十个字' 
                                            maxLength={10}
                                            placeholderTextColor='#ccc' 
                                            selectionColor='#ccc'
                                            style={styles.flex}
                                            value={inputText}
                                            onChange={(text)=>this.setState({inputText:text})}
                                            onEndEditing  ={this.submitText}
                                        />
                                    <Button type='primary' style={styles.inputBtn} size={35} onClick={this.submitText}>确定</Button>
                                </View>
                            </View>
        const chatlogsRender=logs.map((item,index)=>{
            let component=item.flag
                         ?<Text style={styles.animateText}>{(item.id==this.props.localStorageData.id?'我':item.name)}回答正确</Text>
                         :<Text style={styles.animateText}>{item.name}：{item.text}</Text>
         
            return <AnimateText component={component}
                        key={index} 
                        item={item}
                        style={
                            styles.animateWrap
                        }
                        />
        })
        const rankListRender=persons.sort((a,b)=>b.score-a.score).map((item,index)=>{
            return (
                <View style={styles.rankItem} key={index}>
                    <View style={styles.rankLeft}>
                        <Text style={styles.rankItemText}>{index+1}.　</Text>
                        <Image source={{uri:domain+item.user_faceSrc}} style={styles.endAvator}/>
                        <Text style={styles.rankItemText}> {item.id==this.props.localStorageData.id?'我 ':item.user_name}</Text>
                    </View>
                    <Text  style={styles.rankItemText}>{item.score}分</Text>
                </View>
            )
        })
       return (
           <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={this.quitGame}
                        style={{
                        flexDirection: 'row'
                    }}>
                        <Icon type={"\uE61C"} color='#fff' style={styles.headerIcon}/><Text>　　</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>你画我猜</Text>
                </View>
                {tipsRender}
                <AdjustInput
                    component={
                        <View>
                            {drawBoardRender}
                            {drawEditorRender}
                            <View style={styles.chatlogs}>{chatlogsRender}</View>
                            <View style={styles.controlBar}>
                                {toolbarRender}
                                <View>
                                    <ScrollView contentContainerStyle ={styles.avators} horizontal={true} showsHorizontalScrollIndicator ={false}>{avators}</ScrollView>
                                </View>
                                <View style={styles.footer}></View>
                            </View>
                        {colorBoardRender}
                        {countdownRender}
                    </View>
                }
                />
                {roundEndRender}
                <Modal
                    title="游戏结束"
                    visible={gameOver}
                    transparent
                    style={{
                        backgroundColor:'#ee5b98'
                    }}
                    footer={[{ text: '退出游戏', onPress: () => {this.backToRoom()}}]}
                >
                <View style={styles.gameOver}>
                    <View style={styles.gameOverWrap}>
                        {rankListRender}
                    </View>
                </View>   
              </Modal>
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
    row:{
        flexDirection:'row'
    },
    container:{
        flex:1,
    },
    drawBoard:{
        width,
        height:300,
        zIndex:999,
        position:'absolute',
        borderWidth:1,
        borderColor:'#666'

    },
    adviseTextWrap:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:20,
        paddingVertical:5,
        backgroundColor:'#FFFFE0',   
    },
    adviseText:{
        color:'red'
    },
    avators:{       
        marginTop:10,
        flexDirection:'row',
        justifyContent:'space-around'
    },
    avatorItem:{
        justifyContent:'center',
        alignItems:'center',
        margin:5,
    },
    avator:{
        width:50,
        height:50,
        borderRadius:5
    },
    controlBar:{
        flex:1,
        backgroundColor:'#01556e'
    },
    toolbar:{
        height:60,
        width,
        paddingHorizontal:20,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#f4f0ea', 
        justifyContent:'space-between'  
    },
    tool:{
        width:40,
        height:40,
        borderRadius:5,
    },
    inputWrap:{
        height:35,
        width:'100%',
        flexDirection:'row',
        borderWidth:1,
        borderColor:'#ccc',
        margin:5,
        borderRadius:5,
        alignItems:'center'
    },
    input:{
        flex:1,
    },
    inputBtn:{
        height:35,
        width:60,
    },
    footer:{
        flex:1,
        backgroundColor:'#00a7da'
    },
    colorBoard:{
       backgroundColor:'#f4f0ea',
       position:'absolute',
       paddingVertical:10,
       width:width,
       zIndex:999,
       top:185
    },
    colorRow:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:10
    },
    colorItem:{
        width:25,
        height:25,
        borderRadius:25
    },
    deawing:{
        position:'absolute',
        zIndex:999,
        top:0,
        left:0
    },
    countdown:{
        position:'absolute',
        zIndex:999,
        width:width,
        top:180,
        backgroundColor:'#00a7da',
        height:60
        
    },
    countdownWrap:{
        alignItems:'center',
        justifyContent:'center',
        height:60
    },
    chatlogs:{
        height:30,
        width,
        backgroundColor:'#00a7da',
        zIndex:9999,
        justifyContent:'center'
    },
    animateWrap: {
        flex:1,
        zIndex:9999,
        alignSelf:'center',
        position:'absolute',

    },
    animateText:{
        color:'#333',
        fontSize:16
    },
    roundEnd:{
        position:'absolute',
        alignSelf:'center',
        top:150,
        backgroundColor:'#C00047',
        paddingHorizontal:30,
        paddingVertical:20
    },
    roundEndTitle:{
        color:'#fff',
        fontSize:18,
        fontWeight:'bold',
        top:-10
    },
    roundEndAnwer:{
        color:'#fff',
        fontSize:16,
        fontWeight:'bold',
    },
    gameOver:{
        alignSelf:'center',
        justifyContent:'center',
    },
    gameOverWrap:{

    },
    gameOverTitle:{

    },
    endAvator:{
        width:40,
        height:40,
        borderRadius:10
    },
    rankItem:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    rankItemText:{
        color:'#fff',
        fontSize:20
    },
    rankLeft:{
        flexDirection:'row'
    },
    isLeave:{
        backgroundColor:'rgba(0,0,0,0.5)',
        height:'100%',
        width:'100%',
        position:'absolute',
        justifyContent:'center'
    },
    avatorWrap:{
        justifyContent:'center'
    },
    isLeaveText:{
        color:'#fff',
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:22
    },
    header: {
        backgroundColor: '#108ee9',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight:'bold',
    },
    headerBtn: {
        paddingHorizontal: 20
    },
    headerIcon: {
        fontSize: 20,
        color: '#fff',
        fontWeight:'bold',
    },
})


function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(DrawingEntry)