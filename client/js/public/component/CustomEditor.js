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
  Keyboard,
  Dimensions,
  BackHandler,
  
} from 'react-native';
import { Button ,SearchBar ,Icon ,ImagePicker} from 'antd-mobile';
import moment from 'moment';
const {width, height} = Dimensions.get('window');

import uploadImg from '../../other/uploadImg';
import EmojiPackage from '../component/EmojiPackage';
import htmlLog from '../../other/htmlLog'
 class CustomInput extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        header:null
      });
    constructor(props){
      super(props);
      this.state={
          text:'',
          preview:false,
          selectionPosition:0,
          emojiShow:false
      }
    }
    
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.goback);
    }
    goback=()=>{
        if (this.refs.editor.isFocused()) return false;
        return false;
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goback)
    }
    checkLog = () => {
        const data=this.state.text;
        if(!data.length) return ;
        this.setState({emojiShow:false})
        this.props.callback(data);
        this.setState({text:''});
        Keyboard.dismiss()
     
    }
    
    picChange=async (files, type, index) => {
        let callbackUrl= await uploadImg(files[0].url,this.props.localStorageData.user_name);
        if(callbackUrl){
            this.props.callback(`<img src=${callbackUrl} />`);
            this.setState({emojiShow:false});
            Keyboard.dismiss()
        }
    }

    textChange=(text)=>{
        this.setState({text:unescape(text)})
    }
    callbackEmoji=(emoji)=>{
        let {text ,selectionPosition}=this.state;
        let newText=text.substring(0,selectionPosition)+emoji+text.substring(selectionPosition)
        this.setState({text:newText})
     //   this.refs.editor.focus()
    }
    selectionChange=(e)=>{
        this.setState({selectionPosition:e.nativeEvent.selection.start})
    }
    setPreview=()=>{
        let v=this.state.preview;
        this.setState({
            preview:!v
        })
    }
    onChange=(e)=>{
        if(this.props.onChange) return this.props.onChange(e);
    }
    onBlur=(e)=>{
        if(this.props.onBlur) return this.props.onBlur(e);
    }
    onFocus=(e)=>{
        if(this.props.onFocus) return this.props.onFocus(e);
    }
    switchEmoji=(e)=>{
        let setEmojiShow=!this.state.emojiShow;
        if(setEmojiShow){
            this.refs.editor.focus()
        }
        this.setState({emojiShow:setEmojiShow})
    }
    onSubmitEditing=(e)=>{
        let {text ,selectionPosition}=this.state;
        let newText=text.substring(0,selectionPosition)+'\n'+text.substring(selectionPosition)
        this.setState({
            emojiShow:false,
            text:newText
        })
       // if(this.props.onSubmitEditing) return this.props.onSubmitEditing(e);

    }
    render() { 
       const {text ,preview ,emojiShow} = this.state;
       const okBtn=text
                      ?<TouchableOpacity  onPress={this.checkLog} style={styles.submitBtn}><Text style={{ color:'#fff'}}>确定</Text></TouchableOpacity>
                      :<View style={styles.imgPickerWrap}>
                             <View><Icon type={"\uE674"} size={35} color='#666'/></View>
                            <View style={styles.imgPicker}>
                                <ImagePicker
                                    files={[]}
                                    onChange={this.picChange}
                                    />
                            </View>
                      </View>;
       const previewBtn=preview
                        ?<TouchableOpacity onPress={this.setPreview} >
                            <Icon type={"\uE687"} style={styles.emojiBtn} size={30} color='#666'/>
                        </TouchableOpacity>
                        :<TouchableOpacity onPress={this.setPreview}>
                            <Icon type={"\uE688"} style={styles.emojiBtn} size={30} color='#666' />
                        </TouchableOpacity>
        const renderInput=!preview
                        ? <TextInput
                            placeholderTextColor ='#ccc'
                            selectionColor='#ccc'
                            underlineColorAndroid="transparent"
                            value={text}
                            onChangeText={this.textChange}
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            onFocus={this.onFocus}
                            onSubmitEditing={this.onSubmitEditing}
                            blurOnSubmit={false}
                            multiline ={true}
                            style={styles.editor}
                            onSelectionChange={this.selectionChange}
                            ref='editor'
                            />
                        :<View style={styles.editorPreview}>{htmlLog(text,false,{})}</View>
        const emojiRender=emojiShow
                         ?<View style={styles.emojiWrap}><EmojiPackage callback={this.callbackEmoji}/></View>
                         :null
       return (
           <View>
                {emojiRender}
                <View style={styles.editorConatiner}>
                    {previewBtn}
                    {renderInput}
                    <TouchableOpacity  onPress={this.switchEmoji}>
                        <Icon type={"\uE6A8"} style={styles.emojiBtn} size={30} color='#666'/>
                    </TouchableOpacity>
                    {okBtn}
                </View>
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    editorConatiner:{
        height:50,
        paddingHorizontal:10,
        borderWidth:0.5,
        borderColor:'#ccc',
        flexDirection:'row',
        alignItems:'center',
    },
    editor:{
        flex:1,
        paddingHorizontal:5,
        paddingVertical:1,
        borderBottomWidth:1,
        borderColor:'#ccc',
    },
    editorPreview:{
        flex:1,
        paddingHorizontal:5,
        paddingVertical:1,
    },
    submitBtn:{
        width:45,
        height:30,
        marginLeft:4,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        backgroundColor:'#108ee9',
    },
    imgPickerWrap:{
        width:50,
        height:30,
    },
    imgPickerIcon:{
        flex:1,
    },
    imgPicker:{
        flex:1,
        opacity:0,
        position:'absolute',
        top:0,
        left:0
    },
    emojiWrap:{
        borderWidth:1,
        borderColor:'#ccc'
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(CustomInput)