import React from 'react';
import {connect} from 'react-redux'
import {Component, StyleSheet, Text, View, ScrollView ,TouchableOpacity,Image} from 'react-native';
import {Button, SearchBar ,Icon , List, Switch} from 'antd-mobile';
import {setMainContainerType ,setCurrentChatMan ,setUploadFlag ,setUploadResult ,setLocalStorageData  ,addPhotoList,setPhotoList ,addPhotoitem ,setUploadPhotoData ,setIsReceiveReplay} from '../../other/actions';
import Service from '../../other/Service';
import ActionItem from '../component/ActionItem';
import domain from '../../other/domain';
const initState={
    visible: false,
    imgList:[],
    text:'',
    uploadImgNum:0,//即将上传图片的数量
    fetched:false,
    beginNum:0,
    isLoading:false,
    num:10,
    isNewReplay:false,
    isBottom:false
}
class Action extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title:'动态'
    });
    constructor(props) {
        super(props);
        this.state = initState;
        this.state.isBottom=false;
    }
    componentWillMount(){
        if(this.props.photoListData.length){
            this.setState({
                fetched:true,
                isLoading:false
             })
             return;
        };
        this.props.dispatch(setPhotoList([]));
        this.loadPhotoList();
    }
    componentWillReceiveProps(nextProps){
        //3.设置图片上传结果
        if(!this.state.text && nextProps.uploadPhotoData){
            this.setState({
                text:nextProps.uploadPhotoData
            })
        }
        if(nextProps.uploadResultData.length){
            this.setState({
                imgList:nextProps.uploadResultData,
            },()=>{
                nextProps.dispatch(setUploadResult([]));
                this.submitInfo();
            })
        }
    }
    //滚动到底部后懒加载
    scrollBottomHandle=(container)=>{
        let scrollTop = container.scrollTop;
        let scrollHeight=container.scrollHeight;
        let clientHeight=container.clientHeight;
        if(scrollTop+clientHeight>(scrollHeight-5)){
            if(this.state.isBottom || this.state.isLoading) return;
            this.loadPhotoList();
        }
    }

    loadPhotoList=()=>{
        const {beginNum ,num} = this.state;
        let options={
            id:this.props.localStorageData.id,
            all:true,
            beginNum,
            num,
        }
        Service.getPhotoList(options)
               .then(result=>{
                   if(result.length===0){
                        this.setState({
                            fetched:true,
                            isLoading:false,
                            isBottom:true,
                         })
                        return;
                   }else if(result.length<num){
                        this.setState({
                            isBottom:true,
                        })
                   }
                   this.setState({
                       fetched:true,
                       beginNum:beginNum+num,
                       isLoading:false
                    })
                   this.props.dispatch(addPhotoList(result));
               })
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
      }
      handleCancel = (e) => {
        this.setState({
          visible: false,
        });
      }

    submitInfo=()=>{
        const {localStorageData ,photoListData ,uploadPhotoData} = this.props;
        const {imgList ,text} = this.state;
        let options={
            text:text,
            imgList,
            id:localStorageData.id,
            date:moment(),
        }
        this.setState({fetched:false})
        Service.addPhotoList(options)
            .then(
                result=>{
                    if(result){
                        this.setState({fetched:true})
                        this.props.dispatch(addPhotoitem(result));
                    }else{
                        message.warn('提交信息失败')
                    }
                }
            )
    }
    callback=(text)=>{
        this.props.dispatch(setUploadPhotoData(text))
        this.setState({
            visible: false,
            text,
        },()=>{
            if(this.state.uploadImgNum){
                this.props.dispatch(setUploadFlag(true))
            }else{
                this.submitInfo();
            }
        });
    }
    uploadCallback=(num)=>{
        this.setState({uploadImgNum:num})
    }
    flushHandle=()=>{
        this.props.dispatch(setPhotoList([]));
        this.setState(initState,()=>{
            this.loadPhotoList();
        })
    }
    relativeHandle=()=>{
        Service.deletePhotoUnread(this.props.localStorageData.id) 
        this.props.dispatch(setMainContainerType(8))
    }
    render() {
        const {dispatch ,height ,photoListData ,localStorageData ,uploadPhotoData ,photoUnreadData}=this.props;
        const {  fetched, isLoading ,isBottom} =this.state; 
        const flushBtn= isLoading? <Icon type={"\uE64D"} />:<Icon type={"\uE616"} />;
        const loading=fetched?'':<View><Icon type={"\uE64D"} /></View>;
        const bottomRender=fetched && isBottom?<Text>已经到达底部了</Text>:<Icon type={"\uE616"} />;
        let message=photoListData.length
                    ?photoListData.map((item,index)=><ActionItem data={item} key={index}/>
                    ):null;
        return (
            <View style={styles.flex}>
                <ScrollView>
                    <View style={styles.showHeader}>
                        <Image source={{uri:domain+localStorageData.user_faceSrc}} style={styles.showPic}/>
                        <View style={styles.showInfo}><Text style={styles.showText}>{localStorageData.user_name}</Text></View>
                    </View>
                    {message}
                </ScrollView>
            </View>
        )
    }
}


const styles=StyleSheet.create({
    flex:{
        flex:1,
        backgroundColor:'#fff'
        
    },
    header: {
        backgroundColor: '#108ee9',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingHorizontal:20
    },
    showHeader:{
        height:250,
        backgroundColor:'green'
    },
    showPic:{
        flex:1
    },
    showInfo:{
        position:'absolute',
        bottom:20,
        right:20,
        zIndex:9999
    },
    showText:{
        fontSize:18,
        fontWeight:'bold'
    }
})


function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)