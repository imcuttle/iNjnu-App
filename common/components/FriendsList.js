import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

import LoadingView from './LoadingView'
import {Map, Set, List} from 'immutable'

export default class extends Component {

	constructor(props) {
      super(props);
      this._onRefresh = this._onRefresh.bind(this)
      this._addList = this._addList.bind(this)
      this.jumpChatView = this.jumpChatView.bind(this)
  }

  static defaultProps = {
    ds: [],
    hasmore: true,
    refreshing: false,
    loadmore: false
  }

  renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 2 : 1,
          backgroundColor: adjacentRowHighlighted ? '#EEEEEE' : '#CCCCCC',
        }}
      ></View>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !Map(this.props).equals(Map(nextProps))
  }
  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
    this.time2 && clearTimeout(this.time2);
  }
  componentDidMount() {
    this.timer = setTimeout(() => {
      this._addList();
    }, 1400)
  }
  componentWillReceiveProps(newProps) {
  }

  render() {
    const {ds, refreshing, loadmore, hasmore, style, ...props} = this.props;
    if(hasmore && ds.length===0) {
      return <LoadingView />
    }
    return (
      <ListView
        style={[{flex: 1}].concat(style)}
        keyboardDismissMode="on-drag"
        initialListSize={5}
        pageSize={8}
        ref={ref=>{if(ref){this.scrollProperties=ref.scrollProperties}}}
        horizontal={false}
        renderScrollComponent={props => { const {style, ...others} = props; return (<ScrollView {...props} />) }}
        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(ds)}
        renderRow={this.renderItem.bind(this)}
        renderFooter={()=>{
          if(!hasmore)
            return null;
            //return <Text style={{alignSelf: 'center', fontSize: 17, marginVertical: 10, color: 'black'}}>:(  已经没数据啦！</Text>
          if(loadmore)
            return <LoadingView color="#ff0000" />
        }}
        showsVerticalScrollIndicator={true}
        onChangeVisibleRows={(visibleRows, changedRows)=>{
          
        }}
        onEndReachedThreshold={60}
        removeClippedSubviews={false}
        onScroll={(e)=>{
          
        }}
        onEndReached={(e)=>{
          ds.length!==0 && !loadmore && this._addList();
        }}
        enableEmptySections={true}
        renderSeparator={this.renderSeperator}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffffff"
          />
        }
        {...props}
      />
    );
  }
  _onRefresh() {
    const {setProps} = this.props
    setProps({refreshing: true, loadmore: false});
    setTimeout(() => {
      setProps({
        refreshing: false,
        ds: this.props.ds.slice(2, 6)
      });
    }, 5000);
  }
  _addList() {
    const {setProps, hasmore} = this.props
    if(!hasmore) {
      return;
    }
    setProps({loadmore: true, refreshing: false});
    this.time2 = setTimeout(() => {
      if(this.props.ds.length>=20) {
        setProps({
          hasmore: false,
          loadmore: false
        })
        return;
      }

      const rowData = Array.from(new Array(8))
      .map((val, i) => ({
        img: 'https://facebook.github.io/react/img/logo_og.png',
        title: 'Loaded row '+ (+this.props.ds.length+i),
        subtitle: 'subtitle',
        time: 'time'
      }))

      setProps({
        loadmore: false,
        ds: this.props.ds.concat(rowData),
      });
    }, 5000);
  }

  jumpChatView(rowData) {
    const {navigator} = this.props;
    navigator.push({
      active: 'chat',
      params: rowData
    })
  }

  renderItem(rowData, sectionID, rowID, highlightRow) {
  	var style = {paddingHorizontal: 12, paddingVertical: 6}
  	
  	return (
  		<TouchableHighlight 
        style={[{height: 60, backgroundColor: 'rgba(255,255,255,0.8)'}, style]}
        underlayColor="rgba(238,242,247,0.8)"
        onPress={()=>{
          this.jumpChatView(rowData)
        }}
      >
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <Image source={{uri: rowData.img}} 
            style={{width: 40, height: 40, borderRadius: 20, marginRight: 13}}/>
          <View style={{flexDirection: 'column', flex: 1}}>
      			<View style={{flexDirection: 'row', flex: 1, margin: 2, alignItems: 'flex-end'}}>
              <Text style={{fontSize: 17, flex: 1, textAlign: 'left'}}>{rowData.title}</Text>
              <Text style={{fontSize: 12, textAlign: 'right'}}>{rowData.time}</Text>
            </View>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <Text style={{fontSize: 14, flex: 1, textAlign: 'left'}}>{rowData.subtitle}</Text>
              { 
                rowData.unread && rowData.unread>0 ?
                <Text style={{fontSize: 10, textAlign: 'right', color: 'white', paddingVertical: 3, paddingHorizontal: 4, borderRadius: 20, backgroundColor: 'red'}}>
                  {rowData.unread}
                </Text> : null
              }
            </View>
          </View>
        </View>
  		</TouchableHighlight>
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