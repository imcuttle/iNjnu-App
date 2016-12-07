/**
 * Created by Moyu on 16/11/27.
 */
import utils from './utils'
const DEV = utils.DEV
var ws = new WebSocket('ws://'+utils.host+'/ws');

ws.onopen = () => {
    // 打开一个连接

    ws.send('something'); // 发送一个消息
};

ws.onmessage = (e) => {
    // 接收到了一个消息
    DEV && utils.toast(e.data)
    console.log(e.data);
};

ws.onerror = (e) => {
    // 发生了一个错误
    DEV && utils.toast(e.message)
    console.log(e.message);
};

ws.onclose = (e) => {
    // 连接被关闭了
    DEV && utils.toast('closed')
    // alert(e.reason)
    console.log(e.code, e.reason);
};