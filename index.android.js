/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Picker
} from 'react-native';


import App from './common/App'

export default class iNjnu extends Component {

  render() {

    return (
      <App/>
    );
  }
}


AppRegistry.registerComponent('iNjnu', () => iNjnu);
