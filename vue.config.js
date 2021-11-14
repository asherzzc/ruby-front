// 定义代理对象
let proxyObject = {};
proxyObject['/'] = {
    // WebSocket配置
    ws: false,
    // 请求头转发路径
    target: 'http://localhost:8081',
    // 修改请求头中的 Host
    changeOrigin: true,
    // 是否需要重写路径
    pathRewrite:{
        '^/':'/'
    }
};

// 在线聊天 代理
proxyObject['/ws'] = {
    ws: true,
    target: 'ws://localhost:8081'
}



module.exports={
    devServer:{
        host: 'localhost',
        port: 8080,
        proxy: proxyObject
    }
};