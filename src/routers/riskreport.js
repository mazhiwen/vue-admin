
const routers = [{
  name: 'riskreport',
  path: '/riskreport',
  meta: { title: '风控报告' },
  component: resolve => require(['views/riskreport'], resolve),
  children: [
    {
      name: 'riskreport.summary',
      path: 'summary',
      meta: { title: '概览 - 风控报告' },
      component: resolve => require(['views/riskreport/summary'], resolve)
    },
    {
      name: 'riskreport.check',
      path: 'check',
      meta: { title: '风控报告' },
      component: resolve => require(['views/riskreport/check'], resolve)
    }

  ],
}]

export default routers
    