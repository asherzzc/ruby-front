import {Message} from "element-ui";
import axios from "axios";
import router from "../router";


// 请求拦截器
// 为每个请求加上 Token
axios.interceptors.request.use(config=>{
    const tokentString = window.sessionStorage.getItem('tokenString');
    if (tokentString){
        // 将Token放入请求头中
        // 可到SessionStorage中查看
        // 后端有专门的拦截器拦截查看是否能获取到有效Token
        config.headers['Authorization'] = tokentString;
    }
    return config;
},error => {
    console.log('Token获取失败 请检查该模块是否正常');
});


// 拦截器编写
//当成功调用到接口时
axios.interceptors.response.use(success=>{
    //这里的成功指的是成功调用到了后端接口 但是否能够使用还需要判断
    if (success.status && success.status === 200){
        //这里基本上是调用时可发生错误的一个基本囊括，也就是说，后续基本只需要返回处理后的信息即可
        if (success.data.code === 400 || success.data.code === 401 || success.data.code === 403 || success.data.code === 500){
            //当状态码非正常时 返回错误信息
            Message.error({message: success.data.message});
            return;
        }
        //基本成功的信息
        if (success.data.message){
            Message.success({message: success.data.message})
        }
    }
    //返回具体数据
    return success.data;


    //当前端页面调用后端接口失败时进行的响应处理
},error => {
    //对会出现的常见状态码进行判断处理
    if (error.response.code === 504 || error.response.code === 404){
        Message.error({message: '服务器找不到相应信息'})
    }else if (error.response.code === 403){
        Message.error({message: '抱歉，你没有权限访问'})
    }else if (error.response.code === 500){
        Message.error({message: '服务器异常'})
    }else if (error.response.code === 401){
        Message.error({message: '请先登录再操作'});
        router.replace('/');
    }else {
        //当异常状态码没有时，就查看是否有返回的信息
        if (error.response.data.message){
            Message.error({message: error.response.data.message})
        }else{
            Message.error({message: '未知异常'})
        }
    }
    return;
})


//  ================  请求方法封装 ==================  //

// 请求扩展
let baseUrl = '';
//封装POST请求
export const postRequest = (url,param) =>{
    return axios({
        method: 'post',
        url: `${baseUrl}${url}`,
        data: param
    })
};

//封装GET请求
export const getRequest = (url,params) =>{
    return axios({
        method: 'get',
        url: `${baseUrl}${url}`,
        data: params
    })
};
// 封装DELETE请求
export const deleteRequest = (url,params) =>{
  return axios({
      method: 'delete',
      url:  `${baseUrl}${url}`,
      data: params
  })
};
// 封装PUT请求
export const putRequest = (url,params) =>{
    return axios({
        method: 'put',
        url:  `${baseUrl}${url}`,
        data: params
    })
};