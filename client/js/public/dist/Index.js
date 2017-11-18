import React from 'react';
import { connect } from 'react-redux'
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView
} from 'react-native';
import { Button ,SearchBar,Icon} from 'antd-mobile';
import BottomNavigator from '../navigator/BottomNavigator';
 class Action extends React.Component {
    constructor(props){
      super(props);
    }
    render() { 
       return (
           <View style={styles.flex}>
                <BottomNavigator navigation={this.props.navigationOptions} screenProps={this.props.screenProps}/>
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)