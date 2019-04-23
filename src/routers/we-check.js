
const routers = [{
  name: 'we-check',
  path: '/we-check',
  meta: { title: '卫验分' },
  component: resolve => require(['views/we-check'], resolve),
  children: [{
    name: 'we-check.overview',
    path: 'overview',
    meta: {title: '概览'},
    component: resolve => require(['views/we-check/overview'], resolve)
  },{
    name: 'we-check.three-elements-check',
    path: 'three-elements-check',
    meta: {title: '身份信息评估'},
    component: resolve => require(['views/we-check/three-elements-check'], resolve)
  },{
    name: 'we-check.bankcard-check',
    path: 'bankcard-check',
    meta: {title: '银行卡评估'},
    component: resolve => require(['views/we-check/bankcard-check'], resolve)
  },{
    name: 'we-check.contacts-check',
    path: 'contacts-check',
    meta: {title: '联系人评估'},
    component: resolve => require(['views/we-check/contacts-check'], resolve)
  },{
    name: 'we-check.mobilestatus',
    path: 'mobilestatus',
    meta: {title: '手机在网状态'},
    component: resolve => require(['views/we-check/mobilestatus'], resolve)
  },{
    name: 'we-check.mobiletime',
    path: 'mobiletime',
    meta: {title: '手机在网时长'},
    component: resolve => require(['views/we-check/mobiletime'], resolve)
  }],
  
}]

export default routers
  