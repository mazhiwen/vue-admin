export const menusOrigin = [
  {
    label:'主页',
    name:'home',
    icon:'md-home'
  },
  {
    label: '卫验分',
    icon:'md-man',
    name: 'we-check',
    children: [
      {label: '概览',name: 'we-check.overview'},
      {label: '身份信息评估',name: 'we-check.three-elements-check'},
      // {label: '学历评估',name: 'we-check.education-check'},
      {label: '银行卡评估',name: 'we-check.bankcard-check'},
      {label: '联系人评估',name: 'we-check.contacts-check'},
      {label: '手机在网状态',name: 'we-check.mobilestatus'},
      {label: '手机在网时长',name: 'we-check.mobiletime'},
    ]
  },
  {
    label: '风险核查',name: 'riskcheck',children: [
      {label: '概览',name: 'riskcheck.summary'},
      {label: '风险人员',name: 'riskcheck.check'},
      {label: '风险标签',name: 'riskcheck.label'}
    ]
  },
  {
    label: '信用评分',icon:'md-card',name: 'creditscore',children: [
      {label: '概览',name: 'creditscore.summary'},
      {label: '小额分',name: 'creditscore.gold'},
      {label: '综合分',name: 'creditscore.synthetical'},
      {label: '多贷分',name: 'creditscore.duodai'},
      {label: '欺诈分',name: 'creditscore.fraudscore'}
    ]
  },
  {
    label: '风控报告',icon:'md-clipboard',name: 'riskreport',children: [
      {label: '概览',name: 'riskreport.summary'},
      {label: '风控报告',name: 'riskreport.check'}
    ]
  },
  {
    label: '车辆信息',name: 'car',icon:'md-car',children: [
      {label: '概览',name: 'car.summary'},
      {label: '行驶证信息',name: 'car.passport'},
      {label: '驾驶证信息',name: 'car.drive'},
      // {label: '保险信息',name: 'car.insurance'}
    ]
  },
  {
    label: '人工智能',name: 'ai',icon:'ios-cloud-outline',children: [
      {label: '概览',name: 'ai.summary'},
      {label: '图像识别',name: 'ai.img'},
      {label: '催收质检',name: 'ai.qa'}
    ]
  }
]
