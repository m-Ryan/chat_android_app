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
  Keyboard,
} from 'react-native';
import { Button ,SearchBar ,WhiteSpace ,Toast ,ActivityIndicator} from 'antd-mobile';
import HeaderBar from '../component/HeaderBar';
import domain from '../../other/domain';
import Service from '../../other/Service';
import {setAddFriend ,deleteFriendRequest} from '../../other/actions';
 class Action extends React.Component {
    static navigationOptions = ({ navigation }) => ({  
        title:`${navigation.state.params.chatMan.user_name}的个人信息`
    });
    constructor(props){
      super(props);
      this.state={
        loading:false,
        chatMan:null
      }
    }
     componentWillMount(){
       Service.getFriendInfo(this.props.navigation.state.params.chatMan.id)
              .then(
                  chatMan=>{
                    this.setState({chatMan})
                  }
              )
            
    }
    addFriendHandle=(item)=>{
        this.setState({loading:true})
        let options={
            user_id:this.props.localStorageData.id,
            user_linkman:this.props.localStorageData.user_linkman || [],
            friend_id:item.id,
        }
        Service.sendFriendRequest(options)
            .then(
                result=>{
                    this.setState({loading:false})
                    if(result){
                        Toast.success('好友请求已发送');
                        let name=item.id+'newFriend';
                        socket.emit('client', {
                            name,
                            data:{
                                name:this.props.localStorageData.user_name
                            },
                            newFriend:true
                        });
                    }
                }
            )
    }

    //同意添加好友
    agreeFriendHandle=(id)=>{
        const item=this.props.friendRequest.filter(item=>item.id==id)[0];
        if(!item) return;
        let flag=true; 
        let options={
            accept:flag,
            uid:this.props.localStorageData.id,
            rid:item.id,
            fid:item.fid,
        }
        Service.addFriend(options)
               .then(
                   result=>{
                      if(result){
                        this.props.dispatch(setAddFriend(this.props.localStorageData.id,result))
                        this.props.dispatch(deleteFriendRequest(item.fid))
                        socket.emit('client', {
                            response:true,
                            data:{
                                accept:flag,
                                id:this.props.localStorageData.id,
                                name:this.props.localStorageData.user_name,
                                user:this.props.localStorageData
                            },
                            name:'response'+item.id,
                        });
                      }
                   }
               )
    }

    getFriend=(currentChatMan)=>{
        const {navigation ,linkmanListData ,localStorageData,friendRequest} = this.props;
        const {user_name,user_sex,user_adress,user_birthday,user_signature,user_faceSrc,user_email}=currentChatMan;
        const userImg=domain+user_faceSrc;
 
        let temp=[localStorageData,...linkmanListData]
        let addFriendRender=temp.some(child=>child.id==currentChatMan.id)
        ?null
        :friendRequest.some(item=>item.id==currentChatMan.id)
             ?<Button type='primary' loading={this.state.loading} onClick={()=>this.agreeFriendHandle(currentChatMan.id)} ><Text>同意加为好友</Text></Button>
              :<Button type='primary' loading={this.state.loading} onClick={()=>this.addFriendHandle(currentChatMan)}><Text>加为好友</Text></Button>
        return (
            <View style={styles.container}>
                <Text style={styles.text}>用户名　：{currentChatMan.user_name}</Text>
                <Text style={styles.text}>邮箱　　：{currentChatMan.user_email}</Text>
                <Text style={styles.text}>性别　　：{currentChatMan.user_sex==0?'男':'女'}</Text>
                <Text style={styles.text}>生日　　：{currentChatMan.user_birthday}</Text>
                <Text style={styles.text}>现居地　：{currentChatMan.user_adress}</Text>
                <Text style={styles.text}>个性签名：{currentChatMan.user_signature}</Text>
                <WhiteSpace />
                {addFriendRender}
            </View> 
        )
    }
    render() { 
       const renderShow=this.state.chatMan
                        ?this.getFriend(this.state.chatMan)
                        :<ActivityIndicator size="large" />
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
    container:{
        backgroundColor:'#fff',
        padding:10,
        flex:1,
    },
    text:{
        fontSize:18,
        borderBottomWidth:0.5,
        borderColor:'#ccc',
        paddingHorizontal:10,
        paddingVertical:10
    }
  
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)