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
      <View style={{flex: 1}}>
        {/*<NavigationBar
          title={{title: 'iNjnu', tintColor: 'red', style: {fontSize: 20}}}
          style={{height: 45, flex: null}}
        />*/}
        <View style={styles.container}>
          <View style={{position: 'absolute', left: 0, right: 0, top: 60, zIndex: 3}}>
          <Text style={{color: 'white', textAlign: 'center', fontSize: 25}}>i Njnu.</Text>
          </View>
          <Image style={{flex: 1}} resizeMode="cover" source={{uri: 'http://down1.cnmo.com/cnmo-app/a201/jianbiansecai.jpg'}}/>
          {<Spinner visible={true} color='#3e9ce9' />}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(55, 71, 79)'
  },
})