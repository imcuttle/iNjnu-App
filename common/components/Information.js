import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';

import Tabs from 'react-native-tabs';
import {Map} from 'immutable'


export default class BottomBar extends Component {

  componentDidMount() {
    
  }
  static defaultProps = {
    id: '',
    name: '',
    img: "",
    grade: "",
    department: "",
    classNo: "",
    commentNumber: 0,
    discussNumber: 0,
    sign: ''
  }
  render() {
    const {
      img, name, classNo, department, grade, create_time,
      commentNumber, discussNumber, id, sign,
      onImgPress, onImgBlockPress, onSignPress,
      onDiscussPress, onComentPress, onLogoutPress
    } = this.props;
    
    const rightArrow = <Image style={styles.rightArrow} source={require("../res/imgs/Forward.png")}/>
    const itemStyle = [styles.item, {height: 58}]
    const enableStyle = {color: '#666'}
    const enabelItem = [itemStyle, {backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#ccc'}]
    return (
      <ScrollView >
        
        <View style={[{flex: 1, margin: 10}, styles.container]}>
          <TouchableHighlight
            underlayColor="rgba(238,242,247,0.8)"
            onPress={onImgBlockPress}
          >
            <View style={enabelItem}>
              <Text style={[styles.label, enableStyle]}>头像</Text>
              <TouchableWithoutFeedback onPress={onImgPress}>
                <Image source={{uri: img}} style={[styles.img, {marginRight: 10}]}/>
              </TouchableWithoutFeedback>
              {rightArrow}
            </View>
          </TouchableHighlight>
          

          <View style={itemStyle}>
            <Text style={styles.label}>姓名</Text>
            <Text selectable={true} style={styles.text}>{name}</Text>
          </View>

          <View style={itemStyle}>
            <Text style={styles.label}>学号</Text>
            <Text selectable={true} style={styles.text}>{id}</Text>
          </View>

          <View style={itemStyle}>
            <Text style={styles.label}>班级</Text>
            <Text selectable={true} style={styles.text}>{classNo}</Text>
          </View>

          <View style={itemStyle}>
            <Text style={styles.label}>年级</Text>
            <Text selectable={true} style={styles.text}>{grade}</Text>
          </View>

          <View style={[itemStyle, {borderColor: '#ccc'}]}>
            <Text style={styles.label}>学院</Text>
            <Text selectable={true} style={styles.text}>{department}</Text>
          </View>

          <View style={enabelItem}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={onDiscussPress}
            >
              <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <Text style={[styles.label, enableStyle]}>发帖数</Text>
                <Text selectable={true} style={[styles.text, {marginRight: 10}]}>{discussNumber}</Text>
                {rightArrow}
              </View>
            </TouchableWithoutFeedback>
            <View style={{height: 22, marginRight: 5, width: .4, backgroundColor: '#bbb'}}></View>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              underlayColor="rgba(238,242,247,0.8)"
              onPress={onComentPress}
            >
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <Text style={[styles.label, enableStyle]}>评论数</Text>
              <Text selectable={true} style={[styles.text, ]}>{commentNumber}</Text>
            </View>
            </TouchableWithoutFeedback>
          </View>

          <TouchableHighlight
            style={[styles.item, {
              borderBottomWidth: 0, backgroundColor: 'rgba(255,255,245,0.8)',
              flexDirection: 'column', marginTop: 20,
              flex: 1, justifyContent: null, alignItems: null,
            }]}
            onPress={onSignPress}
            underlayColor="rgba(238,242,247,0.8)"
          >
            <View >
              <Text style={[styles.label, {height: 30, flex: -1}, enableStyle]}>个人公告</Text>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text selectable={true} style={[styles.text, {textAlign: 'left', marginLeft: 10, marginRight: 15,flex: 1}]}>{sign || '无介绍'}</Text>
                {rightArrow}
              </View>
            </View>
          </TouchableHighlight>

          <View style={{height: 20}}></View>
          <TouchableHighlight
            underlayColor="#FF6666"
            onPress={onLogoutPress}
          >
            <View style={[enabelItem, {backgroundColor: '#FF3333',
             borderColor: '#ccc', borderWidth: .5,
             paddingVertical: 4, height: 50
           }]}>
              <View>
                <Text style={{ color: 'white', fontSize: 18}}>退出该帐号</Text>
              </View>
            </View>
          </TouchableHighlight>
          
        </View>
      </ScrollView>
    )
  }

  shouldComponentUpdate(newProps) {
    return !Map(newProps).equals(Map(this.props));
  }
}

const styles = StyleSheet.create({
  container: {
    
  },
  item: {
    borderBottomWidth: .5,
    // borderLeftWidth: .5,
    // borderRightWidth: .5,
    borderColor: '#C0C0C0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 10,
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