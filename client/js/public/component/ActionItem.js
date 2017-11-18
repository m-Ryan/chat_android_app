import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Icon, Button} from 'antd-mobile';
import htmlLog from '../../other/htmlLog';
import {
    setMainContainerType,
    setCurrentChatMan,
    updatePhotoList,
    updatePhotoListReplay,
    deletePhoto,
    deletePhotoReplay,
    setLove
} from '../../other/actions';
import CustomEditor from './CustomEditor';
import moment from 'moment';
import momentLocale from 'moment/locale/zh-cn';
moment.updateLocale('zh-cn', momentLocale);
import Service from '../../other/Service';
import domain from '../../other/domain';
import Popconfirm from './Popconfirm';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
const {height, width} = Dimensions.get('window');
let isAdd = (love, name) => {
    if (!love) {
        return false;
    } else if (Array.isArray(love)) {
        return love.some(item => item == name)
            ? false
            : true;
    } else {
        return JSON
            .parse(love)
            .some(item => item == name)
            ? false
            : true;
    }
}
class PhotoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            text: null,
            placeholder: null,
            level: 0,
            r_name: null,
            data: this.props.data,
            add: isAdd(this.props.data.love, this.props.localStorageData.user_name),
            r_id: null
        }
    }
    sexIcon = (sex) => {
        return (parseInt(sex) === 0
            ? <Icon
                    type={"\uE6E2"}
                    style={{
                    color: 'rgb(37,160,220)'
                }}/>
            : <Icon
                type={"\uE6EC"}
                style={{
                color: 'rgb(220,33,124)'
            }}/>)
    }
    callback = (text) => {
        this.setState({text})
    }
    submitInfo = (level) => {
        const {localStorageData} = this.props;
        const {r_name, r_id} = this.state;
        let options = {
            p_id: this.props.data.id, //当前评论的id，索引
            u_id: localStorageData.id,
            u_name: localStorageData.user_name,
            r_id,
            r_name,
            text: this.state.text,
            level,
            date: moment()
        }
        Service
            .addReplayList(options)
            .then(result => {
                if (result) {
                    this
                        .props
                        .dispatch(updatePhotoListReplay(result))
                  /*  socket.emit('client', {
                        type: 'photo-relative',
                        id: r_id,
                        data: result,
                        name: localStorageData.user_name
                    });*/
                } else {
                    message.warn('提交信息失败')
                };
                this.setState({visible: false})
            })
    }
    //点赞
    setLoveHandle = () => {
        let add = this.state.add;
        let r_id = this.props.data.u_id;
        let u_id = this.props.localStorageData.id;
        let p_id = this.props.data.id;
        let u_name = this.props.localStorageData.user_name;
        let options = {
            u_name,
            add,
            p_id,
            u_id,
            r_id
        }
        Service
            .setLove(options)
            .then(result => {
                if (result.affectedRows) {
                    let r_name = this.props.localStorageData.user_name;
                    this
                        .props
                        .dispatch(setLove(p_id, add, r_name));
                    this.setState({
                        add: !add
                    });
                   /* socket.emit('client', {
                        type: 'setLove',
                        u_name,
                        add,
                        p_id,
                        u_id,
                        r_id
                    })*/
                } else {
                    message.warn('发生未知错误')
                };
            })
    }

    sortPhoto = (list) => {
        switch (list.length) {
            case 1:
            return (
                <View style={styles.picContainer}>
                    <View style={{flexDirection:'row',flex:1}}>
                        <Image source={{uri: domain + list[0]}} style={styles.onePic}/>
                    </View>
                </View>
            )
            case 2:
            return (
                <View style={styles.picContainer}>
                    <View style={{flexDirection:'row',flex:1}}>
                        <Image source={{uri: domain + list[0]}} style={styles.ninePic}/>
                        <Image source={{uri: domain + list[1]}} style={styles.ninePic}/>
                    </View>
                </View>
            )
            case 3:
                return (
                    <View style={styles.picContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Image source={{uri: domain + list[0]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[1]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[2]}} style={styles.ninePic}/>
                        </View>
                    </View>
                )
                case 4:
                return (
                    <View style={styles.picContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Image source={{uri: domain + list[0]}} style={styles.fourPic}/>
                            <Image source={{uri: domain + list[1]}} style={styles.fourPic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[2]}} style={styles.fourPic}/>
                            <Image source={{uri: domain + list[3]}} style={styles.fourPic}/>
                        </View>
                    </View>
                )
                case 5:
                return (
                    <View style={styles.picContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Image source={{uri: domain + list[0]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[1]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[2]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[3]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[4]}} style={styles.ninePic}/>
                        </View>
                    </View>
                )
                case 6:
                return (
                    <View style={styles.picContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Image source={{uri: domain + list[0]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[1]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[2]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[3]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[4]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[5]}} style={styles.ninePic}/>
                        </View>
                    </View>
                )
                case 7:
                return (
                    <View style={styles.picContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Image source={{uri: domain + list[0]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[1]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[2]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[3]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[4]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[5]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[6]}}  style={styles.ninePic}/>
                        </View>
                    </View>
                )
                case 8:
                return (
                    <View style={styles.picContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Image source={{uri: domain + list[0]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[1]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[2]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[3]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[4]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[5]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[6]}}  style={styles.ninePic}/>
                            <Image source={{uri: domain + list[7]}}  style={styles.ninePic}/>
                        </View>
                    </View>
                )
            case 9:
                return (
                    <View style={styles.picContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                            <Image source={{uri: domain + list[0]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[1]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[2]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[3]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[4]}} style={styles.ninePic}/>
                            <Image source={{uri: domain + list[5]}} style={styles.ninePic}/>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{uri: domain + list[6]}}  style={styles.ninePic}/>
                            <Image source={{uri: domain + list[7]}}  style={styles.ninePic}/>
                            <Image source={{uri: domain + list[8]}}  style={styles.ninePic}/>
                        </View>
                    </View>
                )
        }
    }
    deleteChatHandle = (id, type, pid) => {
        Service
            .deletePhoto(id, type)
            .then(result => {
                if (result.affectedRows) {
                    message.success('删除成功');
                    if (type == 'photoList') {
                        this
                            .props
                            .dispatch(deletePhoto(id))
                    } else {
                        this
                            .props
                            .dispatch(deletePhotoReplay(pid, id))
                    }
                } else {
                    message.error('发生未知错误')
                }
            })
    }
    loveList = (love) => {
        if (!love || !love.length) {
            return null
        } else if (!Array.isArray(love)) {
            if (!JSON.parse(love).length) 
                return null;
            return (
                <Text>
                    <Icon type={"\uE6A4"}/> {JSON
                        .parse(love)
                        .join('，')}</Text>
            )
        } else {
            return (
                <Text>
                    <Icon type={"\uE6A4"}/>{love.join('，')}</Text>
            )
        }
    }
    render() {
        const {visible, placeholder, level, add} = this.state;
        const {data, localStorageData} = this.props;

        /*     const loveIcon = add
            ? <Icon type={"\uE6A4"} style={styles.replay}/>
            : <Icon type={"\E6A3"} style={styles.replay}/>;
        const loveListRender = this.loveList(data.love);
        let inputRender = visible
            ? <View style={{
                    marginTop: '20px'
                }}>
                    <CustomEditor
                        callback={this.callback}
                        placeholder={placeholder}
                        autofocus={true}/>
                    <Button type='primary' onClick={() => this.submitInfo(level)}>确定</Button>
                </View>
            : null;*/
        let imgList = data.imgList
            ? JSON.parse(data.imgList)
            : null;
        let renderList = imgList
            ? this.sortPhoto(imgList)
            : null;
        let replayRender = data.replay
            ? data
                .replay
                .map((child, cIndex) => {
                    let replayText = (parseInt(child.level) === 2)
                        ? <Text style={styles.row}>
                                <Text>回复<Text style={styles.replayName}>{child.r_name}：</Text>{data.text}</Text>
                            </Text>
                        : <Text style={styles.row}>
                            <Text>：</Text>{child.text}</Text>
                    let replayBtn = child.u_id === localStorageData.id
                        ? <TouchableOpacity>
                                <Text>删除</Text>
                            </TouchableOpacity>
                        : <TouchableOpacity
                            onPress={() => {
                            this.setState({
                                visible: !visible,
                                placeholder: '@' + child.user_name,
                                r_name: child.user_name,
                                level: 2,
                                r_id: child.u_id
                            })
                        }}>
                            <Icon type={"\uE6AB"}/>
                        </TouchableOpacity>;
                    return (
                        <View style={styles.replayContent} key={cIndex}>
                            <Text style={styles.row}>
                                <Text style={styles.replayName}>{child.user_name}</Text>
                                <Text>{replayText}</Text>
                            </Text>
                        </View>
                    )
                })
            : null;
        let deleteBtn = data.u_id === localStorageData.id
            ? <TouchableOpacity>
                    <Text style={styles.deleteBtn}>删除</Text>
                </TouchableOpacity>
            : null;
        return (
            <ScrollView>
                <View style={styles.theme}>
                    <Image
                        source={{
                        uri: domain + data.user_faceSrc
                    }}
                        style={styles.avator}/>
                    <View>
                        <View style={styles.userInfo}>
                            <TouchableOpacity>
                                <Text style={styles.userName}>{data.user_name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.content}>
                            {htmlLog(data.text, false, {
                                fontSize: 16,
                                color: '#333'
                            })}
                        </View>
                        <View>{renderList}</View>
                        <View style={styles.control}>
                            <Text>{moment(data.date).fromNow()}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                this.setState({
                                    visible: !visible,
                                    placeholder: null,
                                    r_name: data.user_name,
                                    level: 1,
                                    r_id: data.u_id
                                })
                            }}>
                                <Icon type={"\uE6AB"} style={styles.replayIcon} color={'#34538b'}/>
                            </TouchableOpacity>
                        </View>
                        {replayRender}
                    </View>
                </View>
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    theme: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 10,
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        borderBottomColor: '#ccc'
    },
    avator: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    userInfo: {
        flex: 1
    },
    userName: {
        fontSize: 16,
        color: '#527ED1'
    },
    replayName: {
        fontSize: 15,
        color: '#527ED1'
    },
    content: {
        width: width - 90
    },
    control: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    replayContent: {
        backgroundColor: '#f8f8f8',
        padding: 5,
        width: width - 85
    },
    row: {
        flexDirection: 'row'
    },
    picContainer:{
        marginTop:5
    },
    onePic:{
        width:200,
        height:200
    },
    fourPic:{
        width:120,
        height:120,
        margin:2,
        borderWidth:0.5,
        borderColor:'#ccc',
    },
    ninePic:{
        width:80,
        height:80,
        margin:2,
        borderWidth:0.5,
        borderColor:'#ccc',
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(PhotoItem)