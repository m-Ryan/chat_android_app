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
export default class AnimateText extends React.Component {
  constructor(props) {
     super(props);
     this.state = {//设置初值
       fadeAnim: new Animated.Value(0),
     };

   }
  startAnimation(){
    Animated.timing(
      this.state.fadeAnim,{
          toValue: 1.0,
          duration: 5000,
      }
    ).start();
  }
  componentWillMount(){ 
      this.startAnimation();
    /*  this.state.fadeAnim.addListener((animate)=>{
          if(animate.value===1 && this.props.callback){
              this.props.callback();
          }
      })*/
  }
  componentWillUnmount(){ 
      this.state.fadeAnim.removeAllListeners();
  }
  render() {
    return (
        <Animated.View style={[{
                opacity: this.state.fadeAnim.interpolate({
                                        inputRange: [0, 0.99,1],
                                        outputRange: [1, 1,0]
                                    }), //透明度动画
                transform: [//transform动画
                    {
                    translateX: this.state.fadeAnim.interpolate({
                                        inputRange: [0, 0.99],
                                        outputRange: [width, -200]
                                    }),
                    },
                    ],
                },this.props.style]}>
            {this.props.component}
        </Animated.View>
    );
  }
}



const styles = StyleSheet.create({

})