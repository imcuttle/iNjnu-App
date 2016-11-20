import {
	NetInfo
} from 'react-native'

import utils from './utils'

NetInfo.isConnected.addEventListener('change', (isConnected) => {
	!isConnected && utils.toast("已断开网络连接")
})