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
  TextInput,
  Image
} from 'react-native';
import BottomBar from '../components/BottomBar'
import DiscussList from '../components/DiscussList'

import NavigationBar from 'react-native-navbar';
import ModalPicker from 'react-native-modal-picker'



export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  state={
    userDiscussProps: {
      hasmore: true,
      ds: [],
    },
    sumNumber: null
  }

  componentDidMount() {
    const {navigator, params, setPersonProps, rmDisscuss} = this.props;
    const {number, isSelf, name, id} = params
    this.setState({sumNumber: number})
  }

  render() {
    const {navigator, params, deltaDiscussNumber, rmDisscuss, confirm} = this.props;
    const {number, isSelf, name, id} = params
    const {userDiscussProps, sumNumber} = this.state;
    console.log(userDiscussProps)
    //alert(JSON.stringify(userDiscussProps))
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: (isSelf?'我':name)+'的帖子('+(sumNumber!=null?sumNumber:number)+')', tintColor: 'red', style: {fontSize: 20}}}
          statusBar={{hidden: false}}
          style={{height: 45, flex: null}}
          leftButton={{
            title: '返回',
            handler: () => {
              navigator.pop()
            }
          }}
        />
        <View style={styles.mainContent}>
          <DiscussList navigator={navigator}
            confirm={confirm} 
            params={params}
            setProps={(props)=>{
              this.setState({userDiscussProps: {...userDiscussProps, ...props}})
            }}
            rmDisscuss={rmDisscuss}
            deltaSumNumber={(n)=>this.setState({sumNumber: +n+sumNumber})}
            deltaDiscussNumber={deltaDiscussNumber}
            {...userDiscussProps} />
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
    alignItems: 'stretch'
  },
});
