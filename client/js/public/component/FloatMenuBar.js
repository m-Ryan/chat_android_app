import React from 'react';
import { connect } from 'react-redux'
import {
  StyleSheet,  
  Text,  
  View,  
  ScrollView
} from 'react-native';
import { Button ,SearchBar} from 'antd-mobile';
 class FloatMenuBar extends React.Component {
   
    constructor(props){
      super(props);
    }
    componentDidMount(){
      
     }
    render() { 
       const { component ,visible ,inLeft,uid,location} = this.props;
       const renderMenu =true
                    ?<View style={styles.menu}>{component}</View>
                    :null;
       return (
           <View style={styles.flex}>
                {renderMenu}
           </View>     
       )
    }
}

const styles=StyleSheet.create({
    flex:{
        flex:1,
        overflow:'visible'
    },
    menu:{
        
        zIndex:10000
    }
})

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(FloatMenuBar)