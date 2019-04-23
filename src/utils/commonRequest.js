import axios from 'axios';
import storageHelper from './storage-helper';
import { checkItemInfo } from 'configs';

function getCheckItemInfo(){
  return new Promise(function(resolve, reject){
    
    // if(storageHelper.getItem(checkItemInfo)){
    //   resolve(storageHelper.getItem(checkItemInfo));
    // }else{
    axios.get('v1/loan_applications/getCheckItemInfo')
      .then(res=>{
        // storageHelper.setItem(checkItemInfo, res.data, { expire: 0.5 });
        resolve(res.data);
      })
    // }
    
  })
}
function getCheckItemObj(){
  return new Promise(function(resolve, reject){
    getCheckItemInfo().then((res)=>{
      const colorArr=[
        '#D53A35',
        '#334B5C', 
        '#6AB0B8', 
        '#E98F6F', 
        '#91C7AE',
        '#7FAE90',  
        '#CA8622', 
        '#BDA29A',
        '#CA8622', 
        '#6E7074',
        '#996699',
        '#663366',
        '#330033',
        '#6600cc',
        '#cc86ff',
        '#6495ED',
        '#528B8B',
        '#00FFFF',
        '#00CED1'
      ];
      let checkItemInfoList=res;
      let businessType={};
      let businessTypeColor={};
      let businessValue=[];
      let checkItemInfoListValid=[];
      let productIdTypeMap={};
      res.forEach((v,k)=>{
        productIdTypeMap[v.id]=v.type;
        businessType[v.type]=v.name;
        businessTypeColor[v.type]=colorArr[k];
        businessValue.push(v.name);
        v.validFlag==1&&checkItemInfoListValid.push(v);
      });
      resolve({
        productIdTypeMap,
        businessType,
        businessTypeColor,
        checkItemInfoList,
        checkItemInfoListValid,
        businessValue
      });

    });



  });
}





const parentTypeMap={
  ai:'云数据',
  car:'汽车',
  creditscore:'信用',
  risk:'风险',
  validate:'校验',
};
function getProductTree(){
  return new Promise(function(resolve, reject){
    
    if(storageHelper.getItem('productTree')){
      // resolve(storageHelper.getItem('productTree'));
    }else{
      axios.get('v1/model/getMerchantCheckItem',{
        params:{
          userType:'merchant'
        }
      })
        .then(res=>{
          let data=res.data;
          let productTree={};
          let productMap={};
          let productIsBoughtMap = {};
          data.forEach((v,k)=>{
            productMap[v.id]=v.name;
            productIsBoughtMap[v.id]=v.selected;
            if(productTree[v.parentType]){
              productTree[v.parentType]['children'][v.type]={
                id:v.id,
                name:v.name,
                isBought:v.selected
              }
            }else{
              productTree[v.parentType]={
                children:{
                  [v.type]:{
                    id:v.id,
                    name:v.name,
                    isBought:v.selected
                  }
                },
                name:parentTypeMap[v.parentType]
              }
            }
          });
          let result={
            productTree,
            productMap,
            productIsBoughtMap
          };
          // storageHelper.setItem('productTree', result, { expire: 0.5 });
          resolve(result);
        })
    }
    
  })
}





function verifyModelToGenerateReport(params){
  // Object.entries(params.verifyParams).map(([index,value])=>{
  //   if(value===undefined){
  //     params.verifyParams[index]='';
  //   }
  // })
  return axios.post('v1/model/productVerifies/singleVerify/verifyModelToGenerateReport',
    params
  // {
                
  //   modelId:this.modalID,
  //   verifyParams:{...params}
  // }
  );
}

function updateModelProduct({modalID,resArr}){
  return new Promise(function(resolve, reject){
    let modelItems=[];
    resArr.map((value,index)=>{
      modelItems.push({
        checkItemId:value,
        orderNo:index
      });
    })
    axios.post('v1/model/operateModelItem/update',{
      modelItems,
      id:modalID
    })
      .then((res)=>{
        // this.$Notice.success({
        //   title: '提示',
        //   desc:'产品编辑成功'
        // });
        resolve(res.data);
        
      })

  })
  
}

export default  {
  getCheckItemObj,
  getProductTree,
  verifyModelToGenerateReport,
  updateModelProduct

}
