/**
 * 实现功能：封装导航器初始化设置
 * 包含组件：navigator
 * 
 * 外部传入：
 *  component 需要展示的页面组件
 *  route对象 必须添加component属性 ： 如果需要传值可以添加passProps属性
 */


import React from 'react';
import { Router, Route } from 'react-router';
import {
  StyleSheet,  
  View,  
  Image,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux'
const {height, width} = Dimensions.get('window');
import {setLocalStorageData ,setMainContainerType ,setSearchResultData ,setChatLog ,fromLocalChatLog ,setLinkmanList ,addChatLog ,setFriendRequest ,setAddFriend  ,setAddChatMan ,setPhotoUnreadNum ,deleteGroupMember ,addGroupMember ,setIsReceiveMes ,setIsReceiveReplay ,setNotificationData ,setLove ,setNavigator} from '../../other/actions';
import SERVICE from '../../other/Service';
import { NavigationActions } from 'react-navigation';
 class FirstSceen extends React.Component {
    constructor(props){
      super(props);
    }
    static navigationOptions = ({ navigation }) => ({  
        header:null
     });
    
     componentDidMount (){
        if(!this.props.navigator){
            this.props.dispatch(setNavigator(this.props.navigation))
        }
        this.init()
     }

    init=async ()=>{
        let user =await GlobalStorage.asyncLoad('user');
        if(!user){
            this.timer= setTimeout(()=>{
                let resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Login'}),
                    ]
                  })
                  this.props.navigation.dispatch(resetAction)
            },500)
        }else{
            this.props.dispatch(setLocalStorageData(user))
            this.timer= setTimeout(()=>{
                let resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Index'}),
                    ]
                  })
                  this.props.navigation.dispatch(resetAction)
            },500)
        }

     }
     
    componentWillMount(){
        clearTimeout(this.timer)
    }
    render() { 
    
       return (
            <View><Image source={require('../../../images/first_sceen.jpg')}  style={styles.img}/></View>
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
    },
    img:{
        width,
        height
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(FirstSceen)