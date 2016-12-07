import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';

import Tabs from 'react-native-tabs';
import {Map} from 'immutable'

export default class BottomBar extends Component {
	
  componentDidMount() {
    
  }
	render() {
		const {title, img, name, tip, summary, onPress, onDelPress} = this.props;
		return (
			<TouchableHighlight
              style={styles.item}
              onPress={onPress}
              underlayColor="rgba(238,242,247,0.8)"
            >
              <View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={[styles.title, {flex: 1}]}>标题：{title}</Text>
                  {
                    onDelPress &&
                    <TouchableWithoutFeedback onPress={onDelPress}>
                      <View style={{}}>
                        <Text style={{textAlign: 'right', fontSize: 13, color: 'red'}}>删除</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  }
                </View>
                <Text style={styles.summary}>内容：{summary+'...'}</Text>
                <View style={{flex: 1}}>
                  <Text style={styles.tip}>{tip}</Text>
                </View>
              </View>
            </TouchableHighlight>
		)
	}

	shouldComponentUpdate(newProps) {
		return !Map(newProps).equals(Map(this.props));
	}
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 10,
    marginTop: 15,
    borderRightWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#ccc',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  summary: {
    fontSize: 14.5,
    color: '#aaa',
  },
  title: {
    fontSize: 16.5,
    color: 'black',
    paddingVertical: 4,
    // paddingLeft: 10
  },
  img: {
    borderRadius: 16,
    height: 32,
    width: 32
  },
  name: {
    fontSize: 15,
    color: 'orange',
    marginLeft: 10,
    flex: 1
  },
  tip: {
    textAlign: 'right',
    marginRight: 5,
    color: '#aaa',
    fontSize: 13,
    // alignSelf: 'flex-end'
  }
});