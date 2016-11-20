import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

import Tabs from 'react-native-tabs';
import {Map} from 'immutable'


export default class BottomBar extends Component {

  componentDidMount() {
    
  }
  static defaultProps = {
    id: '19130126',
    name: '余聪',
    img: "https://facebook.github.io/react/img/logo_og.png",
    gender: '男',
    sign: '222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
  }
  render() {
    const {img, name, gender, id, sign} = this.props;
    const rightArrow = <Image style={styles.rightArrow} source={require("../res/imgs/Forward.png")}/>
    const itemStyle = [styles.item, {height: 58}]
    return (
      <View style={{flex: 1, marginTop: 10}}>
        
        <View style={[itemStyle, {backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#ccc'}]}>
          <Text style={styles.label}>头像</Text>
          <Image source={{uri: img}} style={[styles.img, {marginRight: 10}]}/>
          {rightArrow}
        </View>

        <View style={itemStyle}>
          <Text style={styles.label}>姓名</Text>
          <Text style={styles.text}>{name}</Text>
        </View>

        <View style={itemStyle}>
          <Text style={styles.label}>学号</Text>
          <Text style={styles.text}>{id}</Text>
        </View>

        <View style={[itemStyle, {borderBottomWidth: 0}]}>
          <Text style={styles.label}>性别</Text>
          <Text style={styles.text}>{gender}</Text>
          
        </View>

        <TouchableHighlight
          style={{minHeight: 120}}
          underlayColor="rgba(238,242,247,0.8)"
        >
          <View style={[styles.item, {
            borderBottomWidth: 0, backgroundColor: 'rgba(255,255,255,0.8)',
            flexDirection: 'column', marginTop: 20,
            flex: 1, justifyContent: null, alignItems: null,
          }]}>
            <Text style={[styles.label, {height: 30, flex: -1}]}>个人公告</Text>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={[styles.text, {textAlign: 'left', marginLeft: 10, marginRight: 15,flex: 1}]}>{sign || '无介绍'}</Text>
              {rightArrow}
            </View>
          </View>
        </TouchableHighlight>

      </View>
    )
  }

  shouldComponentUpdate(newProps) {
    return !Map(newProps).equals(Map(this.props));
  }
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: '#C0C0C0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#E0E0E0'
  },
  rightArrow: {
    height: 16,
    width: 12,
    alignSelf: 'center',
    marginRight: 10
  },
  img: {
    borderRadius: 22,
    height: 42,
    width: 42
  },
  label: {
    textAlign: 'left',
    fontSize: 18,
    color: '#aaa',
    marginLeft: 10,
    flex: 1,
  },
  text: {
    textAlign: 'right',
    marginRight: 35,
    color: '#aaa',
    fontSize: 14,
  }
});