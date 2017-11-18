import React from 'react';
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  Button,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import ReadApi from '../../other/ReadApi';
import ListItem from '../component/ListItem';
import FreshenBtn from '../component/FreshenBtn'; 
export default class ListComponent extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
      title:'精彩文章'
    });
     constructor(props){
      super(props)
      this.state={
        searchText:'',
        hotArticles:[],
        guessArticles:[],
      }
    }
     componentWillMount() {
        //热门文章
        let queryOption = {
            order:'article_read_count',
            num:3
        }
       try{
            ReadApi.getRank(queryOption, (json) => {
                if (json) {
                json.splice(3)
                    this.setState({
                        hotArticles:json
                    })
                }
            })
       }catch(err){}

        this.getGuessLove(3);
    }

    //猜你喜欢
    getGuessLove=(num)=>{
        let queryOption = {
            num,
        }
        ReadApi.guessLove(queryOption, (json) => {
            if (json) {
                this.setState({
                    guessArticles: [],
                },()=>{
                    this.setState({
                        guessArticles: json
                    })
                })
            }
        })
    }
    search=()=>{
        let queryOption = {
            title:this.state.searchText
        }
        ReadApi.toSearch(queryOption, (json) => {
            if (json) {
               this.props.navigation.navigate('SearchResult',{
                    title:this.state.searchText,
                    articles:json,
                })
            }
        })
    }
    showDetail=(article)=>{
        this.props.navigation.navigate('ArticleList',{
                type: article.type,
                title:article.title,
            })
     }
    render() {
      let state=this.state;
      const listRenderShow=typeArray.map((item,index)=>{
                        return(
                            <View style={styles.distItem} key={index}>
                                <TouchableOpacity 
                                    style={styles.flex}
                                    onPress={()=>{
                                        this.showDetail(item);
                                        }} >
                                    <Image source={{uri:`${ReadApi.getPathName()}/images/${item.src}`}} style={styles.distItemImg}
                                    resizeMode='cover'
                                    />
                                <View style={styles.itemTextWrap}><Text style={styles.distItemText}>{item.title}</Text></View>
                                </TouchableOpacity>
                            </View>
                        )
        });
     //热门文章
      const hotArticleRender=state.hotArticles
      ?state.hotArticles.map((item,index)=>{
          return(
              <ListItem article={item} key={index} {...this.props} />
          )
      })
      :<Text>文章加载中</Text>;
      //猜你喜欢
      const guessArticleRender=state.guessArticles
      ?state.guessArticles.map((item,index)=>{
          return(
              <ListItem article={item} key={index} {...this.props} />
          )
      })
      :<Text>文章加载中</Text>;
       return  (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.container}>
              <View style={styles.searchbarWrap}>
                  <TextInput style={styles.searchbar} placeholder=" 请输入文章的标题" placeholderTextColor="#ccc"
                    underlineColorAndroid="transparent"
                    onSubmitEditing={this.search}
                    selectionColor={'#108ee9'}
                    onChangeText={(searchText)=>this.setState({searchText})}
                    enablesReturnKeyAutomatically={true}
                    returnKeyType='search'
                    returnKeyLabel='搜索'
                    maxLength = {20}
                />
              </View>
              <View style={styles.distWrap}>
                 <View style={styles.title}><Text style={styles.titleText}>分类</Text></View>
                 <View style={styles.distItemList}>
                    {listRenderShow}
                </View>
              </View>

              <View style={styles.flex}>
                 <View style={styles.title}><Text style={styles.titleText}>热门文章</Text></View>
                 <View style={styles.flex}>
                    {hotArticleRender}
                </View>
              </View>
              <View style={styles.flex}>
                 <View style={styles.title}>
                     <Text style={styles.titleText}>猜你喜欢</Text>
                     <FreshenBtn getGuessLove={this.getGuessLove}/> 
                     </View>
                 <View style={styles.flex}>
                    {guessArticleRender}
                </View>
              </View>
          </View>
          </ScrollView>
       )
    }
}

      
const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    contentContainer:{
        backgroundColor:'#FDFDFD',
    },
    searchbarWrap:{
      height:50,
      marginBottom:5,
    },
    searchbar:{
        flex:1,
        paddingHorizontal:15,
        borderWidth:5,
        borderColor:'#33a5ba',
        fontSize:16,
        backgroundColor:'#fafafa',
    },
    distWrap:{
        flex:1,
    },
    title:{
        marginVertical:10,
        marginHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    titleText:{
        fontSize:20,
        fontWeight:'bold'
    },
    distItemList:{
        flexDirection:'row',
        justifyContent:'center',
        flexWrap:'wrap',
    },
    distItem:{
        width:width/2-20,
        height:110,
        paddingHorizontal:5,
        paddingVertical:10,
        marginHorizontal:5,
        marginBottom:10,
        backgroundColor:'#fff',
        borderColor:'#f0f0f0',
        borderWidth:1
    },
    distItemImg:{
        flex:1,
    },
    itemTextWrap:{
         width:50,
         height:'100%',
         position:'absolute',
         top:15
    },
    distItemText:{
        color:'#FFF',
        fontSize:16,
        textAlign:'center',
        fontWeight:'bold'
    },
    
})

const typeArray=[
    {
        type:'qinggan',
        title:'情感',
        src:'qinggan_731.2710442842633113!cut.jpg'
    },
    {
        type:'shehui',
        title:'社会',
        src:'shehui_861.1076157013526568!cut.jpg'
    },
    {
        type:'shenghuo',
        title:'生活',
        src:'shenghuo_332.2263165155246617!cut.jpg'
    },
    {
        type:'rensheng',
        title:'人生',
        src:'rensheng_134.621501278902491182!cut.jpg'
    },
    {
        type:'renwu',
        title:'人物',
        src:'renwu_869.10559916928151357!cut.jpg'
    },
    {
        type:'lizhi',
        title:'励志',
        src:'lizhi_618.44723138994381890!cut.jpg'
    },
    {
        type:'shiye',
        title:'视野',
        src:'shiye_954.46068122534132170!cut.jpg'
    },
    {
        type:'xinling',
        title:'心灵',
        src:'xinling_108.37128063382242654!cut.jpg'
    },
    {
        type:'xiaoyuan',
        title:'校园',
        src:'xiaoyuan_730.23405607844423169!cut.jpg'
    },
    {
        type:'zhichang',
        title:'职场',
        src:'zhichang_154.73848034639783215!cut.jpg'
    }
]