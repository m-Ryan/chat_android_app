import React from 'react';
import {
  Component,  
  StyleSheet,  
  FlatList,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import ReadApi from '../../other/ReadApi';
import ListItem from './ListItem';
export default class ListItems extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            articles: [], //文章列表
            isFooter:false,//是否已经到达底部
            type: this.props.type ||this.props.navigation.state.params.type,
            beginNum: this.props.beginNum ||0,
            num: this.props.num || 10,
            sortType: this.props.sortType || '',
        };
        this.loadNum=0; //加载次数，默认为0，没有用state，是因为setState是异步的,用setState做回调也可以，不过不影响渲染所以没必要回调
        this.isLoading=false;
    }
    componentWillMount() {
         this.endReached(); //初始化数据
    }
    showItem=({item}) => {
        return(
            <ListItem article={item} {...this.props}/>
        )
    }
    endReached = (info) => {
        if(this.isLoading) return;
           this.isLoading=true;
        let state = this.state;
        if (state.isFooter) return false; //到达底部，不需要了
        this.loadNum = this.loadNum + 1;
        let queryOption = {
            type: state.type,
            beginNum: this.loadNum * state.num, //开始加载数据的位置
            num: state.num,
            sortType: state.sortType,
        }
        ReadApi.getListItem(queryOption, (json) => {
            if (json) {
                let isFooter = (json.length < state.num) ? true : false;
                this.setState({
                    articles: state.articles.concat(json),
                    isFooter: isFooter
                })
                this.isLoading=false;
            }
        })
    }
    render() { 
       const state=this.state;
       const isFooter=this.state.isFooter
            ?<View style={styles.footer}><Text style={styles.footerText}>已经加载全部文章</Text></View>
            :<View><ActivityIndicator color="#108ee9" size="large" /></View>;
       const renderShow=state.articles
            ?<FlatList
                data={state.articles}
                keyExtractor={(item) => item.article_id}
                renderItem={this.showItem}
                refreshing={false}
                ListHeaderComponent={null}  //因为和scrollView 共用有bug ,所以设为头部
                onEndReached={this.endReached}
                onEndReachedThreshold={0.1}
                getItemLayout={(data, index) => ( {length: 126, offset: 126 * index, index} )}
                ListFooterComponent={isFooter}
            />  
            :<View><ActivityIndicator color="#108ee9" size="large" /></View>;
       return (
           <View>{renderShow}</View>
       )
    }
}


const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
    footer:{
        height:30,
        backgroundColor:'#FFF',
        marginBottom:3,
    },
    footerText:{
        textAlign:'center',
        fontSize:14,
        marginTop:7
    },
})