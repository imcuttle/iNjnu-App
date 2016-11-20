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
import List from '../components/FriendsList'
import NavigationBar from 'react-native-navbar';

export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  state={
    
  }

  render() {
    const {navigator, setProps, friendProps} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '私信', tintColor: 'red', style: {fontSize: 20}}}
          style={{height: 45, flex: null}}
        />
        <View style={styles.mainContent}>
          <List navigator={navigator} setProps={setProps} {...friendProps}></List>
        </View>
        <BottomBar active="friend" navigator={navigator}/>
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
