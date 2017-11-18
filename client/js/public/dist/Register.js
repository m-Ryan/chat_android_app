import React from 'react';
import { connect } from 'react-redux'
import {
  StyleSheet,  
  Text,  
  View,  
  Image,
  Keyboard
} from 'react-native';
import { Button ,SearchBar ,List, InputItem ,Icon ,Toast ,Radio} from 'antd-mobile';
const RadioItem = Radio.RadioItem;
import SERVICE from '../../other/Service';
import CustomInput from '../component/CustomInput';
import {setLocalStorageData} from '../../other/actions';
import initSetting from '../../other/initSetting';
class Register extends React.Component {
    static navigationOptions = ({ navigation }) => ({  
       header:null,
    });
    constructor(props){
      super(props);
      this.state={
        userName:'',
        email:'',
        password:'',
        comformPassword:'',
        userNameCheck:false,
        emailCheck:false,
        passwordCheck:false,
        comformPasswordCheck:false,
        clear:false,
      }
    }
    componentDidMount(){

     }
     userNameChange=(text)=>{
        let userNameCheck=true;
        if(text.length<2 || text.length>8){
            userNameCheck=false;
        }
        this.setState({
            userName:text.substr(0,5),
            userNameCheck,
        })
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
            comformPasswordCheck:text === this.state.comformPassword,
            clear:false
        })
    }
    comformPasswordChange=(text)=>{
        this.setState({
            comformPassword:text,
            comformPasswordCheck:text === this.state.password,
        })
    }
    register=async ()=>{
        const {password,email , userName ,comformPassword ,clear ,userNameCheck,emailCheck ,passwordCheck,loading,comformPasswordCheck}=this.state;
        Keyboard.dismiss();
        if(this.fetched || loading) return;
        this.setState({loading:true})
     
        if(comformPassword !=password){
            return Toast.fail('两次输入的密码不一致', 1.5)
        }else if(userNameCheck && emailCheck && passwordCheck && comformPasswordCheck){

                let options={
                    regEmail:email,
                    regName:userName,
                    regPwd:password,
                    regSex:0,
                    regFace:'/face/face0.jpg',
                }

               try{
                   let user=await SERVICE.getRegister(options);
                   this.setState({loading:false})
                   if (user) {
                      this.fetched=true;
                      Toast.success("注册成功！")
                      GlobalStorage.save({
                          key: 'user',  // 注意:请不要在key中使用_下划线符号!
                          data: user
                      })
                      this.props.dispatch(setLocalStorageData(user));
                      this.props.navigation.navigate('Index');
                      initSetting(user,this.props.dispatch);
                    /*  socket.emit('client',{
                          type:'login',
                          user:user
                      })*/
                   } else {
                      this.setState({
                          clear:true,
                          passwordCheck:false
                      })
                      Toast.fail("该邮箱已被注册！")
                   }
               }catch(err){
                  Toast.fail("发生未知错误！")
               }

            
        }
    }

    render() { 
       const {password,email ,clear ,emailCheck ,passwordCheck,loading ,comformPassword ,userNameCheck ,comformPasswordCheck}=this.state;

       const disabled=!(userNameCheck && emailCheck && passwordCheck && comformPasswordCheck);
       const register=(
            <View style={[styles.flex,styles.container]}>
                <View><Text style={styles.header}>注册</Text></View>
                <View style={styles.form}>
                    <CustomInput type='email' placeholder='请输入邮箱' prevIcon={<Icon type={"\uE659"} size={25} />} onChangeText={this.emailChange} check={emailCheck}/>                
                    <CustomInput placeholder='请输入2-8位的用户名' prevIcon={<Icon type={"\uE66A"} size={25} />} onChangeText={this.userNameChange} maxLength={8} check={userNameCheck}/>
                    <CustomInput type='password' clear={clear} placeholder='请输入不少于6位的密码' prevIcon={<Icon type={"\uE67B"} size={25}/>} onChangeText={this.passwordChange} maxLength={18} onSubmitEditing={this.register} check={passwordCheck}/>
                    <CustomInput type='password' clear={clear} placeholder='请再次输入密码' prevIcon={<Icon type={"\uE67B"} size={25}/>} onChangeText={this.comformPasswordChange} maxLength={18} onSubmitEditing={this.register}
                    check={comformPasswordCheck}
                    />
                </View>
                <Button type='primary' style={styles.loginBtn} onClick={this.register} loading={loading} disabled={disabled}>注册</Button>
            </View> 
       )
       return (
           <View style={styles.flex}>
                {register}
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
    logo:{
        width:100,
        height:100,
        alignSelf:'center',
        marginTop:60,
        marginBottom:30
    },
    header:{
        textAlign:'center',
        fontSize:24,
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginTop:40,
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
    },
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Register)