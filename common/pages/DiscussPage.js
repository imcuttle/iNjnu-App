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
  TextInput,
  Image
} from 'react-native';
import BottomBar from '../components/BottomBar'
import DiscussList from '../components/DiscussList'

import NavigationBar from 'react-native-navbar';
import ModalPicker from 'react-native-modal-picker'



export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  state={
    
  }

  render() {
    const {navigator, setProps, discussProps} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '讨论', tintColor: 'red', style: {fontSize: 20}}}
          statusBar={{hidden: false}}
          style={{height: 45, flex: null}}
          rightButton={{
            title: '发帖',
            handler: () => {
              navigator.push({
                active: 'deploy'
              })
            }
          }}
        />
        <View style={styles.mainContent}>
          <DiscussList navigator={navigator} setProps={setProps} {...discussProps} />
        </View>
        <BottomBar style={{flex: 1}} active={'discuss'} navigator={navigator}/>
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
