import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {TabNavigator} from 'react-navigation';
import Conversation from '../dist/Conversation';
import Linkmans from '../dist/Linkmans';
import Setup from '../dist/Setup';
import UserInfo from '../dist/UserInfo';
import {Icon} from 'antd-mobile';
export default MainNavigator = TabNavigator({
    Home: {
        screen: Conversation,
        navigationOptions: {
            tabBarIcon: ({tintColor, focused}) => (<Icon type={'\uE65E'} size={26} color={tintColor}/>)
        }
    },
    Linkmans: {
        screen: Linkmans,
        navigationOptions: ({navigation}) => {
            return {
                tabBarIcon: ({tintColor, focused}) => (<Icon type={"\uE66D"} size={26} color={tintColor}/>)
            }
        }
    },
    Setup: {
        screen: Setup,
        navigationOptions: ({navigation}) => {
            return {
                tabBarIcon: ({tintColor, focused}) => (<Icon type={"\uE672"} size={26} color={tintColor}/>)
            }
        }
    },
    UserInfo: {
        screen: UserInfo,
        navigationOptions: ({navigation}) => {
            return {
                tabBarIcon: ({tintColor, focused}) => (<Icon type={"\uE66A"} size={26} color={tintColor}/>)
            }
        }
    }
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
        activeTintColor: '#33a5ba', // 文字和图片选中颜色
        inactiveTintColor: '#555', // 文字和图片默认颜色
        showLabel: false, //标签显示
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        lazy: true,
        backBehavior: 'none',
        indicatorStyle: {
            height: 0
        }, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
        style: {
            backgroundColor: '#FFF', // TabBar 背景色
        }
    }
})
