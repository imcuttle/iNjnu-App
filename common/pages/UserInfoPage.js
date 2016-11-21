import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
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
	state={
    info: {},
    refreshing: true,
  }
  componentDidMount() {
    const {navigator, route} = this.props;
    utils.fetchInfo(route.params.id)
    .then(data=>{
      this.setState({
        refreshing: false,
        info: data,
      })
    })
  }
	render() {
		const {navigator, route, setPreview, setProps} = this.props;
    const {refreshing, info} = this.state
    
		return (
      <View style={{flex: 1, backgroundColor: '#F8F8FF'}}>
        <NavigationBar
          title={{title: route.title, tintColor: 'red', style: {fontSize: 20}}}
          statusBar={{hidden: false}}
          style={{height: 45, flex: null}}
          leftButton={{
            title: '返回',
            handler: () => {
              navigator.pop()
            }
          }}
        />
        {
          refreshing ?<LoadingView />:
          <ScrollView>
            <View style={{flex: 1, marginTop: 50, marginBottom: 25}}>
              <UserInfoView {...info} 
                onImgPress={()=>{setPreview(info.img)}}
                onDiscussPress={()=>{
                  db.get('user').then(id=>{
                    navigator.push({
                      active: 'userDiscussList',
                      params: {
                        id: info.id,
                        isSelf: info.id==id,
                        name: info.name,
                        number: info.discussNumber
                      }
                    })
                  })
                }}
              />
            </View>
          </ScrollView>
        }
      </View>
			
		)
	}

	shouldComponentUpdate(newProps, newState) {
		return !Map(newState).equals(Map(this.state));
	}
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