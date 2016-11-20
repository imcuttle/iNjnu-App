import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Picker,
  Navigator
} from 'react-native';
import {Map} from 'immutable'

import LoginForm from './LoginForm'

import utils from '../utils'

import FriendsPage from '../pages/FriendsPage'
import LookupPage from '../pages/LookupPage'
import InitPage from '../pages/InitPage'
import DiscussPage from '../pages/DiscussPage'
import DiscussMainPage from '../pages/DiscussMainPage'
import PersonPage from '../pages/PersonPage'
import ChatPage from '../pages/ChatPage'
import DeployPage from '../pages/DeployPage'
import LookupScorePage from '../pages/LookupScorePage'

require('../workers');
  

export default class App extends Component {
  state = {
  	loading: true,
  	login: false,
    discussProps: {},
    deployProps: {},
    friendProps: {},
    discussMainProps: {}
  }
  constructor(props) {
    super(props)
    this.renderLoginForm = this.renderLoginForm.bind(this)
    this.setDiscussProps = this.setDiscussProps.bind(this)
  }
  componentWillMount() {
  	utils.isLogin()
  	.then(login=>{
      this.setState({login: login, loading: false})
    });
  }
  setDiscussProps(props) {
    const {loading, login, discussProps, friendProps, discussMainProps} = this.state;
    this.setState({
      discussProps: Object.assign({}, discussProps, props)
    })
    
  }
  render() {
  	const {loading, login, discussProps, friendProps, deployProps, discussMainProps} = this.state;

    return (
        <Navigator
          initialRoute={{active: 'lookup', title: "Best NJNU", params: {}}}
          renderScene={(route, navigator) => {
              let active = route.active, title = route.title, params = route.params;
              let Page;
              if(loading) {
                Page = <InitPage route={route} navigator={navigator} />
              } else {
                if(!login) {
                  Page = this.renderLoginForm()
                } else {
                  if(active === 'friend') {
                    Page = <FriendsPage route={route} navigator={navigator} friendProps={friendProps}
                    setProps={(props)=>{
                      this.setState({
                        friendProps: Object.assign({}, friendProps, props)
                      })
                    }} />
                  } else if(active === 'lookup') {
                    Page = <LookupPage route={route} navigator={navigator} setParentState={this.setState.bind(this)} />
                  } else if(active === 'discuss') {
                    Page = <DiscussPage route={route} navigator={navigator} discussProps={discussProps} 
                      setProps={this.setDiscussProps}
                     />
                  } else if(active === 'person') {
                    Page = <PersonPage route={route} navigator={navigator} setParentState={this.setState.bind(this)} />
                  } else if(active === 'chat') {
                    Page = <ChatPage route={route} navigator={navigator} />
                  } else if(active === 'deploy') {
                    Page = <DeployPage navigator={navigator} 
                      setProps={(props)=>{
                        this.setState({
                          deployProps: Object.assign({}, deployProps, props)
                        })
                      }}
                      setDiscussProps={this.setDiscussProps}
                      {...deployProps}
                    />
                  } else if(active === 'discussMain') {
                    Page = <DiscussMainPage navigator={navigator} route={route}
                      setProps={(props)=>{
                        var ent = discussMainProps[route.params.id] || {}

                        this.setState({
                          discussMainProps: Map(discussMainProps).set(route.params.id, Object.assign({}, ent, props)).toJS()
                        })
                      }}
                      {...discussMainProps[route.params.id]}
                    />
                  } else if(active === 'lookupScore') {
                    Page = <LookupScorePage 
                      navigator={navigator} 
                    />
                  }
                }
              }
              return (
                <View style={{flex: 1}}>
                  {Page}
                </View>
              )
            }
          }
        />
    );
  }
  renderLoginForm() {
  	return (
  		<LoginForm setParentState={this.setState.bind(this)} style={{flex: 1, alignItems: 'center'}}/>
  	)
  }
  shouldComponentUpdate(newProps, newState) {
    return !Map(newState).equals(Map(this.state))
  }
}

