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
import {} from '../../other/actions';

import {
    Button,
    SearchBar,
    Icon,
    Badge,
    SwipeAction,
    List
} from 'antd-mobile';
import Service from '../../other/Service';
import CustomHeader from '../component/CustomHeader';
import moment from 'moment';
import FloatMenuBar from '../component/FloatMenuBar';
import domain from '../../other/domain';
import htmlLog from '../../other/htmlLog';
const {width, height} = Dimensions.get('window');
import {setAddFriend, deleteFriendRequest} from '../../other/actions';
console.ignoredYellowBox = ['Setting a timer']
class Action extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({header: null});
    constructor(props) {
        super(props);
    }
    addFriendHandle = (item, flag) => {
        let options = {
            accept: flag,
            uid: this.props.localStorageData.id,
            rid: item.id,
            fid: item.fid
        }
        try {
            Service
                .addFriend(options)
                .then(result => {
                    if (result) {
                        this
                            .props
                            .dispatch(setAddFriend(this.props.localStorageData.id, result))
                        this
                            .props
                            .dispatch(deleteFriendRequest(item.fid))
                        try {
                            socket.emit('client', {
                                response: true,
                                data: {
                                    accept: flag,
                                    id: this.props.localStorageData.id,
                                    name: this.props.localStorageData.user_name,
                                    user: this.props.localStorageData
                                },
                                name: 'response' + item.id
                            });
                        } catch (err) {
                            log(err)
                        }
                    }
                })
        } catch (err) {
            log(err)
        }
    }
    readInfo = (chatMan) => {
        this
            .props
            .navigator
            .navigate('FriendInfo', {chatMan})
    }
    render() {
        const {dispatch, localStorageData, friendRequest} = this.props;
        const friendRequestRender = friendRequest.length
            ? friendRequest.map((item, index) => {
                return (
                    <SwipeAction
                        key={index}
                        style={{
                        backgroundColor: 'gray'
                    }}
                        autoClose
                        right={[
                        {
                            text: '同意',
                            onPress: () => this.addFriendHandle(item, true),
                            style: {
                                backgroundColor: '#ddd',
                                color: 'white'
                            }
                        }, {
                            text: '删除',
                            onPress: () => this.addFriendHandle(item, false),
                            style: {
                                backgroundColor: '#F4333C',
                                color: 'white'
                            }
                        }
                    ]}>
                        <List.Item >
                            <TouchableOpacity onPress={() => this.readInfo(item)}>
                                <View style={styles.conversationItem}>
                                    <View>
                                        <Image
                                            source={{
                                            uri: domain + item.user_faceSrc
                                        }}
                                            style={styles.avator}/>
                                    </View>
                                    <View style={styles.contentInfo}>
                                        <View style={styles.cName}>
                                            <View>
                                                <Text style={styles.cNameText}>{item.user_name}</Text>
                                            </View>

                                        </View>

                                    </View>
                                    <View style={styles.shade}></View>
                                </View>
                            </TouchableOpacity>
                        </List.Item>
                    </SwipeAction>
                )
            })
            : null;
        const requestRenderList = friendRequest.length
            ? <View>
                    <Text>好友申请</Text>
                    {friendRequestRender}
                </View>
            : null;

        return (
            <View>
                {requestRenderList}
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