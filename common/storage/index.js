
import {AsyncStorage} from 'react-native'

export default {
	set: (key, val) => new Promise((resolve, reject) => { 
		AsyncStorage.setItem(key, val, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	}),
	get: (key) => new Promise((resolve, reject) => {
		AsyncStorage.getItem(key, (err, rlt) => {
			if (err) {
				reject(err);
			} else {
				resolve(rlt);
			}
		})
	})
}