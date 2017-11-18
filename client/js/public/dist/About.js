import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView
} from 'react-native';
import { Button ,SearchBar,Icon} from 'antd-mobile';
export default class About extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title:'关于',
      });
    constructor(props){
      super(props);
    }
    render() { 
       return (
           <View style={styles.flex}>
                <Text>关于</Text>
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
})
