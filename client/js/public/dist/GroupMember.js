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
import {Button, SearchBar, Icon, ImagePicker, InputItem ,Toast ,WhiteSpace,SwipeAction,List ,ActionSheet} from 'antd-mobile';
import uploadImg from '../../other/uploadImg';
const domain = 'http://chat.maocanhua.cn';
import {  setCurrentChatMan ,deleteGroupMember } from '../../other/actions';
import Service from '../../other/Service';
class Action extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({title: '群成员'})
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    readInfo=(chatMan)=>{
        this.props.navigator.navigate('FriendInfo',{
            chatMan
        })
    }
    //删除
    deleteMember=(id,group)=>{
        const BUTTONS = ['确定', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '你确定要删除吗？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                Service.deleteMember(id,group.id)
                .then(
                    result=>{
                        this.props.dispatch(deleteGroupMember(this.props.localStorageData.id,id,group.id))
                         socket.emit('client', { 
                             type:'group',
                             id:id,
                             gid:group.id,
                             do:'exit',
                         });
                    }
                )
            }
          })
    }
    render() {
        const group=this.props.navigation.state.params.group;
        const member=[...group.member.filter(item=>(group.linkmanList.indexOf(item.id) !=-1))]
        const leader=group?member.filter(item=>item.id==group.leader)[0]: null;
        const memberList=group
                        ?(member.filter(item=>item.id !=group.leader)).map((item,index)=>(


                            <SwipeAction
                            key={index}
                            style={{
                            backgroundColor: '#f8f8f8'
                        }}
                            autoClose
                            right={[
                           {
                                text: '删除',
                                onPress: () =>this.deleteMember(item.id,group),
                                style: {
                                    backgroundColor: '#F4333C',
                                    color: 'white'
                                }
                            }
                        ]}>
                            <View >
                                <TouchableOpacity onPress={()=>this.readInfo(item)}>
                                <View style={styles.memberItem}>
                                    <Image source={{uri:domain+item.user_faceSrc}} style={styles.avator}/>
                                    <Text style={styles.name}>{item.user_name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </SwipeAction>
                        ))
                        :null;
        let renderShow=group
                      ?<View  style={styles.flex}>
                            <WhiteSpace />
                            <Text style={styles.title}>群主</Text>
                            <WhiteSpace />
                                <TouchableOpacity onPress={()=>this.readInfo(leader)}>
                                <View style={styles.memberItem}>
                                    <Image source={{uri:domain+leader.user_faceSrc}} style={styles.avator}/>
                                    <Text style={styles.name}>{leader.user_name}</Text>
                                </View>
                              </TouchableOpacity>
                            <View>
                                <WhiteSpace />
                                <Text style={styles.title}>成员</Text>
                                <WhiteSpace />
                                {memberList}
                            </View>
                        </View>
                        :null;
        return (
            <ScrollView>
                {renderShow}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
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
        padding:10
    },
    name:{
        color:'#000',
        fontSize:16,
        marginLeft:20
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)