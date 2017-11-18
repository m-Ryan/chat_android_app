import React from 'react';
import {
    Component,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {Button, SearchBar, Icon, ActionSheet, Toast} from 'antd-mobile';
import RNFetchBlob from 'react-native-fetch-blob';
import ImageViewer from 'react-native-image-zoom-viewer';
export default class About extends React.Component {
    static navigationOptions = ({navigation}) => ({header: null});
    constructor(props) {
        super(props);
        this.state = {
            menuVisible: false
        }
    }
    showMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible
        })
    }
    savePic = (url) => {
        this.setState({
            menuVisible: false
        })
        RNFetchBlob
            .config({
            padth: RNFetchBlob.fs.dirs.DocumentDir + url,
            fileCache: true
        })
            .fetch('GET', url, {
                //some headers ..
            })
            .then((res) => {
                // the temp file path
                Toast.success('图片保存在 ' + res.path())
            })
    }
    callback=(cb)=>{
        this.props.navigation.goBack();
        cb();
    }
    render() {
        const {menuVisible} = this.state;
        const url = this.props.navigation.state.params.url;
        const callback=this.props.navigation.state.params.callback;
        const imgRender = url
            ? <Image
                    source={{
                    uri: url
                }}
                    style={styles.img}/>
            : <Text>图片加载失败</Text>;
        const menuRender = menuVisible
            ? <View style={styles.extraMenu}>
                    <TouchableWithoutFeedback style={styles.extraMenu} onPress={this.showMenu}>
                        <View style={styles.extraMenu}>
                            <TouchableOpacity onPress={()=>this.callback(callback)} style={styles.extraMenuItem}>
                                <Text style={styles.extraMenuText}>删除</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.savePic(url)}
                                style={styles.extraMenuItem}>
                                <Text style={styles.extraMenuText}>保存图片</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            : null;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                   <View style={{flexDirection:'row'}}>
                   <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{
                        flexDirection: 'row'
                    }}>
                        <Icon type={"\uE61C"} color='#fff' style={styles.headerIcon}/>
                        <Text>　</Text>
                    </TouchableOpacity>
               <Text style={styles.text}>图片详情</Text>
                   </View>
                    <TouchableOpacity onPress={this.showMenu} style={styles.extraBtn}>
                        <Icon type={"\uE627"} color='#fff' style={styles.headerIcon}/>
                    </TouchableOpacity>
                </View>
                <ImageViewer imageUrls={[{url}]}/>
                {menuRender}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    img: {
        flex: 1,
        width: width,
        resizeMode: 'contain',
        height: height - 100

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
    extraMenu: {
        width: width,
        height: height - 50,
        position: 'absolute',
        zIndex: 999,
        paddingTop: 50,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    extraMenuItem: {
        backgroundColor: '#fff',
        width: 120,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    extraMenuText: {
        color: '#333',
        paddingVertical: 10
    }
})
