import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import db from '../storage'

var t = require('tcomb-form-native');
var Form = t.form.Form;

var Student = t.struct({
  id: t.String,              // a required string
  password: t.String  // an optional string
});

var options = {
	auto: 'placeholders',

	fields: {
	  id: {
	  	underlineColorAndroid: 'rgba(0,0,0,0)',
	  	autoCorrect: false,
	  	error: '请输入学号',
      keyboardType: 'numeric',
	    placeholder: '学号' // <= label for the name field
	  }, password: {
	  	underlineColorAndroid: 'rgba(0,0,0,0)',
      autoCorrect: false,
      password: true,
	  	secureTextEntry: true,
      error: '请输入密码',
		  placeholder: '密码' // <= label for the name field
	  }
	}
}; // optional rendering options (see documentation)

import utils from '../utils'

export default class AwesomeProject extends Component {
	_login() {
    const {enable} = this.state;
    const {setParentState} = this.props;
		var val = this.refs.form.getValue();
		if(val && val.id && val.password && enable) {
      this.setState({enable: false})
			utils.fetchLoginAction(val.id, val.password)
			.then(token => {
        if(token) {
          Promise.all(db.set('token', token), db.set('user', val.id.trim()))
          .then(()=>{

          }, (err)=>{
            alert(err.message);
          })
          utils.toast('登录成功')
          setParentState({login: true})  
        } else {
          utils.toast('登录失败')
          this.setState({enable: true})
        }
      })
		}
	}
  state = {
    enable: true
  }
	render() {
    const {enable} = this.state;
		return (
			<View style={styles.container}>
        <View style={styles.form}>
  			  <Form ref="form" type={Student} options={options} />
          <TouchableHighlight style={[styles.button, !enable && styles.disable]} onPress={this._login.bind(this)} underlayColor='#99d9f4'>
            <Text style={[styles.buttonText]}>登录</Text>
          </TouchableHighlight>
        </View>
      </View>
		)
	}
	shouldComponentUpdate() {
		return true;
	}

}

var styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  form: {
    position: 'relative',
    top: -80
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
