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


export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  state={
    
  }

  render() {
    const {...props} = this.props;
    return (
      <ActivityIndicator 
        animating={true} 
        style={[styles.centering, {height: 80}]}
        size="large"
        color="#3e9ce9"
        {...props}
      />
    )
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
});
