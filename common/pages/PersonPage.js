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
import BottomBar from '../components/BottomBar'
import Information from '../components/Information'
import Loading from '../components/LoadingView'
import NavigationBar from 'react-native-navbar';

export default class extends Component {

	constructor(props) {
      super(props);
  }

  static defaultProps = {
    
  }

  state={
    info: {},
    refreshing: true
  }
  componentDidMount() {
    const {navigator} = this.props;
    utils.fetchInfo()
    .then(data=>{
      this.setState({
        refreshing: false,
        info: data,
      })
    })
  }
  render() {
    const {navigator, setPreview} = this.props
    const {info, refreshing} = this.state;
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
                  onImgBlockPress={()=>{}}
                  onSignPress={()=>{}}
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
