import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity
} from 'react-native';
const {height, width} = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo';
export default class FreshenBtn extends React.Component {
  constructor(props) {
     super(props);
     this.state = {//设置初值
       fadeAnim: new Animated.Value(0.0),
       freshing:false,
     };
  }
  startAnimation(){
    Animated.timing(
      this.state.fadeAnim,
      {
          toValue: 1.0,
          duration: 500,
      }
    ).start();
  }
  freshen=()=>{
      this.setState({
          freshing:true,
      },()=>{
            this.startAnimation();
            this.props.getGuessLove(5)
      })
  }
componentWillMount(){ 
      this.state.fadeAnim.addListener((animate)=>{
          if(animate.value===1){
              this.setState({
                  freshing:false
                })
            this.state.fadeAnim.setValue(0.0)
          }
      })
  }
  componentWillUnmount(){ 
      this.state.fadeAnim.removeAllListeners();
  }
  render() {
      const renderShow=this.state.freshing
            ? <Animated.View style={[{
                    transform: [//transform动画
                        {
                        rotate: this.state.fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg',  '360deg']
                                        }),
                        },
                        {
                        scale:1
                        },
                        ],
                        flexDirection:'row',
                        alignItems:'center'
                    }]}>
                <Entypo name='cw' size={20} color='#33a5ba' style={styles.freshenBtn}/> 
            </Animated.View>
            :<TouchableOpacity 
                style={styles.flex}
                onPress={()=>{
                    this.freshen();
                    }} >
                <Entypo name='cw' size={20} color='#33a5ba' style={styles.freshenBtn}/> 
        </TouchableOpacity>;
    return (
      <View style={styles.container}>
            {renderShow}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
})