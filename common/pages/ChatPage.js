import React from 'react'
import {
	Text,
	View
} from 'react-native'

import NavigationBar from 'react-native-navbar'
import Chat from '../components/Chat'

export default class extends React.Component {
	constructor(props) {
      super(props);
  	}

  	render() {
  		const {route, navigator} = this.props;
  		const {params} = route;
  		const {img, title} = params;
  		return (
  			<View style={{flex: 1}}>
  				<NavigationBar
  					title={{title: `与${title}聊天中`, tintColor: 'red', style: {fontSize: 20}}}
  					statusBar={{hidden: false}}
  					style={{height: 45, flex: null}}
            leftButton={{
              title: '返回',
              handler: () => {
                navigator.pop()
              }
            }}
		  		/>
		  		<Chat />
  			</View>
		)
  	}
}