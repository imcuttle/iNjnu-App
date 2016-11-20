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
import NavigationBar from 'react-native-navbar';
import Spinner from 'react-native-loading-spinner-overlay';

export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  state={
    
  }

  render() {
    const {navigator, route} = this.props;
    return (
      <View>
        <NavigationBar
          title={{title: route.title, tintColor: 'red', style: {fontSize: 20}}}
          style={{height: 45, flex: null}}
        />
        <View style={styles.container}>
          <Spinner visible={true} color='red' />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6'
  },
})