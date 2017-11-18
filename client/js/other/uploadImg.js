
import moment from 'moment';
import Service from './Service';
import {ImageStore} from 'react-native';
export default async function  uploadImage(url,name){  
    let data =await new Promise((resolve,reject)=>{
        ImageStore.getBase64ForTag(url,data=>resolve(data),err=>reject(err));
    })
    let uploadOptions={
        data,
        type:'jpg',
        uploadStatus:true,
        name:name+moment().format('YYYYMMsshh'),
        native:true
    }
    let imgurl = await Service.uploadImg(uploadOptions);
    return imgurl;  
  }  
