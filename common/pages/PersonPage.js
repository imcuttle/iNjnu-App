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
import Information from '../components/Information'
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
    const {navigator, setParentState} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '个人', tintColor: 'red', style: {fontSize: 20}}}
          style={{height: 45, flex: null}}
        />
        
          <View style={styles.mainContent}>
            <Information navigator={navigator} />
          </View>
          <BottomBar style={{flex: 1}} navigator={navigator} active={'person'} setParentState={setParentState}/>
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
