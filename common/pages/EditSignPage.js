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
  Image,
  Platform
} from 'react-native';
import BottomBar from '../components/BottomBar'
import Information from '../components/Information'
import PureEditor from '../components/PureEditor'
import NavigationBar from 'react-native-navbar'


import utils from '../utils'
import db from '../storage'

export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  componentDidMount() {
    const {navigator, initVal} = this.props;
    
  }
  render() {
    const {navigator, initVal, setSign} = this.props
    
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '个人公告', tintColor: 'red', style: {fontSize: 20}}}
          style={{height: 45, flex: null}}
          leftButton={{
            title: '返回',
            handler: ()=>navigator.pop()
          }}
          rightButton={{
            title: '完成',
            handler: ()=>{
              var v = this._t.getVal()
              if(!v||v.trim().length===0) {
                utils.toast('内容不能为空')
                return
              }

              utils.fetchUpdateSign(v)
              .then(f=> {
                if(f) {
                  setSign(v)
                  navigator.pop()
                }
              })
            }
          }}
        />
          <View style={styles.mainContent}>
            <PureEditor ref={r=>this._t=r} initValue={initVal} />
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    backgroundColor: 'red',
  },
  
  mainContent: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    alignItems: 'stretch',
    
  },
});
