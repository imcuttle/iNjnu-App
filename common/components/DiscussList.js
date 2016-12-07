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
  ScrollView,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

import LoadingView from './LoadingView'
import Discuss from './Discuss'
import UserDiscuss from './UserDiscuss'
import {Map,List} from 'immutable'
import moment from 'moment'

import utils from '../utils'

export default class extends Component {

	constructor(props) {
      super(props);
      this._onRefresh = this._onRefresh.bind(this)
      this._addList = this._addList.bind(this)
      this._setNewList = this._setNewList.bind(this)
  }

  static defaultProps = {
    ds: [],
    hasmore: true,
    refreshing: false,
    loadmore: false,
    focusRefresh: false,
    isMyDiscuss: false,
    params: {}
  }

  state = {
    size: 8
  }

  renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
      >
        <View 
          style={{
            marginHorizontal: 10,
            height: adjacentRowHighlighted ? 3 : 2,
            backgroundColor: adjacentRowHighlighted ? '#EEEEEE' : '#CCCCCC',
          }}
        />
        <View 
          style={{
            height: 8,
            backgroundColor: 'transparent',
          }}
        />
      </View>
    );
  }
  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
    this.time2 && clearTimeout(this.time2)
  }

  componentWillMount() {
    const {setProps} = this.props
    //setProps({refreshing: false, loadmore: false})
  }
  componentDidMount() {
    const {setProps, ds, hasmore, focusRefresh} = this.props
    if(hasmore&&ds.length===0) {
      this._addList()
    }
    if(focusRefresh) {
      this._onRefresh();
    }
  }
  componentDidUpdate() {
    const {setProps, ds, hasmore} = this.props
  }
  componentWillReceiveProps(nextProps) {
    const {setProps, focusRefresh} = nextProps;
    if(focusRefresh) {
      this._onRefresh();
    }
  }

  render() {
    const {ds, loadmore, refreshing, params, hasmore} = this.props;
    const {id, number, isSelf, name} = params;
    const {style} = this.props;
    const {size} = this.state
    if(hasmore && ds.length===0) {
      return <LoadingView />
    }
    return (
      <ListView
        style={[{flex: 1}].concat(style)}
        keyboardDismissMode="on-drag"
        initialListSize={size}
        pageSize={size}
        horizontal={false}
        renderScrollComponent={props => { const {style, ...others} = props; return (<ScrollView {...props} />) }}
        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => !Map(r1).equals(r2)}).cloneWithRows(ds)}
        renderRow={this.renderItem.bind(this)}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={true}
        onChangeVisibleRows={(visibleRows, changedRows)=>{
          // alert('onChangeVisibleRows')
          // console.log(visibleRows, changedRows);
          // highlightRow(null);
        }}
        onEndReached={()=>{
          
          ds.length!==0 && !loadmore && this._addList();
        }}
        renderHeader={()=>{
          if(!hasmore && ds.length === 0) {
            return <View style={{alignItems: 'center', marginTop: 30}}>
              <Text style={{fontSize: 18, color: 'red'}}>对不起，暂无数据</Text>
            </View>
          }
          return <View style={{height: 5}}/>
        }}
        onEndReachedThreshold={100}
        renderFooter={()=>{
          if(!hasmore)
            return null
          //<Text style={{alignSelf: 'center', fontSize: 17, height: 30, marginVertical: 10, color: 'black'}}>:(  已经没数据啦！</Text>
          if(loadmore)
            return <LoadingView size="small" color="#ff0000" />
        }}
        /*renderSeparator={this.renderSeperator}*/
        enableEmptySections={true}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffffff"
          />
        }
      >
      </ListView>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !Map(this.props).equals(Map(nextProps))
  }
  _onRefresh() {
    const {setProps, hasmore, ds, params} = this.props;
    const {id, number, isSelf, name} = params;
    const {size} = this.state;
    const len = size*2

    setProps({refreshing: true, focusRefresh: false})
    var promise;
    if(!id) {
      promise = utils.fetchDiscussList(1, len)
    } else {
      promise = utils.fetchUserDiscussList(id, 1, len)
    }
    
    promise.then(discusses=>{
      this._setNewList(discusses, true)
      setProps({refreshing: false})
    })
  }


  _setNewList(discusses, replace) {
    const {setProps, hasmore, ds, params} = this.props;
    const {id, number, isSelf, name} = params;
    var newData;
    if(!id) {
      newData = discusses.map(discuss=>{return {
        img: discuss.sender.img,
        id: discuss.id,
        sender: discuss.sender.id,
        summary: discuss.summary,
        name: discuss.sender.name,
        title: discuss.title,
        tip: (discuss.echotime?'最后回复 ':'发表于 ')+moment(discuss.echotime || discuss.datetime).locale('zh-cn', require('moment/locale/zh-cn')).fromNow()
      }})
    } else {
      newData = discusses.map(discuss=>{return {
        img: discuss.sender.img,
        id: discuss.id,
        sender: discuss.sender.id,
        summary: discuss.summary,
        name: discuss.sender.name,
        title: discuss.title,
        tip: '发表于'+moment(discuss.datetime).format('YYYY-MM-DD HH:mm')
      }})
    }

    if(discusses.length===0) {
      setProps({ds: replace?[]:ds, loadmore: false, hasmore: false, refreshing: false})
    } else {
      setProps({ds: !replace?ds.concat(newData): newData, loadmore: false, hasmore: true})
    }
  }

  _addList() {
    const {setProps, hasmore, ds, params} = this.props;
    const {id, number, isSelf, name} = params;
    const {size} = this.state;
    if(!hasmore) {
      utils.toast('已经没数据啦！')
      return;
    }

    if(ds.length%size!==0) {
      setProps({hasmore: false})
      return;
    }
    setProps({loadmore: true, refreshing: false});
    var promise;
    if(!id) {
      promise = utils.fetchDiscussList((ds.length/size)+1, size, ds.length>0?ds[ds.length-1].id:null)
    } else {
      promise = utils.fetchUserDiscussList(id, (ds.length/size)+1, size, ds.length>0?ds[ds.length-1].id:null)
    }
    
    promise.then(discusses=>{
      this._setNewList(discusses)
    })
  }
  renderItem(rowData, sectionID, rowID, highlightRow) {
    const {navigator, params, setProps, confirm, sumNumber, ds, rmDisscuss, deltaSumNumber, deltaDiscussNumber} = this.props
    const {id, number, isSelf, name} = params;
  	var style = {paddingHorizontal: 12, paddingVertical: 6}
    // alert(JSON.stringify(params))
  	if(!id) 
    	return (
    		<Discuss {...rowData} 
          onPress={()=>{
            navigator.push({
              active: 'discussMain',
              title: rowData.title,
              params: {
                user: rowData.sender,
                id: rowData.id
              }
            })
          }}
          onImgPress={()=>{
            navigator.push({
              active: 'userInfo',
              title: rowData.name,
              params: {
                id: rowData.sender
              }
            })
          }}
        />
    	)
    else
      return (
        <UserDiscuss {...rowData} 
          onPress={()=>{
            navigator.push({
              active: 'discussMain',
              title: rowData.title,
              params: {
                id: rowData.id,
                onDelCallback: ()=>{
                  deltaSumNumber(-1)
                  deltaDiscussNumber(-1)
                  rmDisscuss(rowData.id)
                },
              }
            })
          }}
          onDelPress={isSelf?()=>
            confirm('确定删除该帖子？', () => {
              utils.fetchDelDiscuss(rowData.id)
              .then(f=>{
                if(f) {
                  var list = List(ds)
                  var i = list.toArray().findIndex(x=>x.id===rowData.id)
                  if(i>=0){
                    list = list.remove(i).toArray()
                    if(list.length===0) {
                      setProps({hasmore: false, ds: []})
                    } else {
                      setProps({ds: list})
                    }
                    deltaSumNumber(-1)
                    deltaDiscussNumber(-1)
                    rmDisscuss(rowData.id)
                  }
                }
              })
            })
          :null}
        />
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 13
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});