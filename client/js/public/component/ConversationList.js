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
} from 'react-native';
import {
    setLocalStorageData,
    setMainContainerType,
    setSearchResultData,
    fromLocalChatLog,
    setLinkmanList,
    setFriendRequest,
    setPhotoUnreadNum,
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
    WhiteSpace
} from 'antd-mobile';
import CustomHeader from './CustomHeader';
import moment from 'moment';
import FloatMenuBar from './FloatMenuBar';
import domain from '../../other/domain';
import htmlLog from '../../other/htmlLog';
const {width, height} = Dimensions.get('window');

class Action extends React.Component {
    constructor(props) {
        super(props);
    }
    chatHandle = (item) => {
        let type=item.chatMan.leader?'GroupChat':'ChatPage';
        this
            .props
            .dispatch(setCurrentChatMan(item.chatMan))
        this
            .props
            .navigator
            .navigate(type, {chatMan: item.chatMan})
    }

    //置顶
    stickHandle=(id,logType)=>{
        this.props.dispatch(setlogLevel(this.props.localStorageData.id,id,logType))
    }
    //删除会话
    deleteConversationHandle=(id,logType)=>{
        this.props.dispatch(deleteConversation(this.props.localStorageData.id,id,logType))
    }

  
    render() {
        const {
            dispatch,
            localStorageData,
            chatLog,
            currentChatMan,
            friendRequest
        } = this.props;
        const logList =chatLog.length? chatLog.map((item, index) => {
            if (item.level === 0 || (!item.log.length)) 
                return null;
            let chatMan = item.chatMan;
            const lastLog = htmlLog(item.lastLog, false, {fontSize: 16});
            let unreadRender = item.unread
                ? <View style={styles.unreadNum}>
                        <Text style={styles.unreadNumText}>{item.unread <= 99
                                ? item.unread
                                : '99+'}</Text>
                    </View>
                : null;
            let component = <SwipeAction
                style={{
                    backgroundColor: '#f8f8f8'
            }}
                autoClose
                right={[
                {
                    text: '置顶',
                    onPress: ()=>this.stickHandle(chatMan.id,item.logType),
                    style: {
                        backgroundColor: '#ddd',
                        color: 'white'
                    }
                }, {
                    text: '删除',
                    onPress: () => this.deleteConversationHandle(chatMan.id,item.logType),
                    style: {
                        backgroundColor: '#F4333C',
                        color: 'white'
                    }
                }
            ]}>
                <List.Item >
                    <TouchableOpacity onPress={() => this.chatHandle(item)} >
                        <View style={styles.conversationItem}>
                            <View>
                                <Image
                                    source={{
                                    uri: domain + chatMan.user_faceSrc
                                }}
                                    style={styles.avator}/>
                            </View>
                            <View style={styles.contentInfo}>
                                <View style={styles.cName}>
                                    <View>
                                        <Text style={styles.cNameText}>{chatMan.user_name}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.cTime}>{moment(item.lastChatDate).format('HH:mm')}</Text>
                                    </View>
                                </View>
                                <View style={styles.cContent}>
                                    {lastLog}
                                    {unreadRender}
                                </View>
                            </View>
                            <View style={styles.shade}></View>
                        </View>
                    </TouchableOpacity>
                </List.Item>
            </SwipeAction>
                              
            return (
                <View
                    key={index}
                    style={styles.itemWrap}>
                    <View style={styles.flex}>
                        {component}
                    </View>
                </View>
            )
        }):null;

        const renderShoww=logList
                        ?<View>
                            <WhiteSpace/>
                            <Text>会话列表</Text>
                            <WhiteSpace/>
                            {logList}
                        </View>
                        :null
        return (
            <View>
                {renderShoww}
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
        height: 55,
    },
    itemWrap:{
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
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
        backgroundColor: '#fff'
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