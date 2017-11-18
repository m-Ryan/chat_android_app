import React from 'react';
import { connect } from 'react-redux'
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import { Button ,SearchBar} from 'antd-mobile';
import HeaderBar from '../component/HeaderBar';
import domain from '../../other/domain';
 class FriendAction extends React.Component {
    static navigationOptions = ({ navigation }) => ({  
        header:null
    });
    constructor(props){
      super(props);
    }
    render() { 
       const {localStorageData } = this.props;

       return (
           <View style={styles.flex}>
                <HeaderBar title={'朋友圈'} path={'ChatSetting'} />
                <View style={styles.container}>

                </View> 
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1
    },
    container:{
        backgroundColor:'#fff',
        padding:10,
        flex:1,
    },
    text:{
        fontSize:18,
        borderBottomWidth:0.5,
        borderColor:'#ccc',
        paddingHorizontal:10,
        paddingVertical:10
    }
  
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(FriendAction)