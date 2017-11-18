import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  NetInfo
} from 'react-native';
import {Icon} from 'antd-mobile'
export default class CheckNetInfo extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
          isConnected: true,
          connectionInfo: null
          };
      }
  
      //页面的组件渲染完毕（render）之后执行
      componentDidMount() {
          //检测网络是否连接
          NetInfo.isConnected.fetch().done((isConnected) => {
              this.setState({isConnected});
          });
   
          //检测网络连接信息
          NetInfo.fetch().done((connectionInfo) => {
              this.setState({connectionInfo});
          });
   
          //监听网络变化事件
          NetInfo.addEventListener('change', this.netInfoChange)
      }
      netInfoChange=(networkType) => {
        this.setState({isConnected: (networkType !='NONE')})
    }
      componentWillUnmount(){
        NetInfo.removeEventListener('change', this.netInfoChange)
      }
  
    render() { 
       const {isConnected}=this.state;
       const netInfoRender=!isConnected
                          ?<View style={styles.containere}>
                                <Icon type={"\uE62D"} size={16} color='#fff'/>
                                <Text style={styles.text}> 您当前的网络已断开</Text>
                            </View> 
                          :null;
       return (
           <View>{netInfoRender}</View>    
       )
    }
}

const styles=StyleSheet.create({
    containere:{
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FF6A6A',
        flexDirection:'row'
    },
    text:{
        color:'#fff'
    }
})
