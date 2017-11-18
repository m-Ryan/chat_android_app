import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback,    
} from 'react-native';
import unicodeToImg from './unicodeToImg';
import domain from './domain';
export default htmlLog = (data,showPic,styles,picSize,wrapStyles,navigator,callback) => {
    data=unescape(data);
    let imgReg = /<img.*?(?:>|\/>)/gi;
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    let arr = data.match(imgReg);
    if(arr){
        if(!showPic) return <Text style={styles}>[图片]</Text>

        var src = arr[0].match(srcReg);
        let src=src[1].replace(/\/\>/,'')
        //获取图片地址
        return  (<View>
                    <TouchableWithoutFeedback 
                        onPress={()=>navigator.navigate("ImgShow",{
                        url:domain+src,
                        callback
                        })}
                        >
                                <Image
                                    source = {{uri:domain+src}}
                                    style = { {
                                            height:picSize,
                                            width:picSize,
                                            marginHorizontal:15,
                                            resizeMode :'stretch'
                                        }}
                                    />
                            </TouchableWithoutFeedback>
                    </View>)
    }else{
        return <View style={wrapStyles}>{unicodeToImg(data,styles,picSize,showPic)}</View>
    }
  
}
