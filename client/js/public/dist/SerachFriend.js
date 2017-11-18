import React from 'react';
import { connect } from 'react-redux'
import {
  Component,  
  StyleSheet,  
  Text,  
  View,  
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { Button ,SearchBar,Icon ,InputItem} from 'antd-mobile';
import BottomNavigator from '../navigator/BottomNavigator';
import Service from '../../other/Service';
import domain from '../../other/domain';
import SexIcon from '../component/SexIcon';
 class Action extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title:'添加朋友'
      });
    constructor(props){
      super(props);
      this.state={
          text:'',
          searchResult:[],
          fetched:false
      }
    }
    searchHandle=()=>{
        const {text}=this.state;
        this.setState({fetched:false})
        if(!text){
          return  this.refs.searchBar.refs.searchInput.blur();
        }
        Service.getSearch(text)
                .then(
                    res=>{
                        this.setState({
                            text:'',
                            searchResult:res,
                            fetched:true
                        })
                    }
                )
    }
    cancelHandle=()=>{

        this.refs.searchBar.refs.searchInput.blur();
    }
    textChangeHandle=(text)=>{
        this.setState({text})
    }
    readInfo=(chatMan)=>{
        this.props.navigator.navigate('FriendInfo',{
            chatMan
        })
    }
    render() { 
       const {text ,searchResult ,fetched}=this.state;
       const resultRender=searchResult.length
                         ?searchResult.map((item,index)=>(
                             <TouchableOpacity onPress={()=>this.readInfo(item)}  key={index}>
                                <View style={styles.searchItem}>
                                    <Image source={{uri:domain+item.user_faceSrc}}  style={styles.avator}/>
                                    <View style={styles.searchText}>
                                        <Text style={styles.searchName}>{item.user_name} {SexIcon(item.user_sex,18)}</Text>
                                        <Text style={styles.searchEmail}>({item.user_email})</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                         ))
                         :(fetched
                            ?<Text>没有找到相关用户</Text>
                            :null
                         )
       return (
           <View style={styles.flex}>
               <SearchBar 
                    placeholder="搜索"  
                    returnKeyType='search' 
                    returnKeyLabel='搜索' 
                    placeholderTextColor='#ccc' 
                    selectionColor='#ccc'
                    value={text}
                    onChange={this.textChangeHandle}
                    onSubmit={this.searchHandle}
                    onCancel={this.cancelHandle}
                    ref='searchBar'
                    />
                    {resultRender}          
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
    avator:{
        width:60,
        height:60,
        borderRadius:60,
        marginRight:15
    },
    searchItem:{
        padding:5,
        flexDirection:'row',
        backgroundColor:'#fff',
        borderBottomWidth:0.5,
        borderBottomColor:'#ccc'
    },
    searchText:{
        justifyContent:'center'
    },
    searchName:{
        fontSize:16,
        color:'#333'
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)