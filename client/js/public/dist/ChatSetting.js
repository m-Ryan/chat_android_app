import React from 'react';
import { connect } from 'react-redux'
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { Button ,SearchBar , ActionSheet, Toast, Icon} from 'antd-mobile';
import HeaderBar from '../component/HeaderBar';
import domain from '../../other/domain';
import Popconfirm from '../component/Popconfirm';
import {deleteLogs ,setDeleteFriend ,setCurrentChatMan ,deleteGroupMember ,setDeleteGroup} from '../../other/actions';
import Service from '../../other/Service';
 class Action extends React.Component {
    static navigationOptions = ({ navigation }) => ({  
        title:'聊天设置'
    });
    constructor(props){
      super(props);
    }
    readFriendInfo=()=>{
        this.props.navigator.navigate('FriendInfo',{
            chatMan:this.props.navigation.state.params.chatMan
        })
    }
    readCollection=(currentChatMan)=>{
        this.props.navigation.navigate('Collection',{
            user:this.props.currentChatMan
        })
    }
    deleteAllLogsHandle=()=>{
        const BUTTONS = ['删除', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '你确定要删除该好友的聊天记录？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                this.props.dispatch(deleteLogs(this.props.localStorageData.id,this.props.currentChatMan.id,'private'));
            }
          });
    }
    deleteFriendHandle=()=>{
        if(this.props.currentChatMan.id==1){
          return Toast.info('抱歉，管理员不能删除')
        }
        const BUTTONS = ['删除', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '你确定要删除该好友？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                let user_id=this.props.localStorageData.id;
                let linkman_id=this.props.currentChatMan.id;
                this.props.dispatch(deleteLogs(this.props.localStorageData.id, linkman_id))
                let options={
                    user_id,
                    linkman_id
                }
               Service.deleteFriend(options)
                    .then(result=>{
                        if(result){
                            socket.emit('client', {
                                name:'notFriend'+linkman_id,
                                data:{
                                    name:this.props.localStorageData.user_name,
                                    id:user_id
                                },
                                deleteFriend:true
                            });
                            socket.emit('client', {
                                name:'notFriend'+linkman_id,
                                data:{
                                    name:this.props.localStorageData.user_name,
                                    id:user_id
                                },
                                deleteFriend:true
                            });
                            this.props.dispatch(setDeleteFriend(this.props.localStorageData.id,linkman_id));
                            this.props.dispatch(deleteLogs(this.props.localStorageData.id,this.props.currentChatMan.id,'private'));
                            this.props.dispatch(setCurrentChatMan({}))
                            this.props.navigator.navigate('Index')
                        }
                    })
            }
          });
    }
    readGroupMenber=(group)=>{
        this.props.navigator.navigate('GroupMember',{
            group
        })
    }
    addGroupMenber=(group)=>{
        this.props.navigator.navigate('AddGroupMember',{
            group
        })
    }
    //解散该群
    deleteGroupHandle=(group)=>{
        const BUTTONS = ['解散', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '你确定要解散该群？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                Service.deleteGroup(group.id)
                .then(
                    result=>{
                        this.props.dispatch(deleteLogs(this.props.localStorageData.id,this.props.currentChatMan.id,'group'));
                        socket.emit('client', { 
                            type:'group',
                            gid:group.id,
                            leader:{
                                id:this.props.localStorageData.id,
                                name:this.props.localStorageData.user_name,
                            },
                            name:group.user_name,
                            do:'deleteGroup',
                        });
                        this.props.navigator.navigate('Index')
                    }
                )
            }
          })
    }
    //退群
    deleteMember=(id,group)=>{
        const BUTTONS = ['确定', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '你确定要退出该群？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                Service.deleteMember(id,group.id)
                .then(
                    result=>{
                        this.props.dispatch(deleteLogs(this.props.localStorageData.id,this.props.currentChatMan.id,'group'));
                        this.props.dispatch(setDeleteGroup(this.props.localStorageData.id,group.id));
                         socket.emit('client', { 
                             type:'group',
                             id:id,
                             gid:group.id,
                             do:'exit',
                         });
                         this.props.navigator.navigate('Index')
                    }
                )
            }
          })
    }

    deleteGroupLogsHandle=()=>{
        const BUTTONS = ['删除', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '你确定要删除该群的聊天记录？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                this.props.dispatch(deleteLogs(this.props.localStorageData.id,this.props.currentChatMan.id,'group'));
            }
          });
    }
    render() { 
       const {navigation ,localStorageData}=this.props;
       let currentChatMan=navigation.state.params.chatMan;
       const memberControl=(currentChatMan.leader==localStorageData.id)
                        ? <TouchableOpacity style={styles.userBtn} onPress={()=>this.deleteGroupHandle(currentChatMan)}><Text style={styles.btnText}>解散该群</Text></TouchableOpacity>
                        : <TouchableOpacity style={styles.userBtn} onPress={()=>this.deleteMember(localStorageData.id,currentChatMan)}><Text style={styles.btnText}>退出该群</Text></TouchableOpacity>
       const renderShow=currentChatMan.leader
                        ?<View>
                            <TouchableWithoutFeedback style={styles.userBtn}>
                                    <View style={{padding:10,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        borderBottomWidth:0.5,
                                        borderColor:'#ccc',
                                        }}>
                                        <Image source={{uri:domain+currentChatMan.user_faceSrc}} style={styles.avator}/>
                                        <Text style={styles.userName}>{currentChatMan.user_name}</Text>
                                    </View>
                            </TouchableWithoutFeedback>
                            <TouchableOpacity style={styles.userBtn} onPress={()=>this.readGroupMenber(currentChatMan)}><Text style={styles.btnText}>查看群成员</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn} onPress={()=>this.addGroupMenber(currentChatMan)}><Text style={styles.btnText}>添加群成员</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.userBtn} onPress={this.deleteGroupLogsHandle}><Text style={styles.btnText}>删除聊天记录</Text></TouchableOpacity>
                           {memberControl}
                        </View>
                        :<View>
                        <TouchableOpacity style={styles.userBtn} onPress={this.readFriendInfo}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Image source={{uri:domain+currentChatMan.user_faceSrc}} style={styles.avator}/>
                                    <Text style={styles.userName}>{currentChatMan.user_name}</Text>
                                </View>
                                <Text><Icon type={"\uE61F"} color='#666'/></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.userBtn} onPress={()=>this.readCollection(currentChatMan)}><Text style={styles.btnText}>查看{currentChatMan.user_sex==0?'他':'她'}的收藏</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.userBtn} onPress={this.deleteAllLogsHandle}><Text style={styles.btnText}>删除聊天记录</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.userBtn} onPress={this.deleteFriendHandle}><Text style={styles.btnText}>删除好友</Text></TouchableOpacity>
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
        flex:1,
    },
    avator:{
        width:60,
        height:60,
        borderRadius:60
    },
    userBtn:{
        padding:10,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:0.5,
        borderColor:'#ccc',
        justifyContent:'space-between'
    },
    userName:{
        color:'#333',
        fontSize:18,
        marginLeft:20
    },
    btnText:{
        fontSize:18
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)