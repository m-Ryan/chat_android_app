import React from 'react';
import { Router, Route } from 'react-router';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ReadApi from '../../other/ReadApi';
export default class Block extends React.PureComponent{
     constructor(props) {
		super(props);
		this.state = {
			article: this.props.article, //文章信息
		};
         
	}

    showDetail=()=>{
        let article=this.state.article;
        this.props.navigation.navigate('ArticleDetail',{
                id: article.article_id,
                type: article.article_url_type,
                title:'返回'
            })
     }
     render(){
        const {article}=this.state;
        const renderShow=article
        ?<TouchableOpacity onPress={this.showDetail} >
                <View  style={[styles.flex,styles.wrap]}>
                <View>
                    <Image source={{uri:`${ReadApi.getPathName()}/images/${article.article_img}`}} style={styles.img}/>
                </View>
                <View style={[styles.flex,styles.text]}>
                    <Text numberOfLines={1} style={styles.title}>{article.article_title}</Text>
                    <Text numberOfLines={4}>{article.article_summary}</Text>
                </View>
                </View>
            </TouchableOpacity>
            :<View><ActivityIndicator color="#108ee9" size="large" /></View>;
        return (
            <View style={styles.flex}>{renderShow}</View>
            )
    }
}


const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
    wrap:{
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft:10,
        paddingRight:20,
        marginBottom:5,
        flexDirection:'row',
        borderBottomWidth: 1,
        borderColor:'#ccc',
        backgroundColor:'#fff'
    },
    img:{
        width:130,
        height:100,
    },
    text:{
        paddingLeft:10,
        paddingRight:10,
        
    },
    title:{
        color:'#108ee9',
        fontSize:16,
        marginLeft:-4,
    }
})