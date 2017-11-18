import {
    combineReducers
} from 'redux';
import {
    SET_NAVIGATOR,
    SET_BOTTOM_NAVIGATOR,
    SER_SOUND_OPEN,
    SER_GROUP_SOUND_OPEN,
    SET_LOCAL_STORAGE_DATA,
    SET_MAIN_CONTAINER,
    SET_SEARCH_RESULT_DATA,
    SET_CURRENT_CHAT_MAN_DATA,
    SET_CHAT_LOG,
    GET_CHAT_LOG,
    SET_PUSH_LOGS,
    DELETE_ALL_LOGS,
    FROM_LOCAL_CHAT_LOG,
    SET_UNREAR,
    SET_CHAT_CONTAINER_SCROLL,
    SET_MOUSE_LOCATION,
    SET_CURRENT_MENU,
    SET_LOG_LEVEL,
    DELETE_CONVERSATION,
    DELETE_LOGS,
    SET_LINKMAN_LIST,
    SET_UPLOAD_FLAG,
    SET_UPLOAD_RESULT,
    SET_PHOTO_LIST,
    ADD_PHOTO_LIST,
    SET_LOVE,
    UPDATE_PHOTO_LIST_REPLAY,
    UPDATE_PHOTO_LIST,
    ADD_CHAT_LOG,
    SET_FRIEND_REQUEST_DATA,
    SET_DELETE_FRIEND,
    SET_ADD_FRIEND,
    DELETE_FRIEND_REQUEST,
    SET_ADD_FRIEND_REQUEST,
    DELETE_LOG,
    ADD_PHOTO_ITEM,
    DELETE_PHOTO,
    DELETE_PHOTO_REPLAY,
    SET_HISTORY,
    SET_UPLOAD_PHOTO_DATA,
    SET_PHOTO_UNRERAD_NUM,
    SET_GROUP_LIST,
    SET_DELETE_GROUP,
    SET_ADD_GROUP,
    SET_MENU_VISIBLE,
    ADD_GROUP_MEMBER,
    DELETE_GROUP_MEMBER,
    ADD_PREV_CHAT_LOG,
    SET_IS_RECEIVE_MES,
    SET_IS_RECEIVE_REPLAY,
    SET_LOGOUT,
    /*admin*/
    SET_ADMIN_CONTAINER_TYPE,
    SET_USER_LIST_DATA,
    ADD_USER_LIST_DATA,
    SET_USER_COUNT_DATA,
    SET_NOTIFICATION_DETAIL,
    SET_LOCATION,
    SET_NOTIFICATION_DATA,
    //你画我猜
    SET_ROOM_ID,
    SET_DESK_LIST

} from './actions';
import {
    Storage
} from './public';
import moment from 'moment';
'use strict'


function navigator(state = null, action) {
    switch (action.type) {
        case SET_NAVIGATOR:
            return action.navigator;
        default:
            return state
    }
}

function bottomNavigator(state = null, action) {
    switch (action.type) {
        case SET_BOTTOM_NAVIGATOR:
            return action.navigator;
        default:
            return state
    }
}

//用户本地存储数据
function localStorageData(state = {}, action) {
    switch (action.type) {
        case SET_LOCAL_STORAGE_DATA:
            return action.data;
        case SET_LOGOUT:
            return {};
        default:
            return state;
    }
}


function soundOpen(state = true, action) {
    switch (action.type) {
        case SER_SOUND_OPEN:
            return action.flag;
        case SET_LOGOUT:
            return true;
        default:
            return state
    }
}
function groupSoundOpen(state = false, action) {
    switch (action.type) {
        case SER_GROUP_SOUND_OPEN:
            return action.flag;
        case SET_LOGOUT:
            return false;
        default:
            return state
    }
}


function searchResultData(state = [], action) {
    switch (action.type) {
        case SET_SEARCH_RESULT_DATA:
            return action.data;
        case SET_LOGOUT:
            return [];
        default:
            return state
    }
}

function searchResultData(state = [], action) {
    switch (action.type) {
        case SET_SEARCH_RESULT_DATA:
            return action.data;
        case SET_LOGOUT:
            return [];
        default:
            return state
    }
}

function currentChatMan(state = {}, action) {
    switch (action.type) {
        case SET_CURRENT_CHAT_MAN_DATA:
            return action.data;
        case SET_LOGOUT:
            return {};
        default:
            return state
    }
}

function  chatLog (state = [], action) {
    let user=null;
    function showdate(logs) {
        let lastLog = '';
        let lastChatDate = '';
        let unread = 0;
        for (let i = 0; i < logs.length; i++) {
            if (i === 0) {
                logs[i].isNew = true;
                unread = logs[i].unread === 1 ? unread + 1 : unread;
                lastLog = logs[i].text;
                lastChatDate = logs[i].date;
            } else {
                unread = logs[i].unread === 1 ? unread + 1 : unread;
                let oldDate = moment(logs[i - 1].date);
                let newDate = moment(logs[i].date);
                //与上一条聊天信息超过五分钟就标记时间
                let diff = ((newDate.diff(oldDate) / 1000) > (5 * 60)) ? true : false;
                logs[i].isNew = diff;
                if (i === logs.length - 1) {
                    lastLog = logs[i].text;
                    lastChatDate = logs[i].date;

                }
            }
        }
        return {
            logs,
            lastLog,
            lastChatDate,
            unread
        };
    }
    switch (action.type) {
        case ADD_CHAT_LOG: //增加
            const {
                id,
                data,                
            } = action.data;
            user= action.user;
            let isExist=false;
            for (let i in state) {
                if (id === state[i].chatMan.id && state[i].logType == action.logType) {
                    isExist=true;
                    if(state[i].log.some(item=>item.id==data.id)){
                        return state;//防止重复添加
                    }
                    state[i].log.push(data);
                    let {
                        logs,
                        lastChatDate,
                        lastLog,      
                        unread
                    } = showdate(state[i].log);
                    state[i].log = logs;
                    state[i].lastChatDate = lastChatDate;
                    state[i].lastLog = lastLog;
                    state[i].unread = unread;
                    state[i].level = state[i].level === 10 ? 10 : 3; //最新的消息提升为等级3
                }
            }
            if(!isExist){
                let temp={
                    log:[data],
                    unread,
                    chatMan:action.chatMan
                };
                let {
                    logs,
                    lastChatDate,
                    lastLog,
                    unread
                } = showdate(temp.log, temp.unread);
                temp.log = logs;
                temp.lastChatDate = lastChatDate;
                temp.lastLog = lastLog;
                temp.unread = unread;
                temp.level = unread?3:2;
                temp.logType=action.logType
                state.push(temp)
            }
            state = state.sort((a, b) => {
                return b.level - a.level;
            })
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state];
        case ADD_PREV_CHAT_LOG:
        user= action.user;
            for (let i in state) {
                if (action.id === state[i].chatMan.id && state[i].logType == action.logType) {
                    state[i].log = [...(action.data.reverse()), ...state[i].log];
                    let {
                        logs,
                        lastChatDate,
                        lastLog
                    } = showdate(state[i].log, state[i].unread);
                    state[i].log = logs;
                }
            }
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state];
        case SET_PUSH_LOGS:
        user= action.user;
            //读取数据库未读聊天记录
                for(let i=0;i<state.length;i++){
                    for(let j=0;j<action.data.length;j++){
                        if(state[i].chatMan.id==action.data[j].chatMan.id && action.logType==state[i].logType){
                            state[i].log=[...state[i].log,...action.data[j].log];
                            action.data.splice(j,1)
                            break;
                        }
                    }
                }
                state=[...state,...action.data];
                state=state.map(item=>{
                    let {
                        logs,
                        lastChatDate,
                        lastLog,
                        unread
                    } = showdate(item.log);
                    item.log = logs;
                    item.lastChatDate = lastChatDate;
                    item.lastLog = lastLog;
                    item.unread = unread;
                    item.level = item.level
                                ?item.level >2 ? item.level : 3//最新的消息提升为等级3
                                :1;
                    return item;
                })
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state];
        case SET_CHAT_LOG:
        user= action.user;
            //从本地读取的聊天记录
            if(!action.data.length) return state;
            return action.data;
        case SET_UNREAR:
            //清除未读信息提示
            user= action.user;
            for (let i in state) {
                if (!state[i]) return [...state];
                if ((action.id === state[i].chatMan.id && action.logType==state[i].logType)) {
                    state[i].unread = 0;
                    state[i].log=state[i].log.map(item=>{
                        item.unread=0;
                        return item;
                    })
                }
            }
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state];
        case SET_LOG_LEVEL:
            //提高优先级排序，置顶
            user= action.user;
            for (let i in state) {
                if(action.id===state[i].chatMan.id && action.logType==state[i].logType){
                    state[i].level = 10;
                }else{
                    if(state[i].level ==10){
                        state[i].level=9
                    }
                }
            }
            
            state = state.sort((a, b) => {
                return b.level - a.level;
            })
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state];
        case DELETE_CONVERSATION:
            //删除会话
            user= action.user;
            for (let i in state) {
                if(action.id===state[i].chatMan.id && action.logType==state[i].logType){
                    state[i].level = 0;
                }
            }
            
            state = state.sort((a, b) => {
                return b.level - a.level;
            })
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state];
        case DELETE_LOG:
            //删除单条信息
            user= action.user;
            for (let i in state) {
                if ((action.rid === state[i].chatMan.id && action.logType =='private')) {
                    for (let j in state[i].log) {
                        if (action.id == state[i].log[j].id) {
                            state[i].log.splice(j, 1);
                        }
                    }
                    let {
                        logs,
                        lastLog,
                        lastChatDate,
                        unread
                    } = showdate(state[i].log);
                    state[i].log = logs;
                    state[i].lastLog = lastLog;
                    state[i].lastChatDate = lastChatDate;
                }else if((action.rid === state[i].chatMan.id && action.logType =='group')){
                    for (let j in state[i].log) {
                        if (action.id == state[i].log[j].id) {
                            state[i].log.splice(j, 1);
                        }
                    }
                    let {
                        logs,
                        lastLog,
                        lastChatDate,
                        unread
                    } = showdate(state[i].log);
                    state[i].log = logs;
                    state[i].lastLog = lastLog;
                    state[i].lastChatDate = lastChatDate;
                }
            }
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state]
        case DELETE_LOGS:
            //删除某人全部的聊天记录
            user= action.user;
            for (let i in state) {
                if ((action.id === state[i].chatMan.id && action.logType==state[i].logType)) {
                   state.splice(i,1);
                }
            }
            GlobalStorage.save({
                key:`${user}allLogs`,
                data:state
            })
            return [...state];
        case DELETE_ALL_LOGS:
            return [];
        case SET_LOGOUT:
            return [];
        default:
            return state
    }
}

function mouseLocation(state = {}, action) {
    switch (action.type) {
        case SET_MOUSE_LOCATION:
            state.x = action.x;
            state.y = action.y;
            return { ...state
            };
        case SET_LOGOUT:
            return {};
        default:
            return state;
    }
}

function currentMenubar(state = null, action) {
    switch (action.type) {
        case SET_CURRENT_MENU:
            return action.data;
        case SET_LOGOUT:
            return null;
        default:
            return state;
    }
}

function menubarVisible(state = false, action) {
    switch (action.type) {
        case SET_MENU_VISIBLE:
            return action.data;
        case SET_LOGOUT:
            return false;
        default:
            return state;
    }
}

function linkmanListData(state = [], action) {
    switch (action.type) {
        case SET_LINKMAN_LIST:
            GlobalStorage.save({
                key:`${action.user}linkman`,
                data:action.data
            })
            return action.data;
        case SET_DELETE_FRIEND:
            for (let i in state) {
                if (state[i].id == action.id) {
                    state.splice(i, 1)
                }
            }
            GlobalStorage.save({
                key:`${action.user}linkman`,
                data:state
            })
            return [...state];
        case SET_ADD_FRIEND:
            if (!state) state = [];
            let isExist=state.some(item=>item.id==action.data.id);
            if(isExist) return state;
            state.push(action.data);
            GlobalStorage.save({
                key:`${action.user}linkman`,
                data:state
            })
            return [...state];
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}


function groupListData(state = [], action) {
    switch (action.type) {
        case SET_GROUP_LIST:
            action.data=action.data.map(item=>{
                item.linkmanList=Array.isArray(item.linkmanList)?item.linkmanList:JSON.parse(item.linkmanList);
                item.all_linkman=Array.isArray(item.all_linkman)?item.all_linkman:JSON.parse(item.all_linkman);
                return item;
            })
            GlobalStorage.save({
                key:`${action.user}group`,
                data:action.data
            })
            return action.data;
        case SET_DELETE_GROUP:
            for (let i = 0; i < state.length; i++) {
                if (state[i].id == action.gid) {
                    state.splice(i, 1)
                }
            }
            return [...state];
        case SET_ADD_GROUP:
            if (!state) state = [];
                action.data.linkmanList=JSON.parse(action.data.linkmanList);
                action.data.all_linkman=JSON.parse(action.data.all_linkman);
            state.push(action.data);
            GlobalStorage.save({
                key:`${action.user}group`,
                data:state
            })
            return [...state];
        case ADD_GROUP_MEMBER:
            for (let i in state) {
                if (state[i].id == action.gid) {
                    let temp=action.member.filter(item=>state[i].member.every(child=>item.id!=child.id))
                        state[i].member = [ ...state[i].member,...temp];
                    let addId=(action.member.map(item=>item.id).filter(item=>state[i].linkmanList.indexOf(item)==-1))
                        state[i].linkmanList =[...state[i].linkmanList ,...addId];
                    let addAllId=(action.member.map(item=>item.id).filter(item=>state[i].all_linkman.indexOf(item)==-1))
                        state[i].all_linkman =[...state[i].all_linkman ,...addAllId];
                    break;
                }
            }
            GlobalStorage.save({
                key:`${action.user}group`,
                data:state
            })
            return [...state];
            case DELETE_GROUP_MEMBER:
            for (let i in state) {
                for (let j = 0; j < state[i].member.length; j++) {
                    if (action.id == state[i].member[j].id) {
                        state[i].linkmanList=state[i].linkmanList.filter(item=>item !=action.id)
                        break;
                    }
                }
            }
            GlobalStorage.save({
                key:`${action.user}group`,
                data:state
            })
            return [...state];
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}

function uploadFlagData(state = false, action) {
    switch (action.type) {
        case SET_UPLOAD_FLAG:
            return action.flag;
        case SET_LOGOUT:
            return false;
        default:
            return state;
    }
}

function uploadResultData(state = [], action) {
    switch (action.type) {
        case SET_UPLOAD_RESULT:
            return action.data;
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}

function photoListData(state = [], action) {
    switch (action.type) {
        case SET_PHOTO_LIST:
            return [...action.data];
        case ADD_PHOTO_LIST:
            let temp = [...state, ...action.data];
            return temp;
        case UPDATE_PHOTO_LIST_REPLAY:
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.data.p_id) {
                    if (!state[i].replay) state[i].replay = [];

                    state[i].replay.push(action.data)
                }
            }
            return [...state]
        case UPDATE_PHOTO_LIST:
            let isExist = state.some(item => item.id === action.data.id);
            if (isExist) {
                for (let i = 0; i < state.length; i++) {
                    if (state[i].id === action.data.id) {
                        state[i] = action.data;
                    }
                }
            } else {
                state.push(action.data)
            }
            return [...state];
        case SET_LOVE:
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.id) {
                    if(!state[i].love){
                        state[i].love=[]
                    }else if(state[i].love && !Array.isArray(state[i].love)){
                        state[i].love=JSON.parse(state[i].love)
                    }
                    if(action.add){
                        state[i].love.push(action.name)
                    }else{
                        let index=state[i].love.indexOf(action.name)
                        if(index !=-1){
                            state[i].love.splice(index,1)
                        }
                    }
                }
            }
            return [...state];
        case ADD_PHOTO_ITEM:
            return [action.data, ...state];
        case DELETE_PHOTO:
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.id) {
                    state.splice(i, 1);
                }
            }
            return [...state];
        case DELETE_PHOTO_REPLAY:
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.pid) {
                    for (let j = 0; j < state[i].replay.length; j++) {
                        if (action.id == state[i]['replay'][j].id) {
                            state[i]['replay'].splice(j, 1);
                        }
                    }
                }
            }
            return [...state];
        case SET_IS_RECEIVE_REPLAY:
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.data.p_id) {
                    if(!state[i]['replay']) state[i]['replay']=[];
                    state[i]['replay'].push(action.data)
                }
            }
            return [...state];
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}

function photoUnreadData(state = [], action) {
    switch (action.type) {
        case SET_PHOTO_UNRERAD_NUM:
            return action.data;
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}

function uploadPhotoData(state = null, action) {
    switch (action.type) {
        case SET_UPLOAD_PHOTO_DATA:
            return action.data;
        case SET_LOGOUT:
            return null;
        default:
            return state;
    }
}

function friendRequest(state = [], action) {
    switch (action.type) {
        case SET_FRIEND_REQUEST_DATA:
            return action.data;
        case DELETE_FRIEND_REQUEST:
            for (let i in state) {
                if (state[i].fid == action.id) {
                    state.splice(i, 1)
                }
            }
            return [...state];
        case SET_ADD_FRIEND_REQUEST:
            state.push(action.data);
            return [...state];
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}

function historyData(state = null, action) {
    switch (action.type) {
        case SET_HISTORY:
            return action.history;
        case SET_LOGOUT:
            return null;
        default:
            return state;
    }
}

function locationData(state = null, action) {
    switch (action.type) {
        case SET_LOCATION:
            return action.location;
        case SET_LOGOUT:
            return null;
        default:
            return state;
    }
}

function isReceiveMes(state = false, action) {
    switch (action.type) {
        case SET_IS_RECEIVE_MES:
            return action.flag;
        case SET_LOGOUT:
            return false;
        default:
            return state;
    }
}


//admin
function userListData(state = [], action) {
    switch (action.type) {
        case SET_USER_LIST_DATA:
            return action.data;
        case ADD_USER_LIST_DATA:
            return [...state, ...action.data]
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}

function userCountData(state = 0, action) {
    switch (action.type) {
        case SET_USER_COUNT_DATA:
            return action.data;
        case SET_LOGOUT:
            return 0;
        default:
            return state;
    }
}

function notificationDetailData(state = null, action) {
    switch (action.type) {
        case SET_NOTIFICATION_DETAIL:
            return action.data;
        case SET_LOGOUT:
            return null;
        default:
            return state;
    }
}

function notificationData(state = [], action) {
    switch (action.type) {
        case SET_NOTIFICATION_DATA:
            return [...(action.data.reverse()),...state];
        case SET_LOGOUT:
            return [];
        default:
            return state;
    }
}

function roomId(state = null, action) {
    switch (action.type) {
        case SET_ROOM_ID:
            return action.id;
        case SET_LOGOUT:
            return null;
        default:
            return state;
    }
}

let desks=new Array(8).fill({}).map((item,index)=>({
    id:index,
    text:'坐下',
    desker:null,

}));
function deskList(state = desks, action) {
    switch (action.type) {
        case SET_DESK_LIST:
            return action.data;
        case SET_LOGOUT:
            return desks;
        default:
            return state;
    }
}

const reduceData = combineReducers({
    navigator,
    bottomNavigator,
    localStorageData,
    soundOpen,
    groupSoundOpen,
    searchResultData,
    currentChatMan,
    chatLog,
    mouseLocation,
    currentMenubar,
    linkmanListData,
    uploadFlagData,
    uploadResultData,
    uploadPhotoData,
    photoListData,
    friendRequest,
    historyData,
    locationData,
    photoUnreadData,
    groupListData,
    menubarVisible,
    isReceiveMes, //是否接收到新消息
    //admin
    userListData,
    userCountData,
    notificationDetailData,
    notificationData,
    //你画我猜
    roomId,
    deskList,
})

export default reduceData