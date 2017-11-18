import React, {Component} from 'react'
import emojiJson from './emotions';
import {
    Text,
    Image,
    View
} from 'react-native';
export default (str,styles,picSize,showPic)=>{
    let renderList=[];
    let emojiArr=str.match(/\/\:\:\)\d{1,2}\&/ig); 
    let urlArr=[];
    if(!emojiArr){
        if(!showPic){
            return <Text numberOfLines={1} style={styles}>{unescape(str)}</Text>
        }else{
            return <Text style={styles}>{str}</Text>
        }
    }

    urlArr= fillterEmoji(emojiArr);
    let num=0;
    while(str){
        let splitIndex=str.search(/\/\:\:\)\d{1,2}\&/i);
        if(splitIndex===0){
            str=str.substring(emojiArr[num].length);
            const url=urlArr[num].substr(0,urlArr[num].length-4);

            renderList.push(<View key={'img'+str.length+'--'+num} style={{backgroundColor:'#fff'}}>
                        <Image
                            source = {
                                {
                                    uri:url
                                }
                            }
                            style = {
                                {
                                    width:22,
                                    height:22
                                }
                            } />
                    </View>)
                   num++;
        }else if(splitIndex===-1){
            renderList.push(<Text key={'text'+str.length}  style={styles}>{unescape(str)}</Text>);
            str='';
        }else{
            renderList.push(<Text key={'text'+str.length}  style={styles}>{unescape(str.substring(0,splitIndex))}</Text>);
            str=str.substring(splitIndex);
        }
    }
    return <View style={{flexDirection:'row',flexWrap:'wrap'}}>{renderList}</View>;
}

const fillterEmoji=(emojiArr)=>{
    let temp=[];
    for (let i in emojiArr) {
        for (let j in emojiJson) {
            if(emojiArr[i] === j){
               temp.push(emojiJson[j])
                break;
            }
        }
    }

    return temp;
}