import React from 'react';
import {connect} from 'react-redux'
import {Component, StyleSheet, Text, View, ScrollView ,TouchableOpacity} from 'react-native';
import {Button, SearchBar ,Icon , List, Switch ,ActionSheet} from 'antd-mobile';
import { NavigationActions } from 'react-navigation';
import {setSoundOpen ,setGroupSoundOpen ,deleteAllLogs ,setLogout ,setLocalStorageData} from '../../other/actions';
class Action extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header: <View style={styles.header}>
                    <View style={styles.middle}>
                        <Text style={styles.text}>设置</Text>
                    </View>
                </View>
    });
    constructor(props) {
        super(props);
    }

    exitHandle=()=>{
        const BUTTONS = ['确定', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '您确定要退出？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                GlobalStorage.remove({
                    key: 'user'
                });
                this.props.dispatch(setLogout())
                let resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Login'}),
                    ]
                  })
                  this.props.navigation.dispatch(resetAction)
            }
          });
    }
    soundSwitch=(flag)=>{
        this.props.dispatch(setSoundOpen(flag))
    }
    groupSoundSwitch=(flag)=>{
        this.props.dispatch(setGroupSoundOpen(flag))
    }
    deleteAllLog=()=>{
        const BUTTONS = ['确定', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            title: '您确定要删除所有聊天记录？',
            maskClosable: true,
            'data-seed': 'logId',
          },
          (buttonIndex) => {
            if(buttonIndex===0){
                  GlobalStorage.remove({
                    key: this.props.localStorageData.id+'allLogs'
                 });
                 this.props.dispatch(deleteAllLogs(this.props.localStorageData.id))
            }
          });
    }
    readArticle=()=>{
         this.props.navigation.navigate('Article')
    }
    readCollection=()=>{
        this.props.navigation.navigate('Collection',{
            user:this.props.localStorageData
        })
   }
   drawingHandle=()=>{
    this.props.navigation.navigate('DrawingEntry')
   }
    render() {
        const {navigator,soundOpen,groupSoundOpen}=this.props;
        return (
            <View style={styles.flex}>
                <ScrollView>
                    {/*<TouchableOpacity  style={styles.item} onPress={()=>navigator.navigate('Action')}>
                        <Icon type={"\uE697"} size={24}/>
                        <Text style={styles.itemText}>动态</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.item}>
                        <Icon type={"\uE674"} size={24}/>
                        <Text style={styles.itemText}>相册</Text>
        </TouchableOpacity>*/}
                    <TouchableOpacity  style={styles.item} onPress={this.drawingHandle}>
                        <Icon type={"\uE692"} size={24}/>
                        <Text style={styles.itemText}>你画我猜</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.item} onPress={this.readArticle}>
                        <Icon type={"\uE913"} size={24}/>
                        <Text style={styles.itemText}>精选文章</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.item} onPress={this.readCollection}>
                        <Icon type={"\uE662"} size={24}/>
                        <Text style={styles.itemText}>收藏</Text>
                    </TouchableOpacity>

                    <List
                    renderHeader={() => '声音选项'}
                    style={{marginBottom:20}}
                  >
                    <List.Item
                      extra={<Switch
                        checked={soundOpen}
                        onChange={(e)=>this.soundSwitch(e)}
                      />}
                    >新消息通知</List.Item>
                    <List.Item
                    extra={<Switch
                      checked={groupSoundOpen}
                      onChange={(e)=>this.groupSoundSwitch(e)}
                    />}
                  >群聊通知</List.Item>
                    </List>
                    
                    <TouchableOpacity  style={styles.item} onPress={this.deleteAllLog}>
                        <Icon type={"\uE69F"} size={24}/>
                        <Text style={styles.itemText}>清空所有聊天记录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.item} onPress={()=>this.props.navigation.navigate('About')}>
                        <Icon type={"\uE66D"} size={24}/>
                        <Text style={styles.itemText}>关于</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.item} onPress={()=>this.props.navigation.navigate('FeedBack')}>
                        <Icon type={"\uE90F"} size={24}/>
                        <Text style={styles.itemText}>反馈</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.item} onPress={this.exitHandle}>
                        <Icon type={"\uE65A"} size={24}/>
                        <Text style={styles.itemText}>退出</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}


const styles=StyleSheet.create({
    flex:{
        flex:1,
        
    },
    header: {
        backgroundColor: '#108ee9',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingHorizontal:20
    },
    text: {
        color: '#fff',
        fontSize: 18
    },
    headerBtn: {
        paddingHorizontal: 20
    },
    headerIcon: {
        fontSize: 20,
        color: '#fff'
    },
    item:{
        height:60,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:20,
        borderBottomWidth:0.5,
        borderColor:'#ccc',
        backgroundColor:'#fff'
    },
    itemText:{
        color:'#333',
        fontSize:18,
        marginLeft:20
    },
})


function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)