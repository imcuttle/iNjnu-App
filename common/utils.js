
import db from './storage'

import {Platform} from 'react-native'
var Toast = Platform.select({
  ios: () => require('react-native-root-toast'),
  android: () => require('react-native').ToastAndroid,
})();


var host = "http://192.168.2.100:9669";
var DEV = true


var utils = {
	isLogin: function() {
		db.set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE5MTMwMTI2IiwicGFzc3dvcmQiOiJwaWd5YzY3MDgifQ.p-WzUJ5ZGCKotpiR_FMpgop1n3YZZAzhSLUeB0qxHWM')
		return db.get('token')
		.then(token=>{
			return this.fetchCheckTocken(token);
			//return login;
		})
		.catch(err=>{
			return false;
		})
	},
	fetchCheckTocken: function(token) {
		return new Promise((resolve, reject) => {
			!token && resolve(false)
			fetch(this.urls.checktoken, {
				method: 'POST',
				headers: {
					authorization: token
				}
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					resolve(true)
				} else {
					resolve(false)
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				resolve(false)
			})
		})
	},
	fetchDeploy(title, content) {
		return db.get('token').then((token) => 
			fetch(this.urls.discussdeploy, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				},
				body: JSON.stringify({title, content})
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					this.toast(json.result);
					return true;
				} else {
					this.toast(json.result);
					return false;
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return false
			})
		)
	},
	fetchLoginAction(id, pwd) {
		return new Promise((resolve, reject) => {
			fetch(this.urls.login, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
				},
				body: JSON.stringify({id, password: pwd})
			})
			.then(res => {
				return res.json()
			})
			.then(json=>{
				if(json.code===200) {
					resolve(json.result)
				} else {
					this.toast(json.result);
					resolve(null)
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				resolve(null)
			})
		})
	},
	fetchDiscussList(page, size, previd) {
		return db.get('token').then((token) => 
			fetch(`${this.urls.discusslist}?page=${page}&size=${size}${previd!=null?`&prev=${previd}`:''}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				}
			})
			.then(res => {
				return res.json()
			})
			.then(json=>{
				if(json.code===200) {
					return (json.result)
				} else {
					this.toast(json.result);
					return []
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return []
			})
		)
	},
	fetchDiscussMain(id, page, size, prev, onlycomment) {
		return db.get('token').then((token) => 
			fetch(this.urls.discussmain+'?'+this.urlStringify({id, page, size, prev, onlycomment}), {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				}
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					return db.get('user').then(selfId=>{return {
						selfId,
						...json.result
					}});
				} else {
					this.toast(json.result);
					return;
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return
			})
		)
	},
	fetchCommentPut(content, forid) {
		return db.get('token').then((token) => 
			fetch(this.urls.commentput, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				},
				body: JSON.stringify({forid, content})
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					this.toast(json.result);
					return true;
				} else {
					this.toast(json.result);
					return false;
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return false;
			})
		)
	},
	fetchLookupScore(info) {
		return db.get('token').then((token) => 
			fetch(this.urls.lookupscore+'?'+this.urlStringify({info}), {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				}
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					//this.toast(json.result);
					return json.result;
				} else {
					this.toast(json.result);
					return;
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return
			})
		)
	},
	fetchDelComment(id) {
		return db.get('token').then((token) => 
			fetch(this.urls.delcomment, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				},
				body: JSON.stringify({id})
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					this.toast(json.result);
					return true;
				} else {
					this.toast(json.result);
					return false;
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return false;
			})
		)
	},
	fetchDelDiscuss(id) {
		return db.get('token').then((token) => 
			fetch(this.urls.deldiscuss, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				},
				body: JSON.stringify({id})
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					this.toast(json.result);
					return true;
				} else {
					this.toast(json.result);
					return false;
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return false;
			})
		)
	},
	fetchInfo(id) {
		return db.get('token').then((token) => 
			fetch(this.urls.infoget+'?'+this.urlStringify({id}), {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'authorization': token
				},
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
					// this.toast(json.result);
					return json.result;
				} else {
					this.toast(json.result);
					return;
				}
			}).catch(err=>{
				DEV && this.toast(err.message)
				return;
			})
		)
	},
	urlStringify(json) {
		return Object.getOwnPropertyNames(json).map(k=>k+'='+(!!json[k]?json[k]:'')).join('&')
	},
	urls: {
		deldiscuss: host+'/api/discuss/del',
		infoget: host+'/api/info/get',
		delcomment: host+'/api/comment/del',
		lookupscore: host+'/api/lookup/score',
		commentput: host+'/api/comment/put',
		discussmain: host+'/api/discuss/get',
		discussdeploy: host+'/api/discuss/put',
		discusslist: host+'/api/discuss/list',
		checktoken: host+'/protect/checktoken',
		login: host+'/api/user/login'
	},
	toast(msg) {
		var opt;
		if(Platform.os==='ios') {
			opt = {
			    duration: Toast.durations.SHORT,
			    position: Toast.positions.BOTTOM,
			    shadow: true,
			    animation: true,
			    hideOnPress: false,
			    delay: 0,
			    onShow: () => {
			        // calls on toast\`s appear animation start
			    },
			    onShown: () => {
			        // calls on toast\`s appear animation end.
			    },
			    onHide: () => {
			        // calls on toast\`s hide animation start.
			    },
			    onHidden: () => {
			        // calls on toast\`s hide animation end.
			    }
			}
		} else {
			opt = Toast.SHORT
		}
		Toast.show(msg, opt);
	}
}

export default utils;