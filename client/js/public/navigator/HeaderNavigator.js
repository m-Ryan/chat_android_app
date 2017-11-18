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
  Component,  
  StyleSheet,  
  Text,  
  View,  
  FlatList,
  Image,
  NetInfo
} from 'react-native';
import {createStore, applyMiddleware,connect} from 'redux';
import { Provider } from 'react-redux';
import reducers from '../../other/reducers';
import thunk from 'redux-thunk';
const store = createStore(reducers,applyMiddleware(thunk));

import { StackNavigator } from 'react-navigation';

import Login from '../dist/Login';
import Register from '../dist/Register';
import FirstSceen from '../dist/FirstSceen';
import Setup from '../dist/Setup';
import UserInfo from '../dist/UserInfo';
import UpdateInfo from '../dist/UpdateInfo';
import ChatPage from '../dist/ChatPage';
import ChatSetting from '../dist/ChatSetting';
import FriendInfo from '../dist/FriendInfo';
import FriendAction from '../dist/FriendAction';
import Index from './BottomNavigator';
import Action from '../dist/Action';
import SerachFriend from '../dist/SerachFriend';
import CreateGroup from '../dist/CreateGroup';
import GroupChat from '../dist/GroupChat';
import GroupMember from '../dist/GroupMember';
import AddGroupMember from '../dist/AddGroupMember';
import FeedBack from '../dist/FeedBack';
import About from '../dist/About';
import ImgShow from '../dist/ImgShow';
import Article from '../dist/Article';
import ArticleDetail from '../dist/ArticleDetail';
import ArticleList from '../dist/ArticleList';
import SearchResult from '../dist/SearchResult';
import Collection from '../dist/Collection';
import DrawingEntry from '../dist/DrawingEntry';
import Draw from '../dist/Draw';
import CheckNetInfo from '../component/CheckNetInfo';
class MyNavigator extends React.Component {
    constructor(props){
      super(props);
    }


    render() { 
      const ModalStack = StackNavigator({
          FirstSceen:{
            screen: FirstSceen
          },
          Login:{
            screen: Login
          },
          Register:{
            screen: Register
          },
          Index: {
                screen: Index
            },
            Setup: {
                screen: Setup
          },
          UserInfo:{
            screen: UserInfo
          }, 
          UpdateInfo:{
            screen: UpdateInfo
          },
          ChatPage:{
            screen: ChatPage
          },
          ChatSetting:{
              screen:ChatSetting
          },
          FriendInfo:{
                screen: FriendInfo 
          },
          FriendAction:{
              screen:FriendAction
          },
          Action:{
              screen:Action
          },
          SerachFriend:{
              screen:SerachFriend
          },
          CreateGroup:{
              screen:CreateGroup
          },
          GroupChat:{
              screen:GroupChat
          },
          GroupMember:{
            screen:GroupMember
          },
          AddGroupMember:{
              screen:AddGroupMember
          },
          FeedBack:{
            screen:FeedBack
          },
          About:{
              screen:About
          },
          ImgShow:{
              screen:ImgShow
          },
          Article:{
              screen:Article
          },
          ArticleDetail:{
              screen:ArticleDetail
          },
          ArticleList:{
              screen:ArticleList
          },
          SearchResult:{
              screen:SearchResult
          },
          Collection:{
              screen:Collection
          },
          DrawingEntry:{
              screen:DrawingEntry
          },
          Draw:{
              screen:Draw
          }
        } ,{ 
             navigationOptions: {
                headerTintColor: '#FFF',
                headerStyle: {
                    backgroundColor: '#108ee9', 
                    height:50,
                },
            },
            initialRouteName:'FirstSceen'
        })
       return (
            <View style={{flex:1}}>
                <CheckNetInfo />
                <ModalStack />     
            </View>
       )
    }
}

export default function Root() {
    return (
        <Provider store={store}>
            <MyNavigator />
        </Provider>
    )
} 