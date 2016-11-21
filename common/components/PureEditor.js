import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

import Tabs from 'react-native-tabs';
import NavigationBar from 'react-native-navbar';
import {Map} from 'immutable'

import UserInfoView from '../components/UserInfoView'
import LoadingView from '../components/LoadingView'

import utils from '../utils'
import db from '../storage'

export default class extends Component {
  constructor(props) {
    super(props);
    this.getVal = this.getVal.bind(this)
  }
  state={
    value: ''
  }
  componentWillReceiveProps(nextProps) {
    
  }
	render() {
    const {value} = this.state
    const {initValue, ...props} = this.props;
    return <TextInput ref={r=>this._t=r} style={multiline} 
        autoFocus={true}
        maxLength={100}
        multiline={true}
        value={value || initValue}
        onChangeText={t=>this.setState({value: t})}
        underlineColorAndroid="transparent"
        numberOfLines={4}
        {...props}
      />
  }
  getVal() {
    const {value} = this.state
    return value
  }
}

var multiline =  {
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderTopWidth: 1,
  borderColor: '#a0a0a0',
  justifyContent: 'flex-start',
  flex: 3,
  fontSize: 14,
  minHeight: 200,
  padding: 6,
  marginBottom: 4,
  borderRadius: 4,
  marginHorizontal: 10,
}

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 30,
    color: 'black',
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    borderRadius: 3,
    textAlign: 'center',
    margin: 10,
    alignSelf: 'flex-end',
  },
});