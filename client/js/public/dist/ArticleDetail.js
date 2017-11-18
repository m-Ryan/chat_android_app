import React from 'react';
import {
    Component,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux'
import ReadApi from '../../other/ReadApi';
import {Button, SearchBar, Icon, ActionSheet, Toast} from 'antd-mobile';
const {width, height} = Dimensions.get('window');
class ArticleDetail extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => ({header: null});
    constructor(props) {
        super(props)
        this.state = {
            article: null,
            isCollect:false,
            collectInfo:'',//加入收藏的信息
        }
    }
    async componentWillMount () {
        let queryOption = {
            id: this.props.navigation.state.params.id,
            type: this.props.navigation.state.params.type
        }
        const json=await ReadApi.getArticleDetail(queryOption)        
        if (json) {
            let article=json[0][0]
            this.setState({article});
            let options = {
                user_id:this.props.localStorageData.id,
                article_id:article.article_id,
                article_url_type:article.article_url_type
            }
           const collectResult=await ReadApi.getArticleCollection(options);
           let isCollect=!!collectResult.length;
            this.setState({
                isCollect:isCollect,
                collectInfo:collectResult[0]
            })
        }
    }

    collectHandle = () => {
        let state=this.state;
          let queryOptions = {
              user_id: this.props.localStorageData.id,
              article_id: state.article.article_id,
              article_url_type: state.article.article_url_type,
              id: (state.collectInfo ? state.collectInfo.id : ''),
              action: state.isCollect ? 'delete' : 'add',
          }
  
          ReadApi.collect(queryOptions, (json) => {
              let isCollect = !!json.length;
              this.setState({
                  isCollect: !state.isCollect,
                  collectInfo: json[0]
              })
          })
        }
    render() {
        const state = this.state;
        const {article ,isCollect} = state;
        const textArr = article
            ? article
                .article_content
                .replace(/\<p\>/g, '')
                .split(/\<\/p\>/)
            : null
        const collectIcon=isCollect?<Icon type={"\uE6A3"} color='#fff' style={styles.headerIcon}/>:<Icon type={"\uE6A4"} color='#fff' style={styles.headerIcon}/>
        const content = textArr
            ? textArr.map((item, index) =><View key = {index}> 
            <Text style={styles.paragraph}>{item}</Text></View>):null;
            const renderComponent = article
                ? (
                    <View style={[styles.container]}>
                        <Text style={styles.title}>{article.article_title}</Text>
                            <Text style={styles.info}>时间：{article.article_date}作者：{article.article_writer}</Text>
                        <View style={styles.img}>
                            <Image
                                source={{
                                uri: `${ReadApi.getPathName()}/images/${article.article_img}`
                            }}
                                style={styles.img}/>
                        </View>
                        <View style={styles.content}>{content}</View>
                    </View>
                )
                : null;
            return (
                <View style={styles.flex}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                            flexDirection: 'row'
                        }}>
                            <Icon type={"\uE61C"} color='#fff' style={styles.headerIcon}/>
                            <Text style={styles.text}>返回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.collectHandle} style={styles.extraBtn}>
                           {collectIcon}
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.flex}>
                        {renderComponent}
                    </ScrollView>
                </View>
            )
        }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        backgroundColor: '#fff',
        padding: 30
    },
    commentContainer: {
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff'
    },
    commentTitleView: {
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    commentTitle: {
        color: '#333'
    },
    noComment: {
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        marginBottom: 5
    },
    info: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 5
    },
    contentImg: {
        textAlign: 'center'
    },
    img: {
        width: '100%',
        height: 200
    },
    paragraph: {
        fontSize: 16,
        marginTop: 5,
        color: '#333'
    },
    header: {
        backgroundColor: '#108ee9',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    text: {
        color: '#fff',
        fontSize: 18
    },
    headerBtn: {
        paddingHorizontal: 20
    },
    headerIcon: {
        fontSize: 20,
        color: '#fff'
    },
    extraMenu: {
        width: width,
        height: height - 50,
        position: 'absolute',
        zIndex: 999,
        paddingTop: 50,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    extraMenuItem: {
        backgroundColor: '#fff',
        width: 120,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    extraMenuText: {
        color: '#333',
        paddingVertical: 10
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(ArticleDetail)