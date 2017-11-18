import {
    StyleSheet,
    Dimensions
} from 'react-native';
const {
    width,
    height
} = Dimensions.get('window');
import htmlLog from './htmlLog';
import {
    deleteLog
} from './actions';

export default (child, item, user, dispatch,navigator) => {
        child.htmlLog = htmlLog(child.text, true, {
            fontSize: 18,
            color: '#333'
        }, 100, {
            maxWidth: width - 80,
            backgroundColor: '#fff',
            paddingVertical: 8,
            paddingHorizontal: 13,
            marginHorizontal: 15,
            alignItems: 'center',
            justifyContent: 'center'
        }, navigator, () => dispatch(deleteLog(user.id, item.chatMan.id, child.id, item.logType)))
    
    return child;
}