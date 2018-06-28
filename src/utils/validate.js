/*
*
* Welab 公共验证枚举
* @rachel
*/
const regs = {
  'mobile':{
    'reg': /^1[3|4|5|7|8][0-9]\d{8}$/,
    'errorMessage': '请输入正确的手机号码'
  },
  'invite_code':{
    'reg': /^1[3|4|5|7|8][0-9]\d{8}$/,
    'errorMessage': '请输入正确邀请码'
  },
  'otp6':{
    'reg': /^\d{6}$/,
    'errorMessage': '错误的验证码'
  },
  'knowLengthOtp':{
    'reg': /^\S+$/,
    'errorMessage': '错误的验证码'
  },
  'name':{
    'reg': /^[\u4e00-\u9fa5]([\u4e00-\u9fa5]{0,24}\u00b7{0,1}[\u4e00-\u9fa5]{1,24})+$/,
    'errorMessage': '请输入正确的姓名'
  },
  'cnid':{
    'reg': /^(\d|x|X){18}$/,
    'errorMessage': '请输入正确的身份证号码'
  },
  'bankcardNo':{
    'reg': /^\d+$/,
    'errorMessage': '请输入正确的银行卡号'
  },
  'captcha':{
    'reg': /^\S+$/,
    'errorMessage': '请输入验证码'
  },
  'degree':{
    'reg': /^\S+$/,
    'errorMessage': '请选择学历'
  },
  'liaison1':{
    'reg': /^\S+$/,
    'errorMessage': '请输入联系人1电话'
  }
};

export default function validate(name, value){
  var validateResult = {result:true, errorMessage:''};
  let reg = regs[name];
  // let reg = global.validaterRegs[name] || regs[name];
  if (reg) {
    var result = null != value && value!==''  && reg['reg'].test(value);
    var errorMessage = reg['errorMessage'];
    validateResult = {result:result, errorMessage:errorMessage};
  }
  return validateResult;
}