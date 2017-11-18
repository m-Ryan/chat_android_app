import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  Button,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import ListItems from '../component/ListItems';
export default class ArticleList extends React.Component {
    constructor(props){
      super(props);
    }
    static navigationOptions = ({ navigation, screenProps }) => ({
        title:navigation.state.params.title
    });
    render() { 
       return (
           <View style={styles.flex}>
                <View><ListItems {...this.props}/></View>
           </View>    
       )
    }
}
      
const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
    swiper:{
        marginTop:1,
        marginBottom:10
    }
})