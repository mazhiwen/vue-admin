
const routers = [{
  name: 'consoles',
  path: '/consoles',
  meta: { title: '人工智能' },
  component: resolve => require(['views/consoles'], resolve),
  children: [
    {
      name: 'consoles.summary',
      path: 'summary',
      meta: { title: '概览 - 人工智能' },
      component: resolve => require(['views/consoles/summary'], resolve)
    },
    {
      name: 'consoles.custom',
      path: 'custom/:id',
      meta: { title: '概览 - 人工智能' },
      component: resolve => require(['views/consoles/custom'], resolve)
    },
    {
      name: 'consoles.records',
      path: 'records',
      meta: { title: '概览 - 人工智能' },
      component: resolve => require(['views/consoles/records'], resolve)
    }


  ],
}]

export default routers
    