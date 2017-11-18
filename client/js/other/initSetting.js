import {Toast} from 'antd-mobile';
import Service from './Service';

import {
    setLocalStorageData,
    setMainContainerType,
    setSearchResultData,
    setChatLog,
    fromLocalChatLog,
    setLinkmanList,
    addChatLog,
    setFriendRequest,
    setAddFriend,
    setAddChatMan,
    setPhotoUnreadNum,
    setGroupList,
    deleteGroupMember,
    addGroupMember,
    setDeleteGroup,
    setIsReceiveMes,
    setIsReceiveReplay,
    setNotificationData,
    setLove,
    setNavigator,
    setPushLogs
} from './actions';
import {
    StyleSheet,
    Dimensions
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {deleteLog} from './actions';
import unescapeText from './unescapeText';
export default async(user, dispatch ,navigator) => {
    loadLocal(user, dispatch,navigator);
    //获取推送通知
    getNotifation(user, dispatch);
    //获取群组及聊天记录
    getGroup(user, dispatch);
    //获取联系人列表及聊天记录
    getLinkman(user, dispatch,navigator);
    //获取添加好友请求
    getFriendRequest(user, dispatch);
    //获取朋友圈相关
    getActionRelative(user, dispatch);

}
let loadLocal = async(user, dispatch,navigator) => {
    try {
        let storageGroup = await GlobalStorage.asyncLoad(user.id + 'group') || [];
        if (storageGroup.length) {
            dispatch(setGroupList(user.id, storageGroup));
        }
    } catch (err) {
        Toast.info(err, 10)
    }
    try {
        let storageLinkman = await GlobalStorage.asyncLoad(user.id + 'linkman') || [];
        if (storageLinkman.length) {
            dispatch(setLinkmanList(user.id, storageLinkman));
        }
    } catch (err) {
        Toast.info(err, 10)
    }
    try {
        let storageLogs = await GlobalStorage.asyncLoad(user.id + 'allLogs') || [];

        if (storageLogs.length) {
            storageLogs=storageLogs.map(item=>{
                item.log.map((child,cIndex)=>{
                    return unescapeText(child,item,user,dispatch,navigator)
                })
                return item;
            })
        }
        dispatch(setChatLog(user.id, storageLogs))
    } catch (err) {
        Toast.info(err, 10)
    }
}

let getNotifation = async(user, dispatch) => {
    try {
        let notifations = await Service.getNotifation(0, 10);
        // dispatch(setNotificationData(notifations))
    } catch (err) {
        Toast.fail('获取推送消息出错', 1.5)
    }
}

let getGroup = async(user, dispatch) => {
    try {
        let group = await Service.getGroup(user.id);
        dispatch(setGroupList(user.id, group));
        if (!group.length) 
            return [];
        let options = {
            linkman: group
                ? JSON.stringify(group.map(item => item))
                : [],
            user_id: user.id,
            type: 'group',
            onlyUnread: true
        }
        try {
            let groupLog = await Service.getAllLog(options);
            dispatch(setPushLogs(user.id, groupLog, 'group'));
        } catch (err) {
            Toast.fail('获取群组聊天记录', 1.5)
        }
    } catch (err) {
        Toast.fail('获取群组信息出错', 1.5)
    }
}

let getLinkman = async(user, dispatch,navigator) => {
    try {
        //获取联系人
        let linkman = await Service.getLinkman({id: user.id});
        dispatch(setLinkmanList(user.id, linkman));
        //获取联系人的聊天记录
        getLinkmanLog(user, dispatch, linkman,navigator);

    } catch (err) {
        Toast.fail('获取联系人出错', 1.5)
    }

}
let getLinkmanLog = async(user, dispatch, linkman,navigator) => {
    if (!linkman.length) 
        return [];
    
    let options = {
        linkman: linkman
            ? JSON.stringify(linkman.map(item => item))
            : [],
        user_id: user.id,
        type: 'private',
        onlyUnread: true
    }
    try {
        //读取数据库未读
        let linkmanLog = await Service.getAllLog(options);
        linkmanLog=linkmanLog.map(item=>{
            item.log.map((child,cIndex)=>{
               return unescapeText(child,item,user,dispatch,navigator)
            })
            return item;
        })
        dispatch(setPushLogs(user.id, linkmanLog, 'private'));
    } catch (err) {
        Toast.fail(err+'获取聊天记录出错', 10)
    }
    //设置为已读
    try{
        Promise.all(linkman.map(item => {
            let options = {
                uid: user.id,
                rid: item.id
            }
            try {
                Service.setRead(options)
            } catch (err) {
                log(err)
            }
        }))
    }catch(err){
        log(err)
    }
}
let getFriendRequest = async(user, dispatch) => {
    try {
        let request = await Service.getFriendRequest(user.id);
        if (request.length > 0) {
            dispatch(setFriendRequest(request))
        }

    } catch (err) {
        Toast.fail('获取好友请求出错', 1.5)
    }
}
let getActionRelative = async(user, dispatch) => {
    try {
        let friendAction = await Service.getPhotoUnread(user.id);
        dispatch(setPhotoUnreadNum(friendAction))
    } catch (err) {
        Toast.fail('获取朋友圈信息出错', 1.5)
    }
}