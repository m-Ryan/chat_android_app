import React from 'react';
import { connect } from 'react-redux'
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard
} from 'react-native';
import { SearchBar, Button, WhiteSpace, WingBlank ,Icon} from 'antd-mobile';

 class HeaderBar extends React.Component {
    constructor(props){
      super(props);
    }
    gotoNextPath=()=>{
        const {title,path,navigator } =this.props;
        Keyboard.dismiss();
        navigator.navigate(path,{
            title:navigator.state.params.currentTitle,
            currentTitle:title,
            })
    }
    cancelHandle=()=>{
        Keyboard.dismiss()
    }
    render() { 
       const {title,path,navigator } =this.props;
       return (
           <View style={styles.header}>
                <TextInput placeholder='搜索' 
                style={styles.search}
                placeholderTextColor='#ccc'
                selectionColor ='#ccc'
                underlineColorAndroid="transparent"
                />
                <TouchableOpacity onPress={this.searchHandle} style={styles.searchBtn} ><Text style={{alignSelf:'center'}}>确定</Text></TouchableOpacity>
           </View>
       )
    }
}

const styles=StyleSheet.create({
    header:{
        height:50,
        backgroundColor:'#ccc',
        paddingTop:5,
        flexDirection:'row'
    },
    search:{
        flex:1,
        height:40,
        backgroundColor:'#fff',
        borderRadius:5,
        marginHorizontal:10,
        paddingHorizontal:10,
        fontSize:14,
        
    },
    searchBtn:{
        marginRight:10,
        justifyContent:'center'
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(HeaderBar)