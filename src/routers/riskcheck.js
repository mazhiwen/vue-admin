
const routers = [{
  name: 'riskcheck',
  path: '/riskcheck',
  meta: { title: '风险核查' },
  component: resolve => require(['views/riskcheck'], resolve),
  children: [
    {
      name: 'riskcheck.summary',
      path: 'summary',
      meta: { title: '概览 - 风险核查' },
      component: resolve => require(['views/riskcheck/summary'], resolve)
    },
    {
      name: 'riskcheck.check',
      path: 'check',
      meta: { title: '风险人员' },
      component: resolve => require(['views/riskcheck/check'], resolve)
    },
    {
      name: 'riskcheck.label',
      path: 'label',
      meta: { title: '风险标签' },
      component: resolve => require(['views/riskcheck/label'], resolve)
    }

  ],
}]

export default routers
    