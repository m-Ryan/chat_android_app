import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  TextInput,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Button ,SearchBar,Icon} from 'antd-mobile';
const {height, width} = Dimensions.get('window');
export default class AdjustInput extends React.Component {
    constructor(props){
      super(props);
      this.state={
        keybordHeight: height,
      }
    }
    adjustKeybord = (e) => {
        this.setState({
            keybordHeight: e.endCoordinates.height
        })
    }
    componentWillMount() {

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.adjustKeybord);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
    }
    render() { 
       return (
           <View style={styles.flex}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.flex}
                    keyboardVerticalOffset={-200}
                >
                   <ScrollView  keyboardShouldPersistTaps='always'>
                        {this.props.component}
                   </ScrollView>
                </KeyboardAvoidingView>
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
})
