import Vue from 'vue';
import eventBus from './event-bus';
import axiosConfig from './axios-config';
import storageHelper from './storage-helper';
import { 
  appName, checkItemInfo,authMobile, 
  authToken, xMerchantId,userPassword,merchantAuth 
} from 'configs';
import { prefix } from 'api'
import cookie from './cookie';
import axios from 'axios';
import commonRequest from './commonRequest';
import qs from 'qs';
import {logOutOperate} from './logout';
import {
  dataFormat,
  validator as validatorOrigin
} from 'utility-mar';
import copy from './copy';
import { menusOrigin } from 'statics/menus';

function setTitle(title) {
  title = title ? `${title} - ${appName}` : appName;
  window.document.title = title;
}

function arrayToKeyMap(key,array) {
  var keyMap = {}
  array.forEach(item => {if (item[key]!==undefined) keyMap[item[key]] = item})
  return keyMap
}

function repeat(item,length) {
  let result = [];
  for (let i=0; i<length; i++) result.push(item)
  return result
}


function logout (router) {
  

  logOutOperate();
  cookie.set('status','exit');
  router.push({ name: 'login'});
  toWebHome();
 
}
function toWebHome(){
  // if(window.location.href.includes('console')){
  if(process.env.NODE_ENV=='production'){
    window.location.href='https://www.THECOMPANYlab.com/user.html';
  }else{
    window.location.href=`https://${location.hostname}/dust-web/user.html`;

  }
}
function auth (to, from, next) {
  if(resetToken()){
    if(to.name=='login'){
      next({name:'home'});
    }
  }else{
    if(!to.meta.unauth){
      Vue.prototype.$Notice.info({
        desc: '您的会话已过期，请重新登录'
      })
      logOutOperate();
      next({ name: 'login'});
    }
  }
}
function resetToken(){
  let token = cookie.get(authToken);
  if(token){
    storageHelper.setItem(authToken, cookie.get(authToken), { expire: 0.5 });
    storageHelper.setItem(authMobile,  cookie.get(authMobile), { expire: 0.5 });
    storageHelper.setItem(userPassword,cookie.get(userPassword), { expire: 0.5 });
    storageHelper.setItem(xMerchantId, cookie.get(xMerchantId), { expire: 0.5 });
  }else{
    token = storageHelper.getItem(authToken);
  }
  return token;
}

function exportData(params, url) {
  params[authMobile] = storageHelper.getItem(authMobile)
  params[authToken] = storageHelper.getItem(authToken)
  params[xMerchantId] = storageHelper.getItem(xMerchantId)
  params[merchantAuth] = storageHelper.getItem(merchantAuth)
  
  axios.post(url,qs.stringify(params),{
    responseType:'blob',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    useOrigin:true
  })
    .then((res)=> {
      const blob = new Blob([res.data])
      const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]);
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }

    })
}

function updateConsoleMenus(modelMenu){
  let newMenus=copy.deepCopy(menusOrigin);
  let modelMenuParsed={
    label: '工作台',
    icon:'logo-dropbox',
    name: 'consoles',
    children: [
      {label: '概览',name: 'consoles.summary'},
      {label: '查询记录',name: 'consoles.records'},
    ]
  };
  modelMenu.map((value,idnex)=>{
    modelMenuParsed.children.push(
      {
        label: value.name,
        name: `consoles.custom_${value.id}`
      }
    );
  });
  newMenus.splice(1,0,modelMenuParsed);
  // this.renderNewMenu(newMenus);
  return newMenus;
  
}


let validator=new validatorOrigin({
  patterns:{
    'mobile':{
      'pattern': /^1\d{10}$/,
      'errorMessage': '请输入正确的手机号码'
    },
    'liaison1':{
      'pattern': /^1\d{10}$/,
      'errorMessage': '请输入正确的联系人'
    },
    'liaison2':{
      'pattern': /^1\d{10}$/,
      'errorMessage': '请输入正确的联系人'
    },
    'liaison3':{
      'pattern': /^1\d{10}$/,
      'errorMessage': '请输入正确的联系人'
    },
  },
  errorHandler:({desc})=>{
    Vue.prototype.$Notice.warning({
      title:'输入错误',
      //msg取传入，没有取默认
      desc
    })
  }
});

const utils = {
  auth,
  repeat,
  logout,
  setTitle,
  eventBus,
  axiosConfig,
  storageHelper,
  arrayToKeyMap,
  exportData,
  commonRequest,
  toWebHome,
  cookie,
  copy,
  dataFormat,
  updateConsoleMenus,
  validator
}

module.exports.default = module.exports = utils
