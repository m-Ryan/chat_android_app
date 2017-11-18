/**
 * action 类型
 */
'use strict'

export const SER_SOUND_OPEN = 'SER_SOUND_OPEN';
export const SER_GROUP_SOUND_OPEN = 'SER_GROUP_SOUND_OPEN';
export const SET_LOCAL_STORAGE_DATA='SET_LOCAL_STORAGE_DATA';
export const SET_MAIN_CONTAINER='SET_MAIN_CONTAINER';
export const SET_SEARCH_RESULT_DATA = 'SET_SEARCH_RESULT_DATA';
export const SET_CURRENT_CHAT_MAN_DATA = 'SET_CURRENT_CHAT_MAN_DATA';
export const SET_CHAT_LOG= 'SET_CHAT_LOG';
export const ADD_CHAT_LOG = 'ADD_CHAT_LOG';
export const SET_UNREAR='SET_UNREAR';
export const SET_MOUSE_LOCATION='SET_MOUSE_LOCATION';
export const SET_CURRENT_MENU='SET_CURRENT_MENU';
export const SET_LOG_LEVEL= 'SET_LOG_LEVEL';
export const SET_PUSH_LOGS = 'SET_PUSH_LOGS';
export const DELETE_CONVERSATION= 'DELETE_CONVERSATION';
export const DELETE_LOGS= 'DELETE_LOGS';
export const SET_LINKMAN_LIST = 'SET_LINKMAN_LIST';
export const SET_UPLOAD_FLAG='SET_UPLOAD_FLAG';
export const SET_UPLOAD_RESULT= 'SET_UPLOAD_RESULT';
export const SET_PHOTO_UNRERAD_NUM = 'SET_PHOTO_UNRERAD_NUM';
export const SET_PHOTO_LIST = 'SET_PHOTO_LIST';
export const ADD_PHOTO_LIST = 'ADD_PHOTO_LIST';
export const UPDATE_PHOTO_LIST = 'UPDATE_PHOTO_LIST';
export const UPDATE_PHOTO_LIST_REPLAY='UPDATE_PHOTO_LIST_REPLAY';
export const SET_FRIEND_REQUEST_DATA='SET_FRIEND_REQUEST_DATA';
export const SET_DELETE_FRIEND = 'SET_DELETE_FRIEND';
export const SET_ADD_FRIEND = 'SET_ADD_FRIEND';
export const DELETE_FRIEND_REQUEST = 'DELETE_FRIEND_REQUEST';
export const DELETE_LOG = 'DELETE_LOG';
export const DELETE_ALL_LOGS = 'DELETE_ALL_LOGS';
export const ADD_PHOTO_ITEM = 'ADD_PHOTO_ITEM';
export const DELETE_PHOTO = 'DELETE_PHOTO';
export const DELETE_PHOTO_REPLAY = 'DELETE_PHOTO_REPLAY';
export const SET_LOVE = 'SET_LOVE';
export const SET_UPLOAD_PHOTO_DATA = 'SET_UPLOAD_PHOTO_DATA';
export const SET_GROUP_LIST = 'SET_GROUP_LIST';
export const SET_DELETE_GROUP = 'SET_DELETE_GROUP';
export const SET_ADD_GROUP = 'SET_ADD_GROUP';
export const SET_MENU_VISIBLE = 'SET_MENU_VISIBLE';
export const ADD_GROUP_MEMBER = 'ADD_GROUP_MEMBER';
export const DELETE_GROUP_MEMBER = 'DELETE_GROUP_MEMBER';
export const DELETE_GROUP = 'DELETE_GROUP';
export const ADD_PREV_CHAT_LOG = 'ADD_PREV_CHAT_LOG';
export const SET_HISTORY = 'SET_HISTORY';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_IS_RECEIVE_MES = 'SET_IS_RECEIVE_MES';
export const EXIT_GROUP = 'EXIT_GROUP';
export const SET_LOGOUT = 'SET_LOGOUT';

//admin
export const SET_USER_LIST_DATA = 'SET_USER_LIST_DATA';
export const ADD_USER_LIST_DATA = 'ADD_USER_LIST_DATA';
export const SET_USER_COUNT_DATA= 'SET_USER_COUNT_DATA';
export const SET_NOTIFICATION_DETAIL = 'SET_NOTIFICATION_DETAIL';
export const SET_IS_RECEIVE_REPLAY = 'SET_IS_RECEIVE_REPLAY';
export const SET_NOTIFICATION_DATA = 'SET_NOTIFICATION_DATA';

//设置导航
export const SET_NAVIGATOR='SET_NAVIGATOR';
export const SET_BOTTOM_NAVIGATOR = 'SET_BOTTOM_NAVIGATOR';


//你画我猜
export const SET_ROOM_ID='SET_ROOM_ID';
export const SET_DESK_LIST='SET_DESK_LIST';


/**
 * action 创建的函数
 *  
 */
 
//导航
export function setNavigator(navigator){
    return {type:SET_NAVIGATOR,navigator}
}
export function setBottomNavigator(navigator){
    return {type:SET_BOTTOM_NAVIGATOR,navigator}
}

 //退出清除所有state
export function setLogout(){
    return {type:SET_LOGOUT}
}
export function resizeHeight(height){
    return {type:RESIZE_HEIGHT,height}
}

export function resizeWidth(width){
    return {type:RESIZE_WIDTH,width}
}

//声音控制

export function setSoundOpen(flag){
    return {type:SER_SOUND_OPEN,flag}
}
export function setGroupSoundOpen(flag){
    return {type:SER_GROUP_SOUND_OPEN,flag}
}

export function setLocalStorageData(data){
    return {type:SET_LOCAL_STORAGE_DATA,data}
}
export function setSearchResultData(data){
    return {type:SET_SEARCH_RESULT_DATA,data}
}
export function setCurrentChatMan(data){
    return {type:SET_CURRENT_CHAT_MAN_DATA,data}
}

export function setMouseLocation(x,y){
    return {type:SET_MOUSE_LOCATION,x,y}
}
export function setCurrentMenu(data){
    return {type:SET_CURRENT_MENU,data}
}
export function setMenuVisible(data){
    return {type:SET_MENU_VISIBLE,data}
}
export function setLinkmanList(user,data){
    return {type:SET_LINKMAN_LIST,user,data}
}


//聊天记录
export function setChatLog(user,data,logType){
    return {type:SET_CHAT_LOG,user,data,logType}
}
export function addChatLog(user,data,logType,chatMan){
    return {type:ADD_CHAT_LOG,data,user,logType,chatMan}
}
export function setlogLevel(user,id,logType){
    return {type:SET_LOG_LEVEL,user,id,logType}
}
export function setUnread(user,id,logType){
    return {type:SET_UNREAR,user,id,logType}
}
export function deleteConversation(user,id,logType){
    return {type:DELETE_CONVERSATION,user,id,logType}
}
export function deleteAllLogs(user){
    return {type:DELETE_ALL_LOGS,user}
}
export function deleteLog(user,rid,id,logType){
    return {type:DELETE_LOG,user,rid,id,logType}
}
export function setPushLogs(user,data,logType){
    return {type:SET_PUSH_LOGS,user,data,logType}
}
export function addPrevChatLog(user,id,data,logType){
    return {type:ADD_PREV_CHAT_LOG,user,id,data,logType}
}

//群操作
export function setGroupList(user,data){
    return {type:SET_GROUP_LIST,user,data}
}
export function setDeleteGroup(user,gid){
    return {type:SET_DELETE_GROUP,user,gid}
}
export function setAddGroup(user,data){
    return {type:SET_ADD_GROUP,user,data}
}
export function addGroupMember(user,member,gid){
    return {type:ADD_GROUP_MEMBER,user,member,gid}
}
export function deleteGroupMember(user,id ,gid,exit){
    return {type:DELETE_GROUP_MEMBER,user,id ,gid,exit}
}

//上传图片flag
export function setUploadFlag(flag){
    return {type:SET_UPLOAD_FLAG,flag}
}
//上传图片后返回的结果数组
export function setUploadResult(data){
    return {type:SET_UPLOAD_RESULT ,data}
}
export function setPhotoList(data){
    return {type:SET_PHOTO_LIST ,data}
}
export function addPhotoitem(data){
    return {type:ADD_PHOTO_ITEM ,data}
}
export function addPhotoList(data){
    return {type:ADD_PHOTO_LIST ,data}
}
export function setPhotoUnreadNum(data){
    return {type:SET_PHOTO_UNRERAD_NUM ,data}
}
export function updatePhotoList(data){
    return {type:UPDATE_PHOTO_LIST ,data}
}
export function setLove(id,add,name){
    return {type:SET_LOVE ,id,add,name}
}
export function updatePhotoListReplay(data){
    return {type:UPDATE_PHOTO_LIST_REPLAY ,data}
}
export function setUploadPhotoData(data){
    return{type:SET_UPLOAD_PHOTO_DATA,data}
}
export function setFriendRequest(data){
    return {type:SET_FRIEND_REQUEST_DATA ,data}
}
export function setDeleteFriend(user,id){
    return {type:SET_DELETE_FRIEND ,user,id}
}
export function setAddFriend(user,data){
    return {type:SET_ADD_FRIEND ,user,data}
}
export function deleteFriendRequest(id){
    return {type:DELETE_FRIEND_REQUEST ,id}
}
export function deletePhoto(id){
    return {type:DELETE_PHOTO ,id}
}
export function deletePhotoReplay(pid,id){
    return {type:DELETE_PHOTO_REPLAY ,pid,id}
}
export function setHistory(history){
    return {type:SET_HISTORY ,history}
}
export function setLocation(location){
    return {type:SET_LOCATION ,location}
}
export function setIsReceiveMes(flag){
    return {type:SET_IS_RECEIVE_MES ,flag}
}

export function setIsReceiveReplay(data){
    return {type:SET_IS_RECEIVE_REPLAY ,data}
}
//admin
export function setUserListData(data){
    return {type:SET_USER_LIST_DATA ,data}
}
export function addUserListData(data){
    return {type:ADD_USER_LIST_DATA ,data}
}
export function setUserCountData(data){
    return {type:SET_USER_COUNT_DATA ,data}
}
export function setNotificationDetail(data){
    return {type:SET_NOTIFICATION_DETAIL ,data}
}
export function setNotificationData(data){
    return {type:SET_NOTIFICATION_DATA ,data}
}

//你画我猜

export function setRoomId(id){
    return {type:SET_ROOM_ID ,id}
}

export function setDeskList(data){
    return {type:SET_DESK_LIST ,data}
}