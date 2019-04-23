
const configs = {
  base: 'data',
  appName: '天冕大数据风控实验室',
  authToken: 'x-user-token',
  authMobile: 'x-user-mobile',
  xMerchantId:'x-merchant-id',
  storagePrefix: 'data',
  checkItemInfo:'checkItemInfo',
  userPassword:'userPassword',
  merchantAuth:'x-merchant-auth',
  identificationTypeMap:{
    'id_handheld_proof':'手持身份证'
  },
  searchKeyNameMap : {
    account:'账号',
    mobile:'手机号',
    name:'姓名',
    cnid:'身份证',
    degree:'学历',
    bankcardNo:'银行卡号',
    liaison1:'联系人1电话',
    liaison2:'联系人2电话',
    liaison3:'联系人3电话',
    idCard:'驾驶证',
    plateNumber:'车牌号',
    plateType:'车牌类型',
    owner:'车辆所有人',
    identificationType:'识别类型',
    base64Str:'图片',
  },
  flagsArray:{
    '#19be6b':{
      type:'ios-flag',
      label:'绿'
    },
    '#2db7f5':{
      type:'ios-flag',
      label:'蓝'
    },
    '#ff9900':{
      type:'ios-flag',
      label:'橙'
    },
    '#ed4014':{
      type:'ios-flag',
      label:'红'
    },
    'gray':{
      type:'ios-flag-outline',
      label:'未标记'
    }
  }
}
module.exports.default = module.exports = configs
  