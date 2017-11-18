import React from 'react';
import {
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Button ,SearchBar , Icon  } from 'antd-mobile';
export default class Action extends React.Component {
    constructor(props){
        super(props);
      }
      render(){
          return(
            <View style={[styles.container,this.props.style]}>
                <Text style={styles.title}><Icon type={"\uE62C"} color='#ffbf00'/>你确定要删除所有聊天记录？</Text>
                <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>this.props.callback(false)} style={styles.btn}><Text style={styles.btnText}>No</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.callback(true)} style={styles.btn}><Text style={[styles.btnText,styles.activeBtnText]}>Yes</Text></TouchableOpacity>
                </View>
            </View>
          )
      }
}


const styles=StyleSheet.create({
    container:{
        padding:20,
        maxWidth:300,
        marginHorizontal:10,
        borderRadius:5,
        shadowOffset: {width: 0, height: 5},  
        shadowOpacity: 0.5,  
        shadowRadius: 5,  
        shadowColor: '#666',  
        backgroundColor:'#f8f8f8',
        //注意：这一句是可以让安卓拥有灰色阴影  
        //elevation: 4,  
    },
    title:{
        fontSize:18
    },
    btn:{
        borderWidth:0.5,
        borderRadius:5,
        marginLeft:15,
        marginTop:10,
        borderColor:'#ccc',
    },
    btnText:{
        fontSize:16,
        paddingVertical:3,
        paddingHorizontal:10,
    },
    activeBtnText:{
        backgroundColor:'#108ee9',
        color:'#fff',
        borderRadius:5,
    }
})
