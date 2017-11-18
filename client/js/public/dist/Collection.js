import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  Button,
  FlatList
} from 'react-native';
import ListItem from '../component/ListItem';
import ReadApi from '../../other/ReadApi';
export default class Collection extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
      title: `${navigation.state.params.user.user_name}的收藏`,
      //header:null
    });
     constructor(props) {
         super(props)
         this.state = {
             user: this.props.navigation.state.params.user,
             articles:[],
         }
         this.unMounted=false;
     }
    
    componentWillMount() {
       this.initCollection();
    }
    componentWillUnmount() {
        this.unMounted=true;
     }
     initCollection=async()=>{
        let queryOption = {
            user_id:this.state.user.id,
        }
        let json=await ReadApi.getUserCollection(queryOption);
        let result=Promise.all(
            json.map(async(item,index)=>{
                let queryOption = {
                        id: item.article_id,
                        type:item.article_url_type,
                    }
                let res=await ReadApi.getArticleDetail(queryOption);
                return res[0][0];
                }
            )
        ).then(
            result=>{
                if(this.unMounted) return ;
                this.setState({
                    articles:result
                })
            }
        )

    }
    renderItem=({item})=>{
        return <ListItem article={item} {...this.props}/>
    }
    render() {
       const state=this.state;
       const renderShow=state.articles
       ?<FlatList
                data={state.articles}
                keyExtractor={(item,index) =>{
                    return  (item.article_url_type+index)
                }}
                renderItem={this.renderItem}
                refreshing={false}
                getItemLayout={(data, index) => ( {length: 126, offset: 126 * index, index} )}
            />  
       :<Text>暂无收藏</Text>
       return <View>{renderShow}</View>
    }
}

