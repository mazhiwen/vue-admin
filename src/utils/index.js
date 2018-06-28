import Vue from 'vue';
import eventBus from './event-bus';
import axiosConfig from './axios-config';
import storageHelper from './storage-helper';
import { appName, authMobile, authToken, xMerchantId,userPassword } from 'configs';
import { prefix } from 'api'
import cookie from './cookie';
import commonRequest from './commonRequest';
import paramsFormat from './paramsFormat';

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
  router.push({ name: 'login'});
  storageHelper.removeItem(authToken);
  storageHelper.removeItem(authMobile);
  cookie.set('status','exit');
  // if(window.location.href.includes('console')){
  //   window.location.href="https://www.tianmianlab.com/user.html";

  // }else{
  //   window.location.href="https://admin-dev.wolaidai.com/dust-web/user.html";

  // }
 
}

function auth (to, from, next) {
  // console.log(to);
  if (!to.meta.unauth&&!storageHelper.getItem(authToken)) {
    // if(cookie.get(authToken)){
    //   storageHelper.setItem(authToken, cookie.get(authToken), { expire: 0.5 });
    //   storageHelper.setItem(authMobile,  cookie.get(authMobile), { expire: 0.5 });
    //   storageHelper.setItem(userPassword,cookie.get(userPassword), { expire: 0.5 });
    //   storageHelper.setItem(xMerchantId, cookie.get(xMerchantId), { expire: 0.5 });
    // }else{
      Vue.prototype.$Notice.info({
        desc: '您的会话已过期，请重新登录'
      })
      next({ name: 'login'});
    // } 
  }
}

function exportData(params, url) {
  params[authMobile] = storageHelper.getItem(authMobile)
  params[authToken] = storageHelper.getItem(authToken)
  params[xMerchantId] = storageHelper.getItem(xMerchantId)
  let exportUrl = prefix + url
  var temp = document.createElement("form");
  temp.action = exportUrl
  temp.method = "post"
  for(let key in params) {
    let input = document.createElement("input")
    input.setAttribute('name',key)
    input.setAttribute('value',params[key])
    temp.appendChild(input)
  }
  document.body.appendChild(temp)
  temp.style.display = "none"
  temp.submit()
}

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
  paramsFormat
}

module.exports.default = module.exports = utils
