import axios from 'axios';
import storageHelper from './storage-helper';
import { checkItemInfo } from 'configs';

function getCheckItemInfo(){
  return new Promise(function(resolve, reject){
    if(storageHelper.getItem(checkItemInfo)){
      resolve(storageHelper.getItem(checkItemInfo));
    }else{
      axios.get('v1/loan_applications/getCheckItemInfo')
        .then(res=>{
          storageHelper.setItem(checkItemInfo, res.data, { expire: 0.5 });
          resolve(res.data);
        })
    }
    
  })
}
function getCheckItemObj(){
  return new Promise(function(resolve, reject){
    getCheckItemInfo().then((res)=>{
      let businessType={};
      let businessValue=[];
      res.forEach((v,k)=>{
        businessType[v.type]=v.name;
        businessValue.push(v.name);
      });
      let checkItemInfoList=res;
      resolve({businessType,checkItemInfoList,businessValue});

    });



  });
}
export default  {
  getCheckItemInfo,
  getCheckItemObj


}
