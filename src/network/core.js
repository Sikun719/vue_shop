import axios from "axios";
import { METHOD } from "./config";
//高内聚低耦合

//通过配置对象返回一个axios实例对象
const instance = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",
  timeout: 10000
})


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});


export function request(method, url, params) {
  switch (method) {
    case METHOD.GET:
      return GET(url, params);
    case METHOD.POST:
      return POST(url, params);
  }
}

function GET(url, params) {
  //instance.get()函数返回值是Promise对象
  return instance.get(url, params);
}

function POST(url, params) {
  return instance.post(url, params);
}

