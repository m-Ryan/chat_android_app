import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  Button,
  WebView,
  Dimensions
} from 'react-native';
const {width,height} = Dimensions.get('window');
export default class FeedBack extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
      title: '意见反馈',
      //header:null
    });
     constructor(props){
      super(props);
    }
    render() {
       return (
            <View style={styles.flex}>
                  <WebView
                  //  ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={true}
                    style={styles.webView}
                    source={{uri: 'http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=c0pFQUdKQkFHQDMCAl0QHB4&from=mail'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}  
                    startInLoadingState={true}
                     injectedJavaScript={injectScript}
                    />
            </View>
       )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    webView:{
        flex:1,
    }
})

const injectScript = `(function () {
  document.querySelector('#banner .head').style.width='80%';
  document.querySelector('#banner .head .h_h1').style.float='none';

  document.querySelector('.main_content').style.width='90%';
  document.querySelector('.main_content').style.paddingLeft='5%';
  document.querySelector('.main_content').style.paddingRight='5%';

  document.querySelector('.top_input .f_txt').style.float='none';
  document.querySelector('.top_input .f_txt').style.width=(document.body.clientWidth-50)+"px";

  document.querySelector('.mod_conts .inputstyle').style.float='none';
  document.querySelector('.mod_conts .inputstyle').style.width=(document.body.clientWidth-50)+"px";
}());`;



