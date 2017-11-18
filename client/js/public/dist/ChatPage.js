import React from 'react';
import {connect} from 'react-redux'
import {
    Component,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    WebView,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Clipboard
} from 'react-native';
import {Button, SearchBar, Icon, ActivityIndicator, Toast} from 'antd-mobile';
import HeaderBar from '../component/HeaderBar';
import moment from 'moment';
import momentLocale from 'moment/locale/zh-cn';
moment.updateLocale('zh-cn', momentLocale);
import domain from '../../other/domain';
const {width, height} = Dimensions.get('window');
import CustomEditor from '../component/CustomEditor';
import {setCurrentChatMan, addChatLog, setUnread, deleteLog} from '../../other/actions';
import Service from '../../other/Service';
import FloatMeunBar from '../component/FloatMenuBar';
import unescapeText from '../../other/unescapeText';
class Action extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header: <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Icon type={"\uE61C"} color='#fff'/></TouchableOpacity>
                <View style={styles.middle}>
                    <Text style={styles.text}>{navigation.state.params.chatMan.user_name}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ChatSetting', {chatMan: navigation.state.params.chatMan})}
                    style={styles.extraBtn}>
                    <Icon type={"\uE66A"} color='#fff' style={styles.headerIcon}/>
                </TouchableOpacity>
            </View>
    });
    constructor(props) {
        super(props);
        this.state = {
            scrollHeight: 0,
            num: 10,
            isloadEnd: false,
            type: 'private',
            isfetched: false,
            keybordHeight: height,
            floatMenu: {
                uid: null,
                visible: false,
                x: 0,
                y: 0
            }
        }
        this.isLoading = false;
        this.scrollEnd=true;
    }

    componentWillMount() {
        const {localStorageData, currentChatMan, chatLog} = this.props;
        let isunread = chatLog.some(item => {
            if (item.chatMan.id == currentChatMan.id && item.unread) {
                return true
            }
            return false
        })
        if (isunread) {
            let options = {
                uid: localStorageData.id,
                rid: currentChatMan.id
            }
            Service.setRead(options) //设置为已读
            this
                .props
                .dispatch(setUnread(localStorageData.id, currentChatMan.id, 'private'))
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.adjustKeybord);
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
        this
            .props
            .dispatch(setCurrentChatMan({}))

        this
            .keyboardDidShowListener
            .remove();
    }

    callback = (data) => {
        const {localStorageData, currentChatMan, linkmanListData,dispatch} = this.props;
        if (!(linkmanListData.some(item => item.id == currentChatMan.id))) {
            return Toast.info('您和他还不是好友，不能进行聊天')
        } else if (currentChatMan.id == 1) {
            return Toast.info('管理员仅推送公告，需要联系请在反馈中回复')
        }
        this.setState({isfetched: true})
        let options = {
            uid: localStorageData.id,
            rid: currentChatMan.id,
            date: moment(),
            text: escape(data),
            type: 'private'
        }
        try {
            Service
                .addLog(options)
                .then(result => {
                    let excapeLog=unescapeText(result,currentChatMan,localStorageData,dispatch,this.props.navigation);
                    try {
                        socket.emit('client', {
                            uid: localStorageData.id,
                            rid: currentChatMan.id,
                            data: excapeLog
                        });
                    } catch (err) {
                        Toast.info(err)
                    }
                    let temp = {
                        id: currentChatMan.id,
                        unread: 0,
                        data: excapeLog
                    };
                    this
                        .props
                        .dispatch(addChatLog(localStorageData.id, temp, 'private', currentChatMan));
                    this.setState({text: '', isfetched: false})
                })
        } catch (err) {
            Toast.info(err)
        }
    }
    adjustKeybord = (e) => {
        this.setState({
            keybordHeight: e.endCoordinates.height
        }, () => this.refs.scroll.scrollToEnd())
    }
    showLogMenu = (e, uid, menu) => {
        const {pageX, pageY} = e.nativeEvent;
        this.setState({
            floatMenu: {
                uid,
                x: pageX,
                y: pageY,
                menu: menu || null
            }
        })
    }
    deleteLog = (rid, id) => {
        this
            .props
            .dispatch(deleteLog(this.props.localStorageData.id, rid, id, 'private'));
        this.setState({
            floatMenu: {
                menu: null
            }
        })
    }
    pasteLog = (text) => {
        Clipboard.setString(text)
        this.setState({
            floatMenu: {
                menu: null
            }
        })
    }
    readInfo = (chatMan) => {
        this
            .props
            .navigator
            .navigate('FriendInfo', {chatMan: chatMan})
    }
    scrollChange = (contentWidth, contentHeight) => {
        if (contentHeight > this.state.scrollHeight && this.scrollEnd) {
            this
                .refs
                .scroll
                .scrollToEnd();
        }
    }
    scrollToEnd = (e) => {
        const sc = e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height;
        if (this.state.scrollEnd && sc != e.nativeEvent.contentSize.height) {
            this.scrollEnd=false;
        } else if (sc == e.nativeEvent.contentSize.height) {
            this.scrollEnd=true;
        }
    }

    render() {

        const {navigator, localStorageData, currentChatMan, chatLog, notificationData} = this.props;
        const {
            isloadEnd,
            num,
            type,
            isfetched,
            keybordHeight,
            floatMenu
        } = this.state;
        const floatMenuRender = <View
            style={{
            position: 'absolute',
            left: floatMenu.x > (0.5 * width)
                ? floatMenu.x - 200
                : floatMenu.x + 100,
            top: floatMenu.y - 100
        }}><FloatMeunBar component={floatMenu.menu}/></View>
        const fetchIcon = isfetched
            ? <View style={styles.logItem}>
                    <View style={styles.logItemRight}>
                        <View style={styles.fetchIcon}><ActivityIndicator text="发送中..."/></View>
                        <View style={styles.avaitor}>
                            <TouchableWithoutFeedback onPress={() => this.readInfo(localStorageData)}>
                                <Image
                                    source={{
                                    uri: domain + localStorageData.user_faceSrc
                                }}
                                    style={styles.avitorImg}/>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            : null;
        const currentLogs = currentChatMan.id
            ? (chatLog.filter(item => (item.chatMan.id === currentChatMan.id && item.logType === type)))[0]
            : null;
        const loadingIcon = currentLogs
            ? (currentLogs.log.length < 10)
                ? null
                : (isloadEnd
                    ? <Text>已加载完所有消息</Text>
                    : <View><Icon type="\uE64D"/></View>)
            : null
        const logList = currentChatMan.id === 1
            ? notificationData.map((item, index) => {
                let menuComponent = <View style={styles.menuWrap}>
                    <TouchableOpacity
                        onPress={() => this.deleteLog(item.chatMan.id, item.id)}
                        style={styles.menuItem}>
                        <Text style={styles.memuText}>删除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.pasteLog(item.text)}
                        style={styles.menuItem}>
                        <Text style={styles.memuText}>复制</Text>
                    </TouchableOpacity>
                </View>
                let time = <Text style={styles.newTimeText}>{moment(item.date).calendar()}</Text>
                let itemShow = <View style={styles.logItemLeft}>
                    <View style={styles.newTime}>{time}</View>
                    <View style={styles.logItemRight}>
                        <TouchableOpacity onPress={(e) => this.showLogMenu(e, item.id)}>{item.htmlLog}</TouchableOpacity>
                        <View style={styles.avaitor}>
                            <Image
                                source={{
                                uri: domain + localStorageData.user_faceSrc
                            }}
                                style={styles.avitorImg}/>
                        </View>
                    </View>
                </View>;

                return (
                    <View key={index}>
                        <View style={styles.newTime}>{time}</View>
                        <View style={styles.logItemLeft}>
                            <View style={styles.avitor}>
                                <TouchableWithoutFeedback onPress={() => this.readInfo(item.chatMan)}>
                                    <Image
                                        source={{
                                        uri: domain + currentChatMan.user_faceSrc
                                    }}
                                        style={styles.avitorImg}/>
                                </TouchableWithoutFeedback>
                            </View>
                            <TouchableOpacity
                                onLongPress=
                                {(e) => this.showLogMenu(e, item.id, menuComponent)}
                                onPressIn=
                                {(e) => this.showLogMenu(e, null, null)}>
                                {item.htmlLog}
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            })
            : chatLog.map((item, index) => {
                let temp = [];
                if (item.chatMan.id === currentChatMan.id && item.logType === type) {
                    item
                        .log
                        .map((child, cIndex) => {
                            let menuComponent = <View style={styles.menuWrap}>
                                <TouchableOpacity
                                    onPress={() => this.deleteLog(item.chatMan.id, child.id)}
                                    style={styles.menuItem}>
                                    <Text style={styles.memuText}>删除</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.pasteLog(child.text)}
                                    style={styles.menuItem}>
                                    <Text style={styles.memuText}>复制</Text>
                                </TouchableOpacity>
                            </View>
                            let time = child.isNew
                                ? <Text style={styles.newTimeText}>{moment(child.date).calendar()}</Text>
                                : null
                            let itemShow = child.u_id === localStorageData.id
                                ? <View key={cIndex} style={styles.logItem}>
                                        <View style={styles.newTime}>{time}</View>
                                        <View style={styles.logItemRight}>
                                            <TouchableOpacity
                                                onLongPress
                                                ={(e) => this.showLogMenu(e, child.id, menuComponent)}
                                                onPressIn={(e) => this.showLogMenu(e, null, null)}>{child.htmlLog}</TouchableOpacity>
                                            <View style={styles.avaitor}>
                                                <TouchableWithoutFeedback onPress={() => this.readInfo(localStorageData)}>
                                                    <Image
                                                        source={{
                                                        uri: domain + localStorageData.user_faceSrc
                                                    }}
                                                        style={styles.avitorImg}/>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>
                                    </View>
                                : <View key={cIndex}>
                                    <View style={styles.newTime}>{time}</View>
                                    <View style={styles.logItemLeft}>
                                        <View style={styles.avitor}>
                                            <TouchableWithoutFeedback onPress={() => this.readInfo(item.chatMan)}>
                                                <Image
                                                    source={{
                                                    uri: domain + currentChatMan.user_faceSrc
                                                }}
                                                    style={styles.avitorImg}/>
                                            </TouchableWithoutFeedback>
                                        </View>
                                        <TouchableOpacity
                                            onLongPress
                                            ={(e) => this.showLogMenu(e, child.id, menuComponent)}
                                            onPressIn={(e) => this.showLogMenu(e, null, null)}>{child.htmlLog}</TouchableOpacity>
                                    </View>
                                </View>;
                            temp.push(itemShow)
                        })
                }
                return temp;
            })
        return (
            <View style={styles.flex}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style
                    ={styles.keybordView}
                    keyboardVerticalOffset={- keybordHeight}>
                    <TouchableWithoutFeedback onPressIn={(e) => this.showLogMenu(e, null, null)}>
                        <View style={styles.flex}>
                            <ScrollView
                                ref='scroll'
                                style={[
                                styles.flex, {
                                    marginBottom: 15
                                }
                            ]}
                                onContentSizeChange
                                ={this.scrollChange}
                                onScroll
                                ={this.scrollToEnd}>
                                <View>{logList}</View>
                                {fetchIcon}
                            </ScrollView>
                            <CustomEditor
                                callback={this.callback}
                                onFocus={(e) => this.showLogMenu(e, null, null)}/>
                        </View>
                    </TouchableWithoutFeedback>
                    {floatMenuRender}
                </KeyboardAvoidingView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    newTime: {
        alignSelf: 'center'
    },
    newTimeText: {
        color: '#666',
        paddingVertical: 10
    },
    logItem: {
        marginBottom: 2,
        overflow: 'visible'
    },
    logItemLeft: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 15
    },
    logItemRight: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginTop: 10,
        paddingHorizontal: 15,
        overflow: 'visible'
    },
    avitorImg: {
        height: 50,
        width: 50
    },
    avaitor: {
        height: 50,
        width: 50
    },
    logs: {
        maxWidth: width - 80,
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 13,
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center'
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
    fetchIcon: {
        alignItems: 'center'
    },
    keybordView: {
        flex: 1
    },
    menuWrap: {
        backgroundColor: '#fff'
    },
    menuItem: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        minWidth: 80,
        alignItems: 'center'
    },
    memuText: {
        fontSize: 18,
        color: '#333'
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)