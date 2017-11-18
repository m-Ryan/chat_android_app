import React from 'react';
import {connect} from 'react-redux'
import {
    Component,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Keyboard,
    ImageStore,
    NativeModules
} from 'react-native';
import {
    Button,
    SearchBar,
    InputItem,
    Toast,
    List,
    Radio,
    DatePicker,
    ImagePicker,
    Icon,
    ActivityIndicator
} from 'antd-mobile';
import Service from '../../other/Service';
import HeaderBar from '../component/HeaderBar';
import {setLocalStorageData} from '../../other/actions';
import moment from 'moment';
import uploadImg from '../../other/uploadImg';
const RadioItem = Radio.RadioItem;
const domain = 'http://chat.maocanhua.cn';


class UpdateInfo extends React.Component {
    static navigationOptions = ({navigation}) => ({header: null});
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            files: [
                {
                    url: 'http://chat.maocanhua.cn' + this.props.navigation.state.params.value,
                    id: '0'
                }
            ],
            ...this.props.navigation.state.params
        }

    }
    submitInfoHandle = () => {
        this.setState({loading:true})
        let options = {
            key: this.state.type,
            value: this.state.value,
            id: this.props.localStorageData.id
        }
        Keyboard.dismiss();
        Service
            .updateUserInfo(options)
            .then(result => {
                this.setState({loading:false,})
                Toast.success('修改成功', 1);
                this.props.navigation.state.params.callback(this.state.type,this.state.value)
                this.props.localStorageData[this.state.type] = this.state.value;
                this
                    .props
                    .dispatch(setLocalStorageData(this.props.localStorageData))
                GlobalStorage.save({
                    key: 'user', // 注意:请不要在key中使用_下划线符号!
                    data: this.props.localStorageData
                })
            })
    }

    sexChange = (value) => {
        this.setState({
            value
        }, () => {
            this.submitInfoHandle();
        });
    }
    birthdayChange = (value) => {
        this.setState({
            value: moment(value).format('YYYY-MM-DD')
        }, () => {
            this.submitInfoHandle();
        });
    }
    avaitorChange = async(files, type, index) => {
        if (type == 'remove') {
            files.splice(index, 1);
            return this.setState({files})
        };
        this.setState({loading:true})
        files.shift()
        let callbackUrl = await uploadImg(files[0].url, this.props.localStorageData.user_name);
        if (callbackUrl) {
            Toast.success('图片上传成功', 1.5);
            this.props.localStorageData.user_faceSrc = callbackUrl;
            this
                .props
                .dispatch(setLocalStorageData(this.props.localStorageData))
            GlobalStorage.save({
                key: 'user', // 注意:请不要在key中使用_下划线符号!
                data: this.props.localStorageData
            })
            this.setState({
                files,
                value: callbackUrl,
                key: 'user_faceSrc'
            }, () => this.submitInfoHandle())
        }
    }
    componentWillUnmount() {
        Keyboard.dismiss();
    }
    goback=()=>{
        Keyboard.dismiss();
        this.props.navigation.goBack();
    }
    getRender = () => {
        const {type, title, value, files} = this.state;
        const extraBtn = <TouchableOpacity onPress={this.submitInfoHandle} style={styles.sureBtn}>
            <Text style={styles.sureText}>确定</Text>
        </TouchableOpacity>
        switch (this.state.type) {
            case 'user_faceSrc':
                return (<ImagePicker
                    files={files}
                    onChange={this.avaitorChange}
                    selectable={files.length < 2}/>);
            case 'user_name':
                return (<InputItem
                    type='text'
                    value={value}
                    autoFocus
                    extra={extraBtn}
                    maxLength={8}
                    onChange={(value) => this.setState({value})}
                    style={styles.input}/>);
            case 'user_sex':
                const data = [
                    {
                        value: 0,
                        label: '男'
                    }, {
                        value: 1,
                        label: '女'
                    }
                ];
                return (
                    <List renderHeader={() => '选择性别'}>
                        {data.map(i => (
                            <RadioItem
                                key={i.value}
                                checked={value == i.value}
                                onChange={() => this.sexChange(i.value)}>
                                {i.label}
                            </RadioItem>
                        ))}
                    </List>
                );
            case 'user_adress':
                return (<InputItem
                    type='text'
                    value={value}
                    autoFocus
                    extra={extraBtn}
                    maxLength={8}
                    onChange={(value) => this.setState({value})}
                    style={styles.input}/>);
            case 'user_birthday':
                return (
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        value={moment(this.state.value)}
                        minDate={moment('1950-01-01')}
                        maxDate={moment()}
                        onChange={this.birthdayChange}>
                        <List.Item arrow="horizontal">Date</List.Item>
                    </DatePicker>
                );
            case 'user_signature':
                return (<InputItem
                    type='text'
                    value={value}
                    autoFocus
                    extra={extraBtn}
                    maxLength={30}
                    placeholder='请输入30字内的个性签名'
                    onChange={(value) => this.setState({value})}
                    style={styles.input}/>);
            default:
                return null;
        }
    }
    render() {
        const {loading}=this.state;
        const renderShow = this.getRender();
        const title = this.props.navigation.state.params.title;
        const loadingIcon=loading?<ActivityIndicator color="white" />:null;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={this.goback} style={styles.extraBtn}>
                            <Icon type={"\uE61C"} color='#fff' style={styles.headerIcon}/>
                        </TouchableOpacity>
                        <Text style={styles.text}>　{title}</Text>
                    </View>
                    {loadingIcon}
                </View>
                {renderShow}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#108ee9'
    },
    sureBtn: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: '#108ee9',
        borderRadius: 5
    },
    sureText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center'
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
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(UpdateInfo)