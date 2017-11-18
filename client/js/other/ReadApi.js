
/**
 * 接口url
 * 基于 http://read.maocanhua.cn
 */



/**
 * article_id 文章id
 * article_title 标题
 * article_date 日期
 * article_writer 作者
 * article_source 来源
 * article_content 内容
 * article_img 图片
 * article_type 类型/中文
 * article_url_typr 类型/拼音
 * article_summary 摘要
 * article_cutImg 缩略图
 *  
 */
const PATH_NAME='http://read.maocanhua.cn';
export default class Query{
   static getPathName() {
       return PATH_NAME;
   }
  
   //获取列表
   static getListItem(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
        fetch(`${PATH_NAME}/queryList?type=${options.type}&beginNum=${options.beginNum}&num=${options.num}&sortType=${options.sortType}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
                .then(json => {
                   return next(json);
                })
                .catch(err=>err)
    }
    //获取文章
    static getArticleDetail(options){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
        return fetch(`${PATH_NAME}/queryArticle?type=${options.type}&articleId=${options.id}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
    }
  
    //加入或删除收藏
    static collect(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
         fetch(`${PATH_NAME}/collect?id=${options.id}&article_url_type=${options.article_url_type}&article_id=${options.article_id}&action=${options.action}&user_id=${options.user_id}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
                .then(json => {
                   return next(json);
                })
                .catch(err=>err)
    }

     //查看当前当前文章是否被收藏
    static getArticleCollection(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
        return fetch(`${PATH_NAME}/getArticleCollection?user_id=${options.user_id}&article_url_type=${options.article_url_type}&article_id=${options.article_id}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
    }
    
    //查看当前用户所有的收藏
    static getUserCollection(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
        return fetch(`${PATH_NAME}/getUserCollection?user_id=${options.user_id}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
    }

    //更新用户资料
    static updateUser(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
         fetch(`${PATH_NAME}/updateUser?id=${options.id}&key=${options.key}&value=${options.value}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
                .then(json => {
                   return next(json);
                })
                .catch(err=>err)
    }

    //搜索文章
    static toSearch(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
         fetch(`${PATH_NAME}/toSearch?title=${options.title}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
                .then(json => {
                   return next(json);
                })
                .catch(err=>err)
    }

    //根据排名从全部文章中搜索
    static getRank(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
         fetch(`${PATH_NAME}/getRank?order=${options.order}&num=${options.num}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
                .then(json => {
                   return next(json);
                })
                .catch(err=>err)
    }

    //随机获取文章
    static guessLove(options,next){
        options.fetchOptions=options.fetchOptions||{method: 'GET'};
         fetch(`${PATH_NAME}/guessLove?num=${options.num}`, options.fetchOptions)
                .then(
                    res =>res.json()
                )
                .then(json => {
                   return next(json);
                })
                .catch(err=>err)
    }
}


