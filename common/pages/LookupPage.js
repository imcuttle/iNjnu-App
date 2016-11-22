import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import BottomBar from '../components/BottomBar'
import Grid from '../components/LookupGrid'
import NavigationBar from 'react-native-navbar';
import res from '../res'

export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  state={
    
  }

  render() {
    const {navigator, setParentState} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '查查', tintColor: 'red', style: {fontSize: 20}}}
          style={{height: 45, flex: null}}
        />
        
          <View style={styles.mainContent}>
            <Grid 
              ds={[{
                name: '查成绩',
                img: {uri: res.stuIcon},
                onPress: (data)=>{
                  navigator.push({
                    active: 'lookupScore'
                  })
                }
              }, {
                name: '撞脸秀',
                img: {uri: res.faceIcon},
                onPress: (data)=>{
                  navigator.push({
                    active: 'lookupFace'
                  })
                }
              }]}
              style={{flex: 1}}></Grid>
          </View>
          <BottomBar style={{flex: 1}} navigator={navigator} active={'lookup'} setParentState={setParentState}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    backgroundColor: 'red',
  },
  
  mainContent: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    alignItems: 'stretch',
    marginBottom: 50
  },
});
