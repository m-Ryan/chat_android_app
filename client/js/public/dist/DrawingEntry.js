import React from 'react';
import {
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  TextInput,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux'
const {height, width} = Dimensions.get('window');
import AdjustInput from '../component/AdjustInput';
import { Button ,SearchBar,Icon ,InputItem ,List ,Modal} from 'antd-mobile';
import {setRoomId ,setDeskList} from '../../other/actions';
import AnimateText from '../component/AnimateText';
const prompt = Modal.prompt;

class DrawingEntry extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title:'创建房间'
    });
    constructor(props){
      super(props);
      this.state={
        gamer:[],
        inputTextList:[],
        fadeAnim: new Animated.Value(0),     
        text:'',
        isJoin:false,//是否加入房间
        isFirst:false,//是不是第一个人
        inGame:false
      }
      this.unMount=false;
    }

    //房间初始化
    init=(roomId)=>{
        const {gamer}=this.state;
        const {deskList}=this.props;
        socket.emit('client',{
            type:'drawRoom',
            action:'createRoom',
            id:roomId,
        })
       this.listener(roomId);
    }

    listener=(roomId)=>{
        const {gamer}=this.state;
        const {deskList}=this.props;
        try{
            socket.on(`drawRoom${roomId}`,(data)=>{
                let gamer=this.props.localStorageData;
                    gamer.token=socket.id;
                if(data.action=='createRoom'){
                    this.setState(({gamer})=>{
                        gamer.push(this.props.localStorageData);
                        return {gamer}
                    })
                }else if(data.action=='joinRoom'){
                    let desker=(deskList.filter(item=>item.desker==this.props.localStorageData.id))[0] ||null;
                    socket.emit('client',{
                        type:'drawRoom',
                        action:'all_gamer',
                        id:roomId,
                        gamer:this.props.localStorageData,
                        desker
                    })
                }else if(data.action=='sitdown'){
                    const {desker,desk}=data;
                    this.setState({isFirst:false})
                    let temp=deskList.map(item=>{
                        if(item.desker==desker.id){
                            item.desker=null,
                            item.text='坐下'
                        }
                        if(item.id==desk){
                            item.desker=desker.id,
                            item.text=(desker.id==this.props.localStorageData.id)?'我':desker.user_name;
                        }
                        return item;
                    })
                    if(temp[0].desker==this.props.localStorageData.id){
                        this.setState({isFirst:true})
                    }
                    this.props.dispatch(setDeskList(temp))
                }else if(data.action=='chat'){
                    const{gamer,text}=data;
                    let temp={gamer,text}
                    this.state.inputTextList.push(temp);
                    this.setState({inputTextList:this.state.inputTextList});
                }else if(data.action=='beginGame'){
                    if(this.unMount) return ;
                    let values=(deskList.filter(item=>item.desker)).map(item=>item.desker);
                    let gamerList=this.state.gamer.filter(item=>values.indexOf(item.id)>=0)
                                                  .map((item,index)=>{
                                                    item.desk=index;
                                                    item.score=0;
                                                    return item;
                                                  }).sort((a,b)=>a.id-b.id);
                    this.unMount=true;//设定为卸载
                    this.props.navigation.navigate('Draw',{
                        gamer:gamerList,
                        roomId
                    })
                    
                }else if(data.action=='all_gamer'){
                    this.setState(({gamer})=>{
                        let temp=[...deskList];
                        let desker=data.desker;
                        if(desker){
                            temp[desker.id].text=desker.desker==this.props.localStorageData.id?'我':data.gamer.user_name;
                            temp[desker.id].desker=desker.desker;
                        }
                        this.props.dispatch(setDeskList(temp))
                        gamer=gamer.filter(item=>item.id !=data.gamer.id);//去重
                        gamer.push(data.gamer);
                        return {gamer};
                    })
                }else if(data.action=='leave'){
                    if(this.unMount) return ;
                    let temp=deskList.map(item=>{
                        if(item.desker ==data.gamerId){
                            item.text='坐下';
                            item.desker=null;
                        }
                    })
                    this.props.dispatch(setDeskList(temp))
                    this.setState(({gamer})=>{
                        gamer=gamer.filter(item=>item.token !=data.token);
                        return {gamer}
                    })
                }else if(data.action=='inGame'){
                    if(this.unMount) return ;
                   //游戏进行中
                   this.unMount=true;//设定为卸载
                   this.setState({inGame:true})
                }
            })
        }catch(err){
            log(err)
        }
    }
    componentWillUnmount(){
        const {roomId}=this.props;
        if(!roomId) return;
        let token=this.props.localStorageData.token;
        let gamerId=this.props.localStorageData.id;
        let desks=new Array(8).fill({}).map((item,index)=>({
            id:index,
            text:'坐下',
            desker:null,
        
        }));
        this.props.dispatch(setRoomId(null));
        this.props.dispatch(setDeskList(desks));
        this.unMount=true;
        socket.emit('client',{
            type:'drawRoom',
            action:'leave',
            id:roomId,
            token,
            gamerId
        })
    }

    chooseDesk=(desker,desk)=>{
        const {deskList}=this.props;
        if(deskList[desk].desker) return ;//如果这个位置有人，就退出
        const {roomId}=this.props;
        socket.emit('client',{
            type:'drawRoom',
            action:'sitdown',
            id:roomId,
            desker,
            desk
        })

        
    }
    changeTextHandle=(text)=>{
        this.setState({text})
    }
    submitBtn=()=>{
        if(!this.state.text) return ;
        const {roomId}=this.props;
        socket.emit('client',{
            type:'drawRoom',
            action:'chat',
            id:roomId,
            gamer:this.props.localStorageData,
            text:this.state.text
        })
        this.setState({
            text:'',
        })
        Keyboard.dismiss();
    }
    beginGame=()=>{
        const {roomId}=this.props;
        socket.emit('client',{
            type:'drawRoom',
            action:'beginGame',
            id:roomId,
            gamer:this.props.localStorageData,
            text:this.state.text
        })
        ///this.props.navigation.navigate('Draw')
    }
    createRoom=()=>{
        this.props.dispatch(setRoomId(this.props.localStorageData.id))
        this.init(this.props.localStorageData.id)
    }
    joinRoom=(roomId)=>{
        this.props.dispatch(setRoomId(roomId))
            this.listener(roomId);
            socket.emit('client',{
                type:'drawRoom',
                action:'joinRoom',
                id:roomId,
            })
    }

    render() { 
       const { gamer,inputTextList,text ,isFirst,inGame}=this.state;
       const {localStorageData,roomId,deskList}=this.props;
       const deskRender=deskList.map((item,index)=>{
        return(
            <TouchableOpacity key={index} onPress={()=>this.chooseDesk(localStorageData,item.id)}><View style={styles.deskItem}><Text style={styles.deskItemText}>{item.text}</Text></View></TouchableOpacity>            
        )
       })
       const personList=gamer.map(item=>{
           if(item.id==localStorageData.id){
               return ('我、')
           }
           return (item.user_name+'、')
       })
       const inGameRender=inGame
                        ?<View style={styles.advise}><Text style={styles.adviseText}>游戏正在进行中</Text></View>
                        :<View style={styles.advise}><Text style={styles.adviseText}>请耐心等待朋友进入房间</Text></View>;
        const textListRender=inputTextList.map((item,index)=>{
            let component=<View key={index}><Text>{item.gamer.user_name}：{item.text}</Text></View>
            
            return <AnimateText component={component}
                        key={index} 
                        item={item}
                        style={
                            styles.animateWrap
                        }
                        />
        })
       const beginBtn=isFirst
                      ?((deskList.filter(item=>(!!item.desker)).length>0
                                ?<Button type='primary' style={styles.beginBtn} onClick={this.beginGame}>开始游戏</Button>
                                :<Button type='primary' style={styles.beginBtn} disabled>游戏至少需要两人才能开</Button> 
                        ))
                      :<Button type='primary' style={styles.beginBtn} disabled>坐第一个位置的人有权开始游戏</Button> 
       const renderShow=roomId
                        ?<AdjustInput
                        component={
                            <View style={styles.conainer}>
                                <View style={styles.advise}><Text style={styles.adviseText}>房间号{roomId}</Text></View>
                                {inGameRender}
                                <View style={styles.desk}>
                                    {deskRender}
                                </View>
                                  {beginBtn} 
                                <View style={styles.chatLogs}>
                                {textListRender}
                            </View>
                                <View style={styles.personCount}><Text style={styles.personCountText}>当前房间人数（{gamer.length}）：{personList}</Text></View>
                                <View style={styles.inputWrap}>
                                    <InputItem placeholder='聊天，最多输入十个字' 
                                            maxLength={10}
                                            placeholderTextColor='#ccc' 
                                            selectionColor='#ccc'
                                            style={styles.flex}
                                            value={text}
                                            onChange={this.changeTextHandle}
                                            onEndEditing  ={this.submitBtn}
                                        />
                                    <Button type='primary' style={styles.inputBtn} size={35} onClick={this.submitBtn}>确定</Button>
                                </View>
                            </View>
                        }
                    />
                    :<View style={styles.switchRoom}>
                        <Button type='primary' size='large' onClick={this.createRoom}>创建房间</Button>
                        <Button type='primary'  onClick={() => prompt('加入房间', ' ',
                        [
                          { text: '取消' },
                          {
                            text: '提交',
                            onPress: value =>  this.joinRoom(value)
                          },
                        ], 'default', null, ['请输入房间号'])}
                      >加入房间</Button>
                    </View>
       return (
           <View style={styles.flex}>
                {renderShow}
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1
    },
    conainer:{
        flex:1,
    },
    btnText:{
        paddingHorizontal:5,
        paddingVertical:8,
        color:'#108ec6'
    },
    advise:{
        backgroundColor:'#FF82AB',
        height:25,
        justifyContent:'center',
        alignItems:'center'
    },
    adviseText:{
        color:'#fff'
    },
    desk:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginHorizontal:10,
        flexWrap:'wrap'
    },
    deskRow:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:10,
    },
    deskItem:{
        width:65,
        height:45,
        marginHorizontal:5,
        marginVertical:10,
        borderRadius:5,
        backgroundColor:'#FF82AB',
        alignItems:'center',
        justifyContent:'center'
    },
    deskItemText:{
        color:'#fff',
    },
    personCount:{
        backgroundColor:'#3f87a6',
        height:25,
        justifyContent:'center',
        paddingLeft:20
    },
    personCountText:{
        color:'#fff'
    },
    beginBtn:{
        marginHorizontal:20,
        marginVertical:10
    },
    inputWrap:{
        height:35,
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
    showTextWrap:{
        backgroundColor:'#3f87a6',
        height:35,
        justifyContent:'center',
    },
    showTextItem:{
        height:35,
        justifyContent:'center',
        position:'absolute',
        flexDirection:'row'
    },
    showText:{
        marginLeft:20,
      
    },
    chatLogs:{
        height:200,
        backgroundColor:'rgba(0,0,0,0.1)'
    },
    switchRoom:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    animateWrap: {
        flex:1,
        zIndex:9999,
        position:'absolute',

    },
    animateText:{
        color:'#333',
        fontSize:16
    },
    
})


function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(DrawingEntry)