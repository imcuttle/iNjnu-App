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
    focusRefresh: false
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
    const {setProps, ds, hasmore} = this.props
    if(hasmore&&ds.length===0) {
      this._addList()
    } 
  }
  componentWillReceiveProps(nextProps) {
    const {setProps, focusRefresh} = nextProps;
    if(focusRefresh) {
      this._onRefresh();
    }
  }

  render() {
    const {ds, loadmore, refreshing, hasmore} = this.props;
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
          alert('onChangeVisibleRows')
          // console.log(visibleRows, changedRows);
          // highlightRow(null);
        }}
        onEndReached={()=>{
          if(!hasmore) {
            utils.toast('已经没数据啦！')
          }
          ds.length!==0 && !loadmore && this._addList();
        }}
        renderHeader={()=><View style={{height: 5}}/>}
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
    const {setProps, hasmore, ds} = this.props;
    const {size} = this.state;
    const len = size*2

    setProps({refreshing: true, focusRefresh: false})
    utils.fetchDiscussList(1, len)
    .then(discusses=>{
      this._setNewList(discusses, true)
      setProps({refreshing: false})
    })
  }

  _setNewList(discusses, replace) {
    const {setProps, hasmore, ds} = this.props;

    var newData = discusses.map(discuss=>{return {
      img: discuss.sender.img,
      id: discuss.id,
      sender: discuss.sender.id,
      summary: discuss.summary,
      name: discuss.sender.name,
      title: discuss.title,
      tip: (discuss.echotime?'最后回复 ':'发表于 ')+moment(discuss.echotime || discuss.datetime).locale('zh-cn', require('moment/locale/zh-cn')).fromNow()
    }})

    if(discusses.length===0) {
      setProps({loadmore: false, hasmore: false})
    } else {
      setProps({ds: !replace?ds.concat(newData): newData, loadmore: false, hasmore: true})
    }
  }

  _addList() {
    const {setProps, hasmore, ds} = this.props;
    const {size} = this.state;
    if(!hasmore) {
      return;
    }

    if(ds.length%size!==0) {
      setProps({hasmore: false})
      return;
    }
    setProps({loadmore: true, refreshing: false});
    utils.fetchDiscussList((ds.length/size)+1, size, ds.length>0?ds[ds.length-1].id:null)
    .then(discusses=>{
      this._setNewList(discusses)
    })
  }
  renderItem(rowData, sectionID, rowID, highlightRow) {
    const {navigator} = this.props
  	var style = {paddingHorizontal: 12, paddingVertical: 6}
  	
  	return (
  		<Discuss {...rowData} 
        onPress={()=>{
          navigator.push({
            active: 'discussMain',
            title: rowData.title,
            params: {
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