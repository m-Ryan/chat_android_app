import React from 'react';
import {connect} from 'react-redux'
import {
    Component,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {Button, Icon} from 'antd-mobile';

class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            menuVisible:false
        }
    }
    addFriend=()=>{
        this.setState({menuVisible:false})
        this
        .props
        .navigator
        .navigate('SerachFriend')
    }
    createGroup=()=>{
        this.setState({menuVisible:false})
        this
        .props
        .navigator
        .navigate('CreateGroup')
    }

    showMenu = () => {
        this.setState({menuVisible:!this.state.menuVisible})
    }

    render() {
        const {menuVisible}=this.state;
        const menuRender=menuVisible
        ?<View style={styles.extraMenu}>
            <TouchableWithoutFeedback style={styles.extraMenu} onPress={this.showMenu}>
            <View style={styles.extraMenu}>
                <TouchableOpacity onPress={this.addFriend} style={styles.extraMenuItem}><Text  style={styles.extraMenuText}>添加朋友</Text></TouchableOpacity>
                <TouchableOpacity onPress={this.createGroup}  style={styles.extraMenuItem}><Text  style={styles.extraMenuText}>新建群聊</Text></TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
        </View>
        :null;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.text}>轻聊</Text>
                    <TouchableOpacity onPress={this.showMenu} style={styles.extraBtn}>
                        <Icon type={"\uE627"} color='#fff' style={styles.headerIcon}/>
                    </TouchableOpacity>

                </View>   
                {menuRender}
            </View>
        )
    }
}
/**
 *
 */
const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container:{
        width,
        height,
        position:'absolute'
    },
    header: {
        backgroundColor: '#108ee9',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
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
export default connect(mapStateToProps)(HeaderBar)