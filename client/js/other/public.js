export class Storage{
    static set(name,obj){
        localStorage[name]=JSON.stringify(obj);
    }
    static get(name){
        return localStorage[name]?JSON.parse(localStorage[name]):{}
    }
    static clear(name){
       localStorage.clear();
    }

    static setConfig(key,id,logType){
        let config=localStorage['config']?JSON.parse(localStorage['config']):{};
        let uid=id+logType;
        if(key==='minLevel'){
            if(!config.minLevel || !Array.isArray(config.minLevel)) config.minLevel=[];
            config.minLevel.push(uid)
        }else if(key==='maxLevel'){
            config.maxLevel=uid;
            for(let i in config.minLevel){
                if(config.minLevel[i]===uid){
                    config.minLevel.splice(i,1)
                }
            }
        }
        localStorage['config']=JSON.stringify(config);
    }
    static removeConfig(id,logType){
        let uid=id+logType;
        let config=localStorage['config']?JSON.parse(localStorage['config']):{};
            for(let i in config.minLevel){
                if(config.minLevel[i]===uid){
                    config.minLevel.splice(i,1)
                }
            }  
        localStorage['config']=JSON.stringify(config); 
    }
    static getConfig(id,logType){
        let uid=id+logType;
        let config=localStorage['config']?JSON.parse(localStorage['config']):{};
        for(let i in config.minLevel){
            if(config.minLevel[i]===uid){
               return 'minLevel'
            }
        }
        if(config.maxLevel==uid) return 'maxLevel';
        return 'middle';
    }
}
