import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {Button, SearchBar, List, InputItem, Icon ,WhiteSpace} from 'antd-mobile';
export default class CustomInput extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            text:'',
            check:false,

        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.clear){
            const input=this.refs.input;
            input.clear()
        }
        if(nextProps.check !=this.state.check){
            this.setState((state)=>{
                return(
                    {check:nextProps.check && this.state.check}
                )
            })
        }
    }
    onChangeText=(text)=>{
        this.setState({text})
        let check=true;
        if(this.props.type==='email'){
            const reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if(!reg.test(text)){
                check=false;
            }
            
        }else if(this.props.type==='password'){
            if(text.length<6 ) check=false;
        }
        this.setState({check},()=>{
            if(this.props.onChangeText) this.props.onChangeText(text,check)
        })
    }
    render() {
        const {check ,text}=this.state;
        const {placeholder,autoFocus,editable,defaultValue,maxLength,onBlur,onSubmitEditing,placeholderTextColor,style,returnKeyType,returnKeyLabel ,selectionColor ,prevIcon,value,checkIcon}=this.props
        const config = {
            placeholder: placeholder || '',
            autoFocus: autoFocus || false,
            defaultValue: defaultValue || '',
            editable: editable || true,
            maxLength : maxLength ,
            onBlur:onBlur,
            onSubmitEditing :onSubmitEditing ,
            placeholderTextColor : placeholderTextColor || '#ccc', 
            selectionColor:selectionColor ||'#108ee9',
            style:style,
            returnKeyLabel,
            value,
        }

        const extraIcon=check 
                ?(checkIcon):null;
        const secureTextEntry=this.props.type==='password';
        return (
            <View style={styles.item}>
                <View style={styles.itemIcon}>{prevIcon}</View>
                <TextInput
                    {...config}
                    onChangeText={this.onChangeText}
                    underlineColorAndroid="transparent"
                    secureTextEntry={secureTextEntry}
                    style={styles.itemText}
                    ref='input'
                    />
                    <Text style={{alignSelf:'center'}}>{extraIcon}</Text>  
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    item:{
        flexDirection:'row',
        justifyContent:'center',
        height:45,
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    itemIcon:{
        alignSelf:'center',
        justifyContent:'center',
        paddingHorizontal:10
    },
    itemText:{
        flex:1,

    },
})
