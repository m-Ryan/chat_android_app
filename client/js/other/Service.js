'use strict'
const domain='http://chat.maocanhua.cn';

const postHeader=(options)=>({ 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method: 'POST',
        body:JSON.stringify(options)
    })

export default class Service{

   /**登录
    * options 传入的对象，需要属性email，password
    * 返回 用户的信息
    */
   static getLogin(options) {
        return fetch(`${domain}/login`, { 
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body:JSON.stringify(options)
        })
           .then(
               res => res.json()
           )
   }
   /**注册
   * options 传入的对象，需要属性regUserEmail，regUserPassword，regUserName，regUserSex
   * 返回 用户的信息
   */
   static getRegister(options) {
        return fetch(`${domain}/register`, { 
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body:JSON.stringify(options)
        })
           .then(
               res => res.json()
           )
   }
   /**
    * 获取唯一标识符
    * 
   / */
   static getUniqueId(id){
        return fetch(`${domain}/getUniqueId?id=${id}`, { method: 'GET',})
            .then(
                res => res.json()
            )
    }

     /**
     * 获取头像
     * email
     */
    static getFace(email) {
        return fetch(`${domain}/getFace?email=${email}`, { method: 'GET',})
            .then(
                res => res.json()
            )
        }
   /**搜索好友
   *  传入key,email或
   * 返回 用户的信息
   */
  static getSearch(key) {
    return fetch(`${domain}/search?searchKey=${key}`, { method: 'GET',})
            .then(
                res => res.json()
            )
    }
    /**
     * 发送好友请求
     * 
     */
    static sendFriendRequest(options) {
        return fetch(`${domain}/sendFriendRequest`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }
    
    /**
     * 获取添加好友请求
     * 
     */
    static getFriendRequest(id) {
        return fetch(`${domain}/getFriendRequest?id=${id}`, { method: 'GET',})
            .then(
                res => res.json()
            )
        }

    /**同意/拒绝添加好友请求
   * options 传入的对象，需要属性user，firend
   * 返回 用户的信息
   */
  static addFriend(options) {
    return fetch(`${domain}/addFriend`,{ 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method: 'POST',
            body:JSON.stringify(options)
        })
            .then(
                res => res.json()
            )
    }
    /**
     * /
     * 
     */

    static getFriendInfo(id){
        return fetch(`${domain}/getFriendInfo?id=${id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    /**
     * 查询联系人列表
     * getLinkman
    / */
    static getLinkman(options){
        return fetch(`${domain}/getLinkman?id=${options.id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    /**
     * 更新全部个人信息
     * 
     */
    static updateInfo(options){
        return fetch(`${domain}/updateInfo`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
    }

    /*
    更新单独的信息，需要key,value,id
    */
    static updateUserInfo(options){
        return fetch(`${domain}/updateUserInfo`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
    }
    //删除好友
    static deleteFriend(options) {
        return fetch(`${domain}/deleteFriend`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }
    //上传图片
    static uploadImg(options) {
        return fetch(`${domain}/uploadImg`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }
    //写入说说/相册主题
    static addPhotoList(options) {
        return fetch(`${domain}/addPhotoList`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }
     //写入说说相册回复
     static addReplayList(options) {
        return fetch(`${domain}/addReplayList`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }   
    //写入或删除点赞的名字
    static setLove(options) {
        return fetch(`${domain}/setLove`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }   
    //获取朋友圈相册/说说
    static getPhotoList(options){
        return fetch(`${domain}/getPhotoList?id=${options.id}&all=${options.all}&num=${options.num}&beginNum=${options.beginNum}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    static getPhoto(id){
        return fetch(`${domain}/getPhoto?id=${id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    
    //获取 @ 朋友圈相册/说说
    static getPhotoUnread(id){
        return fetch(`${domain}/getPhotoUnread?id=${id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    
     //获取 @ 朋友圈相册/说说 为已读
     static deletePhotoUnread(id){
        return fetch(`${domain}/deletePhotoUnread?id=${id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    //获取 @ 朋友圈相册/说说 为已读
    static createGroup(options){
        return fetch(`${domain}/createGroup`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
            .then(
                res => res.json()
            )
    }
    
    //获取群资料
    static getGroup(id){
        return fetch(`${domain}/getGroup?id=${id}`, { method: 'GET',})
            .then(
                res => res.json()
            )
    }
    //添加群成员
    static addGroupMember(options) {
        return fetch(`${domain}/addGroupMember`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }
    
    //解散群
    static deleteGroup(gid){
        return fetch(`${domain}/deleteGroup?gid=${gid}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    //删除群成员
    static deleteMember(id,gid){
        return fetch(`${domain}/deleteMember?id=${id}&gid=${gid}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    //写入聊天记录
    static addLog(options) {
        return fetch(`${domain}/addLog`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }

     //写入群聊天记录
     static addGroupLog(options) {
        return fetch(`${domain}/addGroupLog`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
        }
    //设置聊天记录为已读
    static setRead(options){
        return fetch(`${domain}/setRead`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
    }   
    //读取该好友聊天记录（10条）
    static getAllLog(options){
        return fetch(`${domain}/getAllLog`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
    }   
    

    //加载聊天记录
    static loadChat(userId,chatManId,beginNum,num,type){
        return fetch(`${domain}/loadChat?userId=${userId}&chatManId=${chatManId}&beginNum=${beginNum}&num=${num}&type=${type}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    //删除某条聊天记录
    static deleteLog(id){
        return fetch(`${domain}/deleteLog?id=${id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    
    //删除该好友全部聊天记录
    static deleteAllLog(options){
        return fetch(`${domain}/deleteAllLog?uid=${options.uid}&rid=${options.rid}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    //设置未读信息setUnread
    static setUnread(options){
        return fetch(`${domain}/setUnread?uid=${options.uid}&rid=${options.rid}&id=${options.id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    //删除照片/说说
    static deletePhoto(id ,type){
        return fetch(`${domain}/deletePhoto?id=${id}&type=${type}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    //admin
    //查询用户的数量
    static getUserCount(){
        return fetch(`${domain}/getUserCount`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
    
    //查询多个用户的基本信息
    static getUserList(beginNum,num){
        return fetch(`${domain}/getUserList?beginNum=${beginNum}&num=${num}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    //设置推送消息
    static setNotifation(options){
        return fetch(`${domain}/setNotifation`,{ 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body:JSON.stringify(options)
            })
                .then(
                    res => res.json()
                )
    }

    //获取推送消息
    static getNotifation(beginNum,num){
        return fetch(`${domain}/getNotifation?beginNum=${beginNum}&num=${num}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    //获取推送消息
    static getNotifationById(id){
        return fetch(`${domain}/getNotifationById?id=${id}`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }

    //查询推送消息总数目
    static getNotiCount(id){
        return fetch(`${domain}/getNotiCount`, { method: 'GET',})
        .then(
            res => res.json()
        )
    }
}
