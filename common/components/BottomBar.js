import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import Tabs from 'react-native-tabs';

export default class BottomBar extends Component {
	_select(el) {
    const {setParentState, navigator, active} = this.props;
    if(el.props.name === active) {
      return;
    }
    navigator.resetTo({
      active: el.props.name,
    })
		//setParentState({active: el.props.name});
	}
  componentDidMount() {
    const {setParentState, active} = this.props;
  }
	render() {

		const {active, navigator} = this.props;
		return (
			<Tabs selected={active} style={[styles.bottomBar, {backgroundColor:'white', flex: 2}]}
          selectedStyle={{color:'red'}} 
          selectedIconStyle={{borderBottomWidth:2,borderBottomColor:'red'}}
          onSelect={this._select.bind(this)}>
          <Text name="lookup" style={styles.text}>查查</Text>
          <Text name="discuss" style={styles.text}>讨论</Text>
          <Text name="friend" style={styles.text}>私信</Text>
          <Text name="person" style={styles.text}>个人</Text>
      </Tabs>
		)
	}

	shouldComponentUpdate() {
		return true;
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cell: {
    flex: 1,
    backgroundColor: 'red',
  },
  bottomBarText: {
    textAlign: 'center'
  },
  mainContent: {
    flex: 10,
    backgroundColor: 'green',
    alignItems: 'stretch'
  },
  bottomBar: {
    //flex: 1,
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 16
  }
});