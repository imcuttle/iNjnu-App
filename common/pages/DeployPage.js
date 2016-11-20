import React from 'react'
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	TextInput
} from 'react-native'

import NavigationBar from 'react-native-navbar';

import utils from '../utils'

var t = require('tcomb-form-native');
var Form = t.form.Form;

function valide(s) {
  return !!s && s.trim().length>0;
}

var Valide = t.refinement(t.String, valide);




var Discuss = t.struct({
  title: Valide,      
  content: Valide  
});


export default class extends React.Component {
	static defaultProps={

	}

	render() {
		const {navigator, setProps, setDiscussProps, title, content} = this.props
		var options = {
			auto: 'placeholders',
			fields: {
			  title: {
			  	template: (locals) => {
				  var textboxStyle = {marginHorizontal: 30, 
				  	padding: 6, borderBottomWidth: 1, 
				  	borderColor: '#404040', height: 35, 
				  	fontSize: 17, textAlign: 'center',
				  	flex: 1
				  };
				  
				  return (
				    <TextInput style={textboxStyle} {...locals} onChangeText={(text)=>{setProps({title: text})}} value={title}/>
				  );
				},
			  	underlineColorAndroid: 'rgba(0,0,0,0)',
			  	autoCorrect: false,
			  	error: '请输入标题',
			  	maxLength: 20,
			  	selectionColor: 'red',
			  	multiline: false,
			    placeholder: '响亮的标题' // <= label for the name field
			  }, 
			  content: {
			  	template: (locals)=>{
		  		  var multiline =  {
				    borderBottomWidth: 1,
				    borderLeftWidth: 1,
				    borderRightWidth: 1,
				    borderTopWidth: 1,
				    borderColor: '#a0a0a0',
				    justifyContent: 'flex-start',
				    flex: 3,
				    fontSize: 14,
				    minHeight: 120,
				    padding: 6,
				    marginBottom: 4,
				    marginTop: 20,
				    borderRadius: 4,
				    marginHorizontal: 10,
				  }
				  return <TextInput style={multiline} {...locals} onChangeText={(text)=>{setProps({content: text})}} value={content}/>
				},
			  	autoCorrect : false,
			  	underlineColorAndroid: 'rgba(0,0,0,0)',
			  	maxLength: 300,
			  	selectionColor: 'red',
			  	multiline: true,
			  	numberOfLines: 10,
		      	error: '请输入内容',
				placeholder: '更多的内容' // <= label for the name field
			  }
			}
		};

		return (
			<View style={{flex: 1}}>
				<NavigationBar 
				  title={{title: '发帖', tintColor: 'red', style: {fontSize: 20}}}
		          statusBar={{hidden: false}}
		          style={{height: 45, flex: null}}
		          leftButton={{
		          	title: '返回',
		          	handler: () => {
		          		navigator.pop()
		          	}
		          }}
		          rightButton={{
		            title: '发布',
		            handler: () => {
		              if(valide(title) && valide(content)) {
		              	utils.fetchDeploy(title, content)
		              	.then(f => {
		              		f && navigator.pop()
			              	f && setDiscussProps({
			              		refreshing: true,
			              		hasmore: true,
			              		focusRefresh: true
			              	})
		              	})
		              } else {
		              	utils.toast('标题和内容都不能空哦')
		              }
		            }
		          }}
				/>
				<View style={styles.container}>
				<Form 
					ref="form"
					type={Discuss}
					options={options}
				/>
				</View>
			</View>
		)
	}
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F8F8FF',
  },
  form: {
    
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  disable: {
    backgroundColor: '#ccc',
    borderColor: '#eee',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});