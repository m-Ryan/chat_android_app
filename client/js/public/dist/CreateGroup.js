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
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {Button, SearchBar, Icon, ImagePicker, InputItem ,Toast} from 'antd-mobile';
import uploadImg from '../../other/uploadImg';
const domain = 'http://chat.maocanhua.cn';
import Service from '../../other/Service';
import {setLocalStorageData ,setAddGroup ,setCurrentChatMan} from '../../other/actions';
class Action extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({title: '新建群聊'})
    constructor(props) {
        super(props);
        this.state = {
            files: [
                {
                    url: domain+'/images/group.png',
                    id: '0'
                }
            ],
            name: '',
            declaractionShow:false,
            agree:true,
            faceSrc:'/images/group.png',
            loading:false
        }
    }

    avaitorChange = async(files, type, index) => {
        if (type == 'remove') {
            files.splice(index, 1);
            return this.setState({files})
        };
        files.shift()
        let callbackUrl = await uploadImg(files[0].url, this.props.localStorageData.user_name);
        if (callbackUrl) {
            this.setState({
                files,
                faceSrc:callbackUrl
            })
        }
    }
    onChangeText = (name) => {
        this.setState({name})
    }
    submitHandle=()=>{
        Keyboard.dismiss();
        const {name ,faceSrc }=this.state;
        if(!name) return ;
        this.setState({loading:true})
        let user=this.props.localStorageData;
        const leader=user.id;
        let groupList =user.user_group?(
            Array.isArray(JSON.parse(user.user_group))?JSON.parse(user.user_group):[]
        ):[];
        let options={
            name,
            faceSrc,
            leader,
            groupList
        }
        Service.createGroup(options)
               .then(
                   result=>{
                    this.setState({loading:false})
                        groupList.push(result.id);
                        user.user_group=JSON.stringify(groupList);
                        GlobalStorage.save({
                            key: 'user',  // 注意:请不要在key中使用_下划线符号!
                            data: user
                        })
                        this.props.dispatch(setLocalStorageData(user))
                        result.member=[user]
                        this.props.dispatch(setAddGroup(this.props.localStorageData.id,result));
                        this
                        .props
                        .dispatch(setCurrentChatMan(result))
                    this
                        .props
                        .navigator
                        .navigate('GroupChat', {chatMan: result})
                   }
               )
    }
    render() {
        const {name, files ,declaractionShow ,agree ,loading } = this.state;
        let  isCheck=!(agree && name.length);
        const agreeIcon=agree?<Icon type={"\uE630"} color='#108ec6'/>:<Icon type={"\uE62F"} color='#666'/>;
        const declaractionRender=declaractionShow
                                ? <View style={styles.declaraction}>
                                <Text style={styles.declaractionTitle}>服务声明：</Text>
                                <Text style={styles.title}>您在使用本服务时不得利用本服务从事以下行为，包括但不限于：</Text>
                                <Text style={styles.textItem}>
                                    （1）发布、传送、传播、储存违反国家法律、危害国家安全统一、社会稳定、公序良俗、社会公德以及侮辱、诽谤、淫秽、暴力的内容；</Text>
                                <Text style={styles.textItem}>
                                    （2）发布、传送、传播、储存侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的内容；</Text>
                                <Text style={styles.textItem}>
                                    （3）虚构事实、隐瞒真相以误导、欺骗他人；</Text>
                                <Text style={styles.textItem}>
                                    （4）发表、传送、传播广告信息及垃圾信息；</Text>
                                <Text style={styles.textItem}>
                                    （5）从事其他违反法律法规、政策及公序良俗、社会公德等的行为。</Text>
                                <Text style={styles.title}>【用户禁止行为】</Text>
                                <Text style={styles.textItem}>
                                    （1）通过任何方式搜集本服务中其他用户的用户名、电子邮件等相关信息，并以发送垃圾邮件、连锁邮件、垃圾短信、即时消息等方式干扰、骚扰其他用户；</Text>
                                <Text style={styles.textItem}>
                                    （2）通过本服务发布包含广告、宣传、促销等内容的信息；</Text>
                                <Text style={styles.textItem}>
                                    （3）将本服务再次许可他人使用；</Text>
                                    <Text style={styles.textItem}>
                                    （5）从事其他违反法律法规、政策及公序良俗、社会公德等的行为。</Text>
                                <Text style={styles.title}>【用户禁止行为】</Text>
                                <Text style={styles.textItem}>
                                    （1）通过任何方式搜集本服务中其他用户的用户名、电子邮件等相关信息，并以发送垃圾邮件、连锁邮件、垃圾短信、即时消息等方式干扰、骚扰其他用户；</Text>
                                <Text style={styles.textItem}>
                                    （2）通过本服务发布包含广告、宣传、促销等内容的信息；</Text>
                                <Text style={styles.textItem}>
                                    （3）将本服务再次许可他人使用；</Text>
                            </View>
                            :null;
        return (
            <ScrollView style={styles.flex}>
                <View style={styles.container}>
                    <View>
                        <ImagePicker
                            files={files}
                            onChange={this.avaitorChange}
                            selectable={files.length < 2}/>
                    </View>
                    <View style={styles.row}>
                        <InputItem
                            placeholderTextColor='#ccc'
                            selectionColor='#999'
                            underlineColorAndroid="transparent"
                            placeholder='填写群名称'
                            value={name}
                            onSubmitEditing={this.submitHandle}
                            returnKeyType='send' 
                            returnKeyLabel='确定' 
                            style={styles.input}
                            onChange={this.onChangeText}/>
                        <Button type='primary' style={styles.btn} disabled={isCheck} onClick={this.submitHandle} loading={loading}>
                            <Text style={styles.btnText}>确定</Text>
                        </Button>
                    </View>
                    <View style={styles.read}>
                        <TouchableOpacity onPress={()=>this.setState({agree:!agree})}>{agreeIcon}</TouchableOpacity>
                        <Text style={{fontSize:16}}> 我已阅读</Text>
                        <TouchableOpacity onPress={()=>this.setState({declaractionShow:!declaractionShow})}><Text style={styles.showDeclaraction}>服务声明</Text></TouchableOpacity>
                    </View>
                    {declaractionRender}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical:20,
        paddingHorizontal:10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight:5,
        paddingLeft: 5,
        height: 40
    },
    btn: {
        width: 60,
        height: 40,
        marginRight: 10
    },
    btnText: {
        fontSize: 14
    },
    declaraction: {
        paddingHorizontal: 20,
    },
    declaractionTitle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#333'
    },
    title: {
        fontSize: 16,
        color: '#333'
    },
    textItem: {
        color: '#444'
    },
    read:{
        marginVertical:15,
        flexDirection:'row'
    },
    showDeclaraction:{
        fontSize: 16,
        color:'#108ec6',
        fontWeight:'bold'
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)