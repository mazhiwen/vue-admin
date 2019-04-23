import storageHelper from './storage-helper';

import {checkItemInfo } from 'configs';


let logOutOperate=function(){


  storageHelper.removeItem('x-user-token');
  storageHelper.removeItem('x-user-mobile');
  storageHelper.removeItem(checkItemInfo);
}


export {
  logOutOperate
}