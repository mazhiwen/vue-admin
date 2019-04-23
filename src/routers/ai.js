
const routers = [{
  name: 'ai',
  path: '/ai',
  meta: { title: '人工智能' },
  component: resolve => require(['views/ai'], resolve),
  children: [
    {
      name: 'ai.summary',
      path: 'summary',
      meta: { title: '概览 - 人工智能' },
      component: resolve => require(['views/ai/summary'], resolve)
    },
    {
      name: 'ai.img',
      path: 'img',
      meta: { title: '图像识别' },
      component: resolve => require(['views/ai/img'], resolve)
    },
    {
      name: 'ai.qa',
      path: 'qa',
      meta: { title: '催收质检' },
      component: resolve => require(['views/ai/qa'], resolve)
    }

  ],
}]

export default routers
    