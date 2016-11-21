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
import Loading from '../components/LoadingView'
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
    const {navigator, setProps} = this.props;
    utils.fetchInfo()
    .then(data=>{
      setProps({
        refreshing: false,
        info: data,
      })
    })
  }
  render() {
    const {navigator, setPreview, setProps} = this.props
    const {info, refreshing} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '个人', tintColor: 'red', style: {fontSize: 20}}}
          style={{height: 45, flex: null}}
        />
          <View style={styles.mainContent}>
            {
              refreshing ? <Loading /> 
              : <Information navigator={navigator} 
                  {...info}
                  onImgPress={()=>setPreview(info.img)}
                  onImgBlockPress={()=>{
                    utils.imagePick()
                    .then(source=>{
                      if(source) {
                        if(source.fileSize>1024*1024*4) {
                          utils.toast('图片不能大于4M');
                          return;
                        }
                        utils.toast('正在努力上传中...')
                        utils.fetchUploadBase64Head(source.uri)
                        .then(f=> f && setProps({info: {...info, img: source.uri}}) )
                      }
                    }).catch(err=>utils.toast(err.message))
                  }}
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
                  onSignPress={()=>{
                    navigator.push({
                      active: 'editSign',
                      params: {
                        initVal: info.sign || ''
                      }
                    })
                  }}
                />
            }
          </View>
          <BottomBar style={{flex: 1}} navigator={navigator} active={'person'} />
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
    marginBottom: 50
  },
});
