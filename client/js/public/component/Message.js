import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class Message extends React.Component {
  constructor(props) {
     super(props);
     this.state = {//设置初值
       fadeAnim: new Animated.Value(0.0),
     };
    this.config={
        style:styles[this.props.type],
        title:props.title,
        duration:props.duration,
        type:this.props.type,
    }
    let type=this.config.type;
     if(type==='success'){
        this.config.iconName='ios-checkmark-circle';
      }else if(type==='err'){
        this.config.iconName='ios-close-circle';
      }else if(type==='warn'){
        this.config.iconName='ios-alert';
      }else if(type==='info'){
        this.config.iconName='ios-paper-plane-outline';
      }
   }
  startAnimation(){
    Animated.timing(
      this.state.fadeAnim,
      {
          toValue: 1.0,
          duration: 1500,
      }
    ).start();
  }
  componentWillMount(){ 
      this.startAnimation();
      this.state.fadeAnim.addListener((animate)=>{
          if(animate.value===1){
              this.props.callbackMessage(false);
          }
      })
  }
  componentWillUnmount(){ 
      this.state.fadeAnim.removeAllListeners();
  }
  render() {
    const toTop=20;
    const config=this.config;
    return (
      <View style={styles.container}>
      <Animated.View style={[{
            opacity: this.state.fadeAnim.interpolate({
                                    inputRange: [0, 0.01,0.99,1],
                                    outputRange: [0, 1,1,0]
                                }), //透明度动画
            transform: [//transform动画
                {
                translateY: this.state.fadeAnim.interpolate({
                                    inputRange: [0,0.05, 1],
                                    outputRange: [0, toTop,toTop]
                                }),
                },
                {
                scale:1
                },
                ],
                flexDirection:'row',
                alignItems:'center'
            },config.style,styles.public]}>
           <Ionicons name={config.iconName} size={20} color={colorType[config.type]}/> 
           <Text style={styles.animateText}>{config.title}</Text>
      </Animated.View>
      </View>
    );
  }
}

const colorType={
    success:'#009a61',
    err:'#c00',
    warn:'#FFBF17',
    info:'#108ee9'
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container:{
        alignItems:'center',
        position:'absolute',
        left:0,      
        right:0, 
        top:0, 
        margin:'auto'
    },
    public:{
        paddingHorizontal:20,
        paddingVertical:8,
        borderRadius:5,
        borderWidth:3,
        backgroundColor:'#fff',
        borderColor:'#f6f8fa',
    },
    animateText:{
        color:'#333',
        marginLeft:10,
    },
})