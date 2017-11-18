import React from 'react';  
import {  
    AppRegistry,   
} from 'react-native';  
import HeaderNavigator from './client/js/public/navigator/HeaderNavigator';
import io from 'socket.io-client';
global.socket = io('http://118.89.42.149:3333', {
    transports: ['websocket'],
    timeout:60000
});
global.log=console.log;
import GlobalStorage from './client/js/other/LOCAL_STORAGE';
AppRegistry.registerComponent('nativeDemo', () => HeaderNavigator);  
