import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Picker,
  Platform,
  BackAndroid,
  Navigator
} from 'react-native';


import {Map,List} from 'immutable'
import ImagePreview from 'react-native-image-preview'
import Popup from 'react-native-popup'

import LoginForm from './components/LoginForm'

import utils from './utils'

import FriendsPage from './pages/FriendsPage'
import LookupPage from './pages/LookupPage'
import InitPage from './pages/InitPage'
import DiscussPage from './pages/DiscussPage'
import DiscussMainPage from './pages/DiscussMainPage'
import PersonPage from './pages/PersonPage'
import ChatPage from './pages/ChatPage'
import DeployPage from './pages/DeployPage'
import LookupScorePage from './pages/LookupScorePage'
import LookupFacePage from './pages/LookupFacePage'
import UserInfoPage from './pages/UserInfoPage'
import UserDiscussPage from './pages/UserDiscussPage'
import EditSignPage from './pages/EditSignPage'

require('./workers');
  

export default class App extends Component {
  state = {
  	loading: true,
  	login: false,
    discussProps: {},
    deployProps: {},
    friendProps: {},
    discussMainProps: {},
    preview: '',
    personProps: {
      info: {},
      refreshing: true,
    },
    lookupFaceProps: {
      images: [],
      url: '',
      fetching: false
    },
    navigator: null
  }
  constructor(props) {
    super(props)
    this.renderLoginForm = this.renderLoginForm.bind(this)
    this.setDiscussProps = this.setDiscussProps.bind(this)
    this.setPersonProps = this.setPersonProps.bind(this)
    this.confirm = this.confirm.bind(this)
    this.onBackAndroid = this.onBackAndroid.bind(this)
    this.reset = this.reset.bind(this)
  }
  reset() {
    this.setState({
      login: false,
      discussProps: {},
      deployProps: {},
      friendProps: {},
      discussMainProps: {},
      preview: '',
      personProps: {
        info: {},
        refreshing: true,
      },
      lookupFaceProps: {
        images: [],
        url: '',
        fetching: false
      },
    })
    this.navigator && this.navigator.resetTo(this.initRoute)
  }
  initRoute={active: 'lookup', title: "iNjnu", params: {id: '19130126'}}
  onBackAndroid() {

    if(this.navigator) {
      if(this.navigator.getCurrentRoutes().length>1) {
        this.navigator.pop()
        return true;
      }
    }
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      return false;
    }
    this.lastBackPressed=Date.now()
    utils.toast('再按一次退出应用');
    return true;
  }
  componentWillUnmount() {

    if(Platform.OS==='android')
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentDidMount() {
    if(Platform.OS==='android')
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    setTimeout(()=>{
      utils.isLogin()
      .then(login=>{
        this.setState({login: login, loading: false})
      });
    }, 3000)
  }
  setDiscussProps(props) {
    const {loading, login, discussProps, friendProps, discussMainProps} = this.state;
    this.setState({
      discussProps: Object.assign({}, discussProps, props)
    })
  }
  setPersonProps(props) {
    const {personProps} = this.state
    this.setState({
      personProps: Object.assign({}, personProps, props)
    })
  }
  render() {
  	const {loading, lookupFaceProps, login, personProps, discussProps, friendProps, deployProps, preview, discussMainProps} = this.state;

    return (
        <Navigator
          initialRoute={this.initRoute}
          renderScene={(route, navigator) => {
              if(!this.navigator) {
                this.navigator = navigator
              }
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
                    Page = <PersonPage 
                      route={route} 
                      navigator={navigator} 
                      confirm={this.confirm}
                      setProps={this.setPersonProps}
                      setParentState={this.setState.bind(this)} 
                      setPreview={(preview)=>this.setState({preview})}
                      reset={this.reset}
                      {...personProps}
                    />
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
                      setDiscussProps={this.setDiscussProps}
                      confirm={this.confirm}
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
                  } else if(active === 'userInfo') {
                    Page = <UserInfoPage 
                      setPreview={(preview)=>this.setState({preview})}
                      navigator={navigator} route={route}
                    />
                  } else if(active === 'userDiscussList') {
                    Page = <UserDiscussPage 
                      deltaDiscussNumber={(n)=>{
                        personProps.info && personProps.info.discussNumber 
                        && this.setPersonProps({
                          info: {
                            ...personProps.info, 
                            discussNumber: personProps.info.discussNumber-1
                          }
                        })
                      }}
                      rmDisscuss={(id)=>{
                        var newData = List(discussProps.ds||[])
                        var i = newData.toArray().findIndex(x=>x.id==id)
                        if(i>=0)
                          newData = newData.remove(i)
                        this.setDiscussProps({
                          ...discussProps,
                          ds: newData.toArray()
                        })
                      }}
                      navigator={navigator} params={route.params}
                    />
                  } else if(active === 'editSign') {
                    Page = <EditSignPage 
                      setSign={(s)=>
                        personProps.info 
                        && this.setPersonProps({info: {
                          ...personProps.info,
                          sign: s
                        }})
                      }
                      navigator={navigator} initVal={route.params.initVal}/>
                  } else if(active === 'lookupFace') {

                    Page = <LookupFacePage
                      setPreview={(preview)=>this.setState({preview})}
                      setProps={(p)=>
                        this.setState({
                          lookupFaceProps: {...lookupFaceProps, ...p}
                        })
                      }
                      {...lookupFaceProps}
                      navigator={navigator} 
                    />
                  }
                }
              }
              return (
                <View style={{flex: 1}}>
                  {Page}
                  {!!preview && <ImagePreview visable={!!preview} source={{uri: preview}} close={()=>this.setState({preview: ''})}/>}
                  <Popup ref={popup => this.popup = popup } isOverlayClickClose={false}/>
                </View>
              )
            }
          }
        />
    );
  }

  confirm(title='title', onOk, onCancel) {
    this.popup.confirm({
        title: title,
        ok: { text: '确定', style: {color: 'red'},
            callback: onOk,
        },
        cancel: {
            text: '取消',
            style: {
                color: '#3e9ce9'
            },
            callback: onCancel,
        },
    });
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


