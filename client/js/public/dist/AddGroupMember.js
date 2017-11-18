import React from 'react';
import {connect} from 'react-redux'
import {
    Component,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import {Button, SearchBar, Icon, ImagePicker, InputItem ,Toast ,WhiteSpace ,ActivityIndicator} from 'antd-mobile';
import uploadImg from '../../other/uploadImg';
const domain = 'http://chat.maocanhua.cn';
import Service from '../../other/Service';
class Action extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        header:null
    })
    constructor(props) {
        super(props);
        this.state = {
            chooseArray:[],
            loading:false
        }
    }
    submitHandle=()=>{
        this.setState({loading:true})
        const {currentChatMan ,linkmanListData}=this.props;
        let chooseArray=this.state.chooseArray;
        if(!chooseArray.length) return ;
        let options = {
            newLinkman: chooseArray,
            gid: currentChatMan.id
        }
       try{
        Service
        .addGroupMember(options)
        .then(result => {
            if (result) {
                try{
                    let temp = [];
                    for (let i = 0; i < linkmanListData.length; i++) {
                        for (let j = 0; j < chooseArray.length; j++) {
                            if (chooseArray[j] == linkmanListData[i].id) {
                                temp.push(linkmanListData[i])
                            }
                        }
                    }
                    socket.emit('client', {
                        type: 'group',
                        member: temp,
                        gid: currentChatMan.id,
                        do : 'addGroupMember'
                });
                }catch(err){
                    Toast.info(err)
                }
            } else if (result == null) {
              
            }
            this.setState({loading:false})
        })
       }catch(err){
           Toast.info(err)
       }
    }
    readInfo=(chatMan)=>{
        this.props.navigator.navigate('FriendInfo',{
            chatMan
        })
    }
    setChoose=(id,flag)=>{
        const chooseArray=this.state.chooseArray;
        let temp=[];
        if(flag){
            temp=chooseArray.filter(item=>item!=id);
        }else{      
            chooseArray.push(id);
            temp=chooseArray;
        }
        this.setState({chooseArray:temp})
    }
    render() {
        const {linkmanListData ,navigation}=this.props;
        const {chooseArray ,loading} =this.state;
        const submitBtn=loading
                ?<ActivityIndicator color='#fff'/>
                :<TouchableOpacity onPress={this.submitHandle} style={styles.extraBtn}>
                    <Text style={styles.okText}>确定</Text>
                </TouchableOpacity>
        const group=navigation.state.params.group;
        const memberList=linkmanListData.filter(item=>group.linkmanList.indexOf(item.id)==-1)
        const memberListRender=memberList
                        ?(memberList.filter(item=>item.id !=group.leader && item.id!=1)).map(item=>{
                            const isChoose=!(chooseArray.indexOf(item.id)==-1);
                            const chooseIcon=(isChoose)
                                        ?<Icon type={"\uE630"} color='#108ec6'/>
                                        :<View style={styles.unChoose}></View>;
                            return (
                                <View key={item.id}>
                                    <TouchableOpacity onPress={()=>this.readInfo(item)}>
                                    <View style={styles.memberItem}>
                                        <Image source={{uri:domain+item.user_faceSrc}} style={styles.avator}/>
                                        <Text style={styles.name}>{item.user_name}</Text>
                                        <View style={styles.chooseWrap}>
                                            <TouchableOpacity onPress={()=>this.setChoose(item.id,isChoose)}>
                                                {chooseIcon}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                        :null;
        return (
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} ><Icon type={"\uE61C"} color='#fff' size={24}/></TouchableOpacity>
                    <Text style={styles.text}>添加群成员</Text>
                    {submitBtn}
                </View>        
                <ScrollView>
                    <WhiteSpace />
                    {memberListRender}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    header: {
        backgroundColor: '#108ee9',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    text: {
        color: '#fff',
        fontSize: 18
    },
    headerBtn: {
        paddingHorizontal: 20
    },
    headerIcon: {
        fontSize: 20,
        color: '#fff'
    },
    okText:{
        color:'#fff'
    },
    avator:{
        width:40,
        height:40,
        borderRadius:40
    },
    title:{
        marginLeft:10,
        fontSize:16
    },
    memberItem:{
        backgroundColor:'#fff',
        borderBottomWidth:0.5,
        borderBottomColor:'#ccc',
        flexDirection:'row',
        padding:10,
        alignItems:'center'
    },
    name:{
        color:'#000',
        fontSize:16,
        marginLeft:20
    },
    chooseWrap:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    unChoose:{
        width:23,
        height:23,
        borderRadius:23,
        borderWidth:1,
        borderColor:'#666',
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)