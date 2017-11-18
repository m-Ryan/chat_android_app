import React from 'react';
import { connect } from 'react-redux'
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  Image,
  TouchableOpacity ,
  Keyboard
} from 'react-native';
import { Button ,SearchBar ,List, InputItem ,Icon ,Toast ,ActivityIndicator} from 'antd-mobile';
import Service from '../../other/Service';
import CustomInput from '../component/CustomInput';
import {setLocalStorageData} from '../../other/actions';
import domain from '../../other/domain';
const initImg=null;
import { NavigationActions } from 'react-navigation';
 class Login extends React.Component {
    static navigationOptions = ({ navigation }) => ({  
       header:null,
    });
    constructor(props){
      super(props);
      this.state={
        emailCheck:false,
        passwordCheck:false,
        email:'',
        password:'',
        clear:false,
        avator:initImg,
        loadFace:false,
        status:false
      }
      this.unMount=false;
    }
     componentWillUnmount(){
        this.unMount=true;
    }
    emailChange=(text,emailCheck)=>{
        this.setState({
            email:text,
            emailCheck,
        })
    }
    passwordChange=(text,passwordCheck)=>{
        this.setState({
            password:text,
            passwordCheck,
            clear:false
        })
    }
    onChangeAvator= async()=>{
        if(this.unMount) return ;
        this.setState({loadFace:true})
        let email=this.state.email;
        let result= await Service.getFace(email);
        if(result.status=='success'){
            this.setState({
                avator:result.faceSrc,
                loadFace:false,
                status:true
            })
        }else{
            this.setState({
                avator:initImg,
                loadFace:false,
                status:false
            })
            Toast.fail('该用户不存在',1)
        }
    }
    login = async() => {
        const {emailCheck,passwordCheck} =this.state;
        Keyboard.dismiss();
        if(!emailCheck || !passwordCheck){
            return Toast.fail('请检查你的格式', 1.5)
        }
        this.setState({loading:true})
        const options={
            email:this.state.email,
            pwd:this.state.password,
        }
            try{
                let user= await Service.getLogin(options);
                if (Object.keys(user).length) {
                    GlobalStorage.save({
                        key: 'user',  // 注意:请不要在key中使用_下划线符号!
                        data: user
                    })
                    this.props.dispatch(setLocalStorageData(user))
                    let resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'Index'}),
                        ]
                      })
                      this.props.navigation.dispatch(resetAction)
                } else {
                    this.setState({
                        clear:true,
                        loading:false,
                        passwordCheck:false
                    })
                    Toast.fail('您的账号或密码不正确', 1.5)
                }
            }catch(err){
                this.setState({
                    clear:true,
                    loading:false,
                    passwordCheck:false
                })
                Toast.fail(err+'发生未知错误', 1.5)
            }
    }
    Register=()=>{
        this.props.navigation.navigate('Register')
    }
    forgetPwd=()=>{

    }
    render() { 
       const {password,email ,clear ,emailCheck ,passwordCheck,loading,avator,loadFace,status }=this.state;
       const disabled=!(emailCheck && passwordCheck && status);
       const checkFaceIcon=loadFace
                ?<ActivityIndicator color='#108ec6'  animating  size={100}/>
                :(avator?
                    <Image source={{uri:domain+avator}}  style={styles.avatorImg}/>
                    :<View style={styles.defaultAvator}><Icon type={"\uE66A"} size={100} color={'#fff'}/></View>);
       const Login=(
            <View style={[styles.flex,styles.container]}>
                <View style={styles.avator}>{checkFaceIcon}</View>
                <View style={styles.form}>
                    <CustomInput type='email' placeholder='请输入您的邮箱' prevIcon={<Icon type={"\uE66A"} size={25} />} onChangeText={this.emailChange} check={emailCheck} onBlur={this.onChangeAvator}/>
                    <CustomInput type='password' clear={clear} placeholder='不少于6位的密码' prevIcon={<Icon type={"\uE67B"} size={25}/>} onChangeText={this.passwordChange} maxLength={18} onSubmitEditing={this.login} check={passwordCheck}/>
                </View>
                <Button type='primary' style={styles.loginBtn} onClick={this.login} disabled={disabled} loading={loading}>登录</Button>
                <View style={styles.tool}>
                    <View style={styles.forgetPwd} onPress><TouchableOpacity onPress={this.forgetPwd} style={styles.toolBtn}><Text>忘记密码？</Text></TouchableOpacity></View>
                    <View style={styles.regist}><TouchableOpacity onPress={this.Register} style={styles.toolBtn}><Text>注册新账号</Text></TouchableOpacity></View>
                </View>
            </View> 
       )
       return (
           <View style={styles.flex}>
                {Login}
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
    container:{
        backgroundColor:'#fff',
        padding:20
    },
    avator:{
        width:100,
        height:100,
        alignSelf:'center',
        marginTop:60,
        marginBottom:30
    },
    avatorImg:{
        width:100,
        height:100,
        borderRadius:100
    },
    defaultAvator:{
        width:100,
        height:100,
        borderRadius:100,
        backgroundColor:'#666',
        alignSelf:'center'
    },
    form:{
        
    },
    loginBtn:{
        marginTop:10
    },
    tool:{
        marginTop:20
    },
    forgetPwd:{
         flex:1,
         alignSelf:'flex-start'
    },
    regist:{
         flex:1,
         alignSelf:'flex-end'
    },
    toolBtn:{
        width:70,
        height:40,
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Login)