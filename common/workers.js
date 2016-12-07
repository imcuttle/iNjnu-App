import {
	NetInfo
} from 'react-native'

import utils from './utils'
import storage from './storage'

require('./wsChat')

NetInfo.isConnected.addEventListener('change', (isConnected) => {
	// !isConnected && utils.toast("已断开网络连接")
})

