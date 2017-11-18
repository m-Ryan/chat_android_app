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
    Keyboard
} from 'react-native';
import {Button, SearchBar} from 'antd-mobile';
import HeaderBar from '../component/HeaderBar';
import domain from '../../other/domain';
import {setBottomNavigator ,setLocalStorageData} from '../../other/actions';
class UserInfo extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header: <View style={styles.header}>
                    <View style={styles.middle}>
                        <Text style={styles.text}>个人信息</Text>
                    </View>
                </View>
    });
    constructor(props) {
        super(props);
        this.state={
            user:this.props.localStorageData
        }
    }
    componentWillMount(){
        if(!this.props.bottomNavigator){
            this.props.dispatch(setBottomNavigator(this.props.navigation))
        }
    }
    updateInfo = (value, title, type) => {
        Keyboard.dismiss();
        this
            .props
            .navigator
            .navigate('UpdateInfo', {
                value, 
                title, 
                type,
                callback:this.callback
            })
    }
    callback=(type,value)=>{
        const user=this.state.user;
        user[type] = value;
        this.setState({
            user
        })
        this
            .props
            .dispatch(setLocalStorageData(user))
        GlobalStorage.save({
            key: 'user', // 注意:请不要在key中使用_下划线符号!
            data: user
        })
    }
    render() {
        const {user} = this.state;
        const {
            user_name,
            user_sex,
            user_adress,
            user_birthday,
            user_signature,
            user_faceSrc
        } = user;
        const userImg = domain + user_faceSrc;
        const renderShow=user.id
                        ?<View style={styles.container}>
                        <View >
                            <TouchableOpacity
                                onPress={() => this.updateInfo(user_faceSrc, '修改头像', 'user_faceSrc')}
                                style={styles.imgItem}>
                                <Text style={styles.itemKey}>头像</Text>
                                <View style={styles.avatorImg}><Image
                                    source={{
                                        uri: userImg
                                    }}
                                    style={styles.avator}/></View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.item}>
                            <TouchableOpacity
                                onPress={() => this.updateInfo(user_name, '修改用户名', 'user_name')}
                                style={styles.itemBtn}>
                                <Text style={styles.itemKey}>用户名</Text>
                                <Text style={styles.itemValue}>{user_name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <TouchableOpacity
                                onPress={() => this.updateInfo(user_sex, '修改性别', 'user_sex')}
                                style={styles.itemBtn}>
                                <Text style={styles.itemKey}>性别</Text>
                                <Text style={styles.itemValue}>{user_sex == 0
                                        ? '男'
                                        : '女'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <TouchableOpacity
                                onPress={() => this.updateInfo(user_adress, '修改现居地', 'user_adress')}
                                style={styles.itemBtn}>
                                <Text style={styles.itemKey}>现居地</Text>
                                <Text style={styles.itemValue}>{user_adress}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <TouchableOpacity
                                onPress={() => this.updateInfo(user_birthday, '修改生日', 'user_birthday')}
                                style={styles.itemBtn}>
                                <Text style={styles.itemKey}>生日</Text>
                                <Text style={styles.itemValue}>{user_birthday}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <TouchableOpacity
                                onPress={() => this.updateInfo(user_signature, '修改个性签名', 'user_signature')}
                                style={styles.itemBtn}>
                                <Text style={styles.itemKey}>个性签名</Text>
                                <Text style={styles.itemValue}>{user_signature.length > 15
                                        ? user_signature
                                            .substr(0, 15) + '...'
                                        : user_signature}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    :null
        return (
            <View>
                <ScrollView>
                    {renderShow}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10
    },
    header: {
        backgroundColor: '#108ee9',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingHorizontal:20
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
    imgItem: {
        paddingVertical: 10,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#f8f8f8'
    },
    avator: {
        width: 60,
        height: 60,
        alignSelf: 'flex-end'
    },
    avatorText: {
        justifyContent: 'center'
    },
    avatorImg: {
        flex: 1
    },
    item: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#ccc'
    },
    itemKey: {
        color: '#555',
        fontSize: 18,
        width: 100
    },
    itemValue: {
        color: '#999',
        fontSize: 14,
        textAlign: 'right',
        alignSelf: 'center',
        flex: 1
    },
    itemBtn: {
        paddingVertical: 10,
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(UserInfo)