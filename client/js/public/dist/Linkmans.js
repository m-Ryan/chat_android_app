import React from 'react';
import {connect} from 'react-redux'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import doamin from '../../other/domain';
import {Button, SearchBar, Icon , Accordion, List} from 'antd-mobile';
import {setCurrentChatMan} from '../../other/actions';
const {width, height} = Dimensions.get('window');
import HeaderBar from '../component/HeaderBar';
class Action extends React.Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({navigation}) => ({
        header: null
    });
    chatHandle = (chatMan) => {
        let type=chatMan.leader?'GroupChat':'ChatPage';
        this
            .props
            .dispatch(setCurrentChatMan(chatMan))
        this
            .props
            .navigator
            .navigate(type, {chatMan: chatMan})
    }

    render() {
        const {localStorageData, linkmanListData, groupListData} = this.props;
        const groupListRender = groupListData.length
            ? groupListData.map((item, index) => {
                return (
                    <TouchableOpacity
                        onPress={()=>this.chatHandle(item)}
                        style={styles.linkmanItem}
                        key={index}>
                        <View style={styles.linkmanItem}>
                            <Image
                                source={{
                                uri: doamin + item.user_faceSrc
                            }}
                                style={styles.avator}/>
                            <Text style={styles.name}>{item.user_name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
            : null;
        const linkmanRender = linkmanListData.length
            ? linkmanListData.map((item, index) => {
                return (
                    <TouchableOpacity
                        onPress={()=>this.chatHandle(item)}
                        style={styles.linkmanItem}
                        key={index}>
                        <View style={styles.linkmanItem}>
                            <Image
                                source={{
                                uri: doamin + item.user_faceSrc
                            }}
                                style={styles.avator}/>
                            <Text style={styles.name}>{item.user_name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
            : null;
        return (
            <View style={styles.flex}>  
                <HeaderBar />
                <View style={styles.list}>
                    <ScrollView>
                        <Accordion openAnimation={{}} defaultActiveKey={'0'}>
                            <Accordion.Panel header={`好友  (${linkmanListData.length})`} key={'0'}>
                                <List>
                                    {linkmanRender}
                                </List>
                            </Accordion.Panel>
                        <Accordion.Panel header={`群组 (${groupListData.length})`} key={'1'}>
                            <List>
                                {groupListRender}
                            </List>
                        </Accordion.Panel>
                    </Accordion>
                        
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    list:{
        flex:1,
        marginTop:50,
    },
    linkmanItem: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    avator: {
        height: 40,
        width: 40,
        marginRight: 10
    },
    name: {
        color: '#333'
    },
    title: {
        fontSize: 14,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    extraMenu:{
        width:width,
        height:height,
        position:'absolute',
        zIndex:999,
        backgroundColor:'rgba(0,0,0,0.1)',
    },
    extraMenuItem:{
        backgroundColor:'#fff',
        width:120,
        alignSelf:'flex-end',    
        justifyContent:'center',
        alignItems:'center',
    },
    extraMenuText:{
        color:'#333',
        paddingVertical:10,
    },
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(Action)