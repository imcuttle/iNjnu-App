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
  Image
} from 'react-native';

import LoadingView from './LoadingView'

export default class extends Component {

	constructor(props) {
      super(props);
      
  }

  static defaultProps = {
    ds: [],
  }

  state={
    // refreshing: true,
    ds: []
  }
  
  componentWillUnmount() {
    
  }
  componentDidMount() {
    
      
  }
  componentWillReceiveProps(newProps) {
    
  }

  render() {
    const {ds} = this.props;
    // const {refreshing, loaded} = this.state;
    const {style, ...props} = this.props;
    // if(ds.length===0 && refreshing) {
    //   return <LoadingView />
    // }
    return (
      <ListView
        contentContainerStyle={styles.list}
        keyboardDismissMode="on-drag"
        initialListSize={5}
        pageSize={5}
        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(ds)}
        renderRow={this.renderItem.bind(this)}
        showsVerticalScrollIndicator={false}
        /*renderSeparator={this.renderSeperator}*/
        enableEmptySections={true}
        /*refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffffff"
          />
        }*/
        {...props}
      >
      </ListView>
    );
  }
  
  renderItem(rowData, sectionID, rowID, highlightRow) {
  	var style = {paddingHorizontal: 12, paddingVertical: 6}
  	
  	return (
  		<TouchableHighlight 
        style={styles.item}
        underlayColor="rgba(238,242,247,0.8)"
        onPress={(e)=>{rowData.onPress(rowData, e);}}
      >
        <View style={styles.item}>
          <Image source={{uri: rowData.img}} style={styles.img}/>
          <Text style={styles.name}>{rowData.name}</Text>
        </View>
  		</TouchableHighlight>
  	)
  }
}

var styles = StyleSheet.create({
    name: {
      marginTop: 3,
      fontSize: 16.5,
      color: 'black'
    },
    img: {
      width: 40,
      height: 40,
      borderRadius: 4,
      justifyContent: 'center',
      alignSelf: 'center'
    },
    list: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    item: {
      shadowColor: '#CCC',
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#CCC',
      backgroundColor: 'rgba(255,255,255,0.8)',
      margin: 10,
      width: 100,
      padding: 5,
      height: 100
    }
});