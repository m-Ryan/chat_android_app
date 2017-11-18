import React from 'react';
import {connect} from 'react-redux'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    WebView,
    Dimensions,
} from 'react-native';
import emojiJson from '../../other/emotions';
 class FacePackage extends React.Component{
    constructor(props){
        super(props);    
    }
    getEmojiList=()=>{
        let temp=[];
        let arr= Object.keys(emojiJson);
        let emojiList=arr.map((item ,index)=>{
            let url=emojiJson[item].substr(0,emojiJson[item].length-4);
            return (
                <TouchableOpacity key={index}  onPress={()=>this.props.callback(item)}><Image source={{uri:url}}  style={styles.emoji}/>
                </TouchableOpacity>
            )
        });
        for(let i in emojiList){
            if(i % 3 ==0 && i!=0){
                let liItem=[];
                for(let j=0;j<3;j++){
                  liItem.push(emojiList[i-3+j])
                }
                temp.push (
                    <View key={i} style={styles.emojiRow}>
                        {liItem}
                    </View>
                )
            }
        }
        return (
            <ScrollView horizontal={true} keyboardShouldPersistTaps='always'>
                {temp}
            </ScrollView>
        )
    }

    render(){
        const renderShow=this.getEmojiList();
        return (
            <View style={styles.container} > 
                {renderShow}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
       padding:10
    },
    emojiRow:{

    },
    emoji:{
        width:28,
        height:28,
        marginLeft:15,
        marginTop:15
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(FacePackage)