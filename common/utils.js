
import db from './storage'

import {Platform} from 'react-native'
import qs from 'querystring'
var Toast = Platform.select({
  ios: () => require('react-native-root-toast'),
  android: () => require('react-native').ToastAndroid,
})();

var address = "202.119.104.195"
var host = "http://"+address;
// db.set('host', )
var DEV = true
var ImagePicker = require('react-native-image-picker');

var utils = {
	DEV,
	host: address,
	imagePick(title, opts) {
		var options = {
          title: title || '请选择照片',
          cancelButtonTitle: '取消',
          takePhotoButtonTitle: '拍照',
          chooseFromLibraryButtonTitle: '选择照片',
          quality: 1.0,
          allowsEditing: false,
        };
        return new Promise((resolve, reject) => {
        	if(this.__imgpickLock===true) {
	        	resolve(false);
	        	return
	        }
	        this.__imgpickLock = true
        	ImagePicker.showImagePicker({...options, ...opts}, (response) => {
        	  this.__imgpickLock = false
	          console.log('Response = ', response);

	          if (response.didCancel) {
	            console.log('User cancelled image picker');
	          }
	          else if (response.error) {
	          	DEV && this.toast(response.error)
	            console.log('ImagePicker Error: ', response.error);
	          }
	          else if (response.customButton) {
	            console.log('User tapped custom button: ', response.customButton);
	          } else {
	            // You can display the image using either data...
	            const source = {uri: `data:${response.type};base64,` + response.data, isStatic: true};

	            /*
	            // or a reference to the platform specific asset location
	            if (Platform.OS === 'ios') {
	              const source = {uri: response.uri.replace('file://', ''), isStatic: true};
	            } else {
	              const source = {uri: response.uri, isStatic: true};
	            }
	            */

	            source.size = response.fileSize;
	            source.type = response.type;
	            resolve(source)
	          }

	          if(response.didCancle) {
	          	resolve(false)
	          } else if(response.error) {
	          	reject(response.error)
	          }

	          
	        });
        })
        
	},
	isLogin: function() {
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
	fetchUserDiscussList(id, page, size, prev) {
		return db.get('token').then((token) => 
			fetch(`${this.urls.discusslist}?${this.urlStringify({id, page, size, prev})}`, {
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
	fetchUploadBase64Head(data) {
		return db.get('token').then((token) => 
			fetch(this.urls.upbase64head, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/x-www-form-urlencoded',
    				'authorization': token
				},
				body: qs.stringify({data})
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
	fetchUpdateSign(sign) {
		return db.get('token').then((token) => 
			fetch(this.urls.infoset, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/x-www-form-urlencoded',
    				'authorization': token
				},
				body: qs.stringify({sign})
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
	fetchFaceBase64(data, type, size) {
		return db.get('token').then((token) => 
			fetch(this.urls.facebase64, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/x-www-form-urlencoded',
    				'authorization': token
				},
				body: qs.stringify({data,type,size})
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
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
	fetchFaceUrl(data) {
		return db.get('token').then((token) => 
			fetch(this.urls.faceurl, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
    				'Content-Type': 'application/x-www-form-urlencoded',
    				'authorization': token
				},
				body: qs.stringify({data})
			})
			.then(res => res.json())
			.then(json=>{
				if(json.code===200) {
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
	defaultScheduleYear() {return (new Date().getMonth()>=2)?new Date().getFullYear():new Date().getFullYear()-1},
	defaultScheduleTerm() {return (new Date().getMonth()>=8)?1:0},
	fetchSchedule(year=this.defaultScheduleYear(), term=this.defaultScheduleTerm()) {
		return db.get('token').then((token) =>
			fetch(this.urls.faceurl+'?'+this.urlStringify({year, term}), {
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
		schedule: host+'/api/schedule',
		facebase64: host+'/api/face/base64',
		faceurl: host+'/api/face/url',
		infoset: host+'/api/info/set',
		upbase64head: host+'/api/upload/head/base64',
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