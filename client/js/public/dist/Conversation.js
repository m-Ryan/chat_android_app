import React from 'react';
import {connect} from 'react-redux'
import {
    Component,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    WebView,
    Dimensions,
    Vibration
} from 'react-native';
import {
    setLocalStorageData,
    setMainContainerType,
    setSearchResultData,
    fromLocalChatLog,
    setLinkmanList,
    addChatLog,
    setFriendRequest,
    setAddFriend,
    setDeleteFriend,
    setPhotoUnreadNum,
    setGroupList,
    deleteGroupMember,
    addGroupMember,
    setDeleteGroup,
    setIsReceiveMes,
    setIsReceiveReplay,
    setNotificationData,
    setLove,
    setNavigator,
    setBottomNavigator,
    setCurrentChatMan,
    deleteConversation,
    setlogLevel
} from '../../other/actions';

import {
    Button,
    SearchBar,
    Icon,
    Badge,
    SwipeAction,
    List,
    Toast
} from 'antd-mobile';
import Service from '../../other/Service';
import CustomHeader from '../component/CustomHeader';
import moment from 'moment';
import FloatMenuBar from '../component/FloatMenuBar';
import domain from '../../other/domain';
const {width, height} = Dimensions.get('window');
import FriendRequest from '../component/FriendRequest';
import ConversationList from '../component/ConversationList';
import HeaderBar from '../component/HeaderBar';
import unescapeText from '../../other/unescapeText';
import initSetting from '../../other/initSetting';
class Action extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({header: null});
    constructor(props) {
        super(props);
        this.state = {
            newNewMesg: false,
            soundOpen: props.soundOpen,
            groupSoundOpen: props.groupSoundOpen
        }
    }
   async componentWillMount() {
        let user=await GlobalStorage.load({key:'user'});
        initSetting(user,this.props.dispatch,this.props.navigation);
        if (!this.props.bottomNavigator) {
            this
                .props
                .dispatch(setBottomNavigator(this.props.navigation))
        }
        this.socketListener()
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.soundOpen != nextProps.soundOpen || this.props.groupSoundOpen != nextProps.groupSoundOpen) {
            this.setState({soundOpen: nextProps.soundOpen, groupSoundOpen: nextProps.groupSoundOpen})
        }
    }
    chatHandle = (item) => {
        this
            .props
            .dispatch(setCurrentChatMan(item.chatMan))
        this
            .props
            .navigator
            .navigate('ChatPage', {chatMan: item.chatMan})
    }

    //置顶
    stickHandle = (id, logType) => {
        this
            .props
            .dispatch(setlogLevel(this.props.localStorageData.id, id, logType))
    }
    //删除会话
    deleteConversationHandle = (id, logType) => {
        this
            .props
            .dispatch(deleteConversation(this.props.localStorageData.id, id, logType))
    }
    socketListener = async() => {
        try {
            const user = await GlobalStorage.asyncLoad('user');
            const {dispatch,localStorageData , currentChatMan,navigation} = this.props;
            /**
         * 开启监听
         */
            //监听登陆，只能唯一登录
            /*       socket.on('login'+user.id,  (data)=> {
                const storage=Storage.get('user');
                if(storage.user_uid !=data.user.user_uid){
                    message.warn('您的账号在其他地方登陆，如非本人操作，请尽快修改密码',2);
                    this.props.history.push('/login');
                }
            })
        */
            //开启全局监听
            try {
                socket.on('notification', (data) => {
                    const {localStorageData} = this.props;
                    if (user.id != localStorageData.id) 
                        return;
                    const {soundOpen, groupSoundOpen} = this.state;
                    let id = data.u_id;
                    data.data=unescapeText(data.data,currentChatMan,localStorageData,dispatch,navigation);
                    let temp = {
                        id,
                        unread: (currentChatMan.id == id)
                            ? 0
                            : 1,
                        data: data
                    };
                    let options = {
                        uid: user.id,
                        rid: data.u_id
                    }
                    try {
                        Service.setRead(options) //设置为已读
                    } catch (err) {}
                    if ((data.u_id !== user.id) && !((currentChatMan.id == data.u_id))) {
                        if (soundOpen) {
                            Vibration.vibrate([
                                0, 500
                            ], false)
                        }
                    }
                    
                    dispatch(addChatLog(user.id, temp, 'private'));
                });
            } catch (err) {
                Toast.info(err + '--监听管理员推送')
            }
            //开启用户聊天监听
            try {
                socket.on(user.id, (data) => {
                    const {soundOpen, groupSoundOpen} = this.state;
                    const {localStorageData ,currentChatMan, dispatch} = this.props;
                    if (user.id != localStorageData.id) 
                        return;
                    if (data.u_id == user.id) 
                        return;
                    let options = {
                        uid: user.id,
                        rid: data.u_id
                    }
                    try {
                        Service.setRead(options) //设置为已读
                    } catch (err) {
                        Toast.info(err)
                    }
                    let id = user.id == data.u_id
                        ? data.r_id
                        : data.u_id;
                    data.unread = (currentChatMan.id == id)
                        ? 0
                        : 1;
                    data.user_id = data.r_id;
                    data=unescapeText(data,currentChatMan,localStorageData,dispatch,navigation);
                    let temp = {
                        id,
                        data
                    };
                    let chatMan = this
                        .props
                        .linkmanListData
                        .filter(item => item.id == data.u_id)[0];
                    if (!chatMan) 
                        return false;
                    if (data.u_id == currentChatMan.id) {
                        dispatch(addChatLog(user.id, temp, 'private', chatMan));
                    } else {
                        dispatch(addChatLog(user.id, temp, 'private', chatMan));
                        if (soundOpen) {
                            Vibration.vibrate([
                                0, 500
                            ], false)
                        }
                    }
                });
            } catch (err) {
                Toast.info(err + '聊天监听出错')
            }
            //开启好友请求通知
            try {
                socket.on(user.id + 'newFriend', (data) => {
                    const {localStorageData} = this.props;
                    if (user.id != localStorageData.id) 
                        return;
                    const {soundOpen, groupSoundOpen} = this.state;
                    Toast.info(`${data.name} 希望添加您为好友`);
                    if (soundOpen) {
                        Vibration.vibrate([
                            0, 500
                        ], false)
                    }
                    //获取添加好友请求
                    try {
                        Service
                            .getFriendRequest(user.id)
                            .then(result => {
                                if (result.length > 0) {
                                    dispatch(setFriendRequest(result))
                                }
                            })
                    } catch (err) {
                        Toast.info(err)
                    }
                });
            } catch (err) {
                Toast.info(err)
            }
            //开启好友回应请求通知
            try {
                socket.on('response' + user.id, (data) => {
                    const {localStorageData} = this.props;
                    if (user.id != localStorageData.id) 
                        return;
                    const {soundOpen, groupSoundOpen} = this.state;
                    if (soundOpen) {
                        Vibration.vibrate([
                            0, 500
                        ], false)
                    }
                    Toast.info(`${data.name} ${data.accept == true
                        ? '接受'
                        : '拒绝'}了您的好友申请`);
                    if (data.accept) {
                        //获取添加好友请求
                        Service
                            .getFriendInfo(data.id)
                            .then(result => {
                                if (result) {
                                    dispatch(setAddFriend(user.id, result))
                                }
                            })
                    }
                });
            } catch (err) {
                Toast.info(err)
            }
            //开启删除好友通知
            try {
                socket.on('notFriend' + user.id, (data) => {
                    const {localStorageData} = this.props;
                    if (user.id != localStorageData.id) 
                        return;
                    const {soundOpen, groupSoundOpen} = this.state;
                    if (soundOpen) {
                        Vibration.vibrate([
                            0, 500
                        ], false)
                    }
                    Toast.info(`${data.name} 从好友列表中移除了您`);
                    dispatch(setDeleteFriend(localStorageData.id, data.id))
                });
            } catch (err) {
                Toast.info(err)
            }

            //开启朋友圈回复通知
            try {
                socket.on('photo-relative' + user.id, (data) => {
                    const {localStorageData} = this.props;
                    if (user.id != localStorageData.id) 
                        return;
                    const {soundOpen, groupSoundOpen} = this.state;
                    if (soundOpen) {
                        Vibration.vibrate([
                            0, 500
                        ], false)
                    }
                    Toast.info(` ${data.name} 在朋友圈回复了 你`)
                    dispatch(setIsReceiveReplay(data.data))
                    try {
                        Service
                            .getPhotoUnread(user.id)
                            .then(result => {
                                dispatch(setPhotoUnreadNum(result))
                            })
                    } catch (err) {
                        Toast.info(err)
                    }
                });
            } catch (err) {
                Toast.info(err)
            }

            try {
                socket.on('setLove' + user.id, (data) => {
                    const {u_name, add, p_id, u_id, r_id} = data;
                    if (u_id == user.id) 
                        return;
                    const {soundOpen, groupSoundOpen} = this.state;
                    if (soundOpen) {
                        Vibration.vibrate([
                            0, 500
                        ], false)
                    }
                    Toast.info(add
                        ? ` ${u_name} 赞了你的动态`
                        : ` ${u_name} 取消了点赞`)
                    dispatch(setLove(p_id, add, u_name));
                });
            } catch (err) {
                Toast.info(err)
            }
            try {
                socket.on('group', (data) => {
                    const {localStorageData} = this.props;
                    if (user.id != localStorageData.id) 
                        return;
                    const {groupListData, soundOpen, groupSoundOpen} = this.props;
                    let isExist = groupListData.some(item => item.id == data.gid); //这个群是否存在
                    let isAdd = data.member
                        ? data
                            .member
                            .some(item => item.id == user.id)
                        : false;
                    if (!isExist && !isAdd) {
                        return false;
                    }
                    switch (data.do) {
                        case 'deleteMember':
                            if (isExist) {
                                dispatch(deleteGroupMember(user.id, data.id, data.gid));
                            }
                            break;
                        case 'exit':
                            if (isExist) {
                                dispatch(deleteGroupMember(user.id, data.id, data.gid));
                            }
                            break;
                        case 'addGroupMember':
                            if (isAdd) {
                                try {
                                    Service
                                        .getGroup(user.id)
                                        .then(result => {
                                            dispatch(setGroupList(user.id, result))
                                        })
                                } catch (err) {
                                    Toast.info(err)
                                }
                            } else if (isExist) {
                                this
                                    .props
                                    .dispatch(addGroupMember(this.props.localStorageData.id, data.member, data.gid));
                            }
                            break;
                        case 'deleteGroup':
                            //'群解散通知
                            if (data.leader.id != user.id) {
                                if (groupSoundOpen) {
                                    Vibration.vibrate([
                                        0, 500
                                    ], false)
                                }
                                Toast.info(`${data.leader.name} 解散了该群（${data.name}）`);
                            }
                            dispatch(setDeleteGroup(data.gid));
                            break;
                        case 'addLog':
                            const {currentChatMan} = this.props;
                            data.data.unread = (currentChatMan.id == data.gid)
                                ? 0
                                : 1;
                                data.data=unescapeText(data.data,currentChatMan,localStorageData,dispatch,navigation);
                            let temp = {
                                id: data.gid,
                                type: data.type,
                                data: data.data
                            };
                            let chatMan = groupListData.filter(item => item.id == data.gid)[0];
                            if (!chatMan) 
                                return false;
                            if (user.id == data.uid) {
                                return;
                            } else if (data.gid == currentChatMan.id) { //信息接收时，当前页面是发送的群
                                dispatch(addChatLog(user.id, temp, 'group', chatMan));
                            } else {
                                dispatch(addChatLog(user.id, temp, 'group', chatMan));
                                if (groupSoundOpen) {
                                    Vibration.vibrate([
                                        0, 500
                                    ], false)
                                }
                            }

                            break;
                    }
                })
            } catch (err) {
                Toast.info(err)
            }
        } catch (err) {
            Toast.info(err + '--开启socket出错')
        }
    }

    render() {
        return (
            <View style={styles.flex}>
                <HeaderBar/>
                <View style={styles.conversationList}>
                    <FriendRequest/>
                    <ConversationList/>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    conversationItem: {
        flexDirection: 'row',
        height: 55
    },
    itemWrap: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc'
    },
    shade: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },
    contentInfo: {
        marginRight: 10,
        flex: 1
    },
    conversationList: {
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        marginTop: 50
    },
    avator: {
        height: 54,
        width: 54,
        borderRadius: 1,
        borderWidth: 1,
        borderColor: '#f5f5f9'
    },
    cName: {
        height: 30,
        paddingTop: 5,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    cNameText: {
        color: '#000',
        fontSize: 18,
        marginLeft: 10
    },
    cContent: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        paddingRight: 20
    },
    cContentText: {
        height: 40,
        flexDirection: 'row'
    },
    cTime: {
        alignSelf: 'center'
    },
    menuItem: {
        backgroundColor: '#fff'
    },
    unreadNum: {
        backgroundColor: '#f04134',
        borderRadius: 15,
        height: 24,
        justifyContent: 'center'
    },
    unreadNumText: {
        color: '#fff',
        fontSize: 12,
        paddingHorizontal: 8
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)