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
export default class SearchResult extends React.Component {
     constructor(props) {
         super(props)
         this.state = {
             title: this.props.navigation.state.params.title,
             articles:this.props.navigation.state.params.articles,
         }
     }
    static navigationOptions = ({ navigation, screenProps }) => ({
       title: `"${navigation.state.params.title}"的搜索结果`,
       //header:null
    });
    componentWillMount() {
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
                    return  (item.article_title+item.article_url_type)
                }}
                renderItem={this.renderItem}
                refreshing={false}
                getItemLayout={(data, index) => ( {length: 126, offset: 126 * index, index} )}
                ListFooterComponent={<View style={styles.footer}><Text style={styles.footerText}>共 {state.articles.length} 条</Text></View>}
            />  
       :<Text>没有找到相关文章</Text>
       return <View>{renderShow}</View>
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    footer:{
       backgroundColor:'#fff', 
    },
    footerText:{
        padding:5,
        textAlign:'center'
    },
})