
const routers = [{
  name: 'creditscore',
  path: '/creditscore',
  meta: { title: '信用评分' },
  component: resolve => require(['views/creditscore'], resolve),
  children: [
    {
      name: 'creditscore.summary',
      path: 'summary',
      meta: { title: '概览 - 信用评分' },
      component: resolve => require(['views/creditscore/summary'], resolve)
    },
    {
      name: 'creditscore.gold',
      path: 'gold',
      meta: { title: '小额分' },
      component: resolve => require(['views/creditscore/gold'], resolve)
    },
    {
      name: 'creditscore.synthetical',
      path: 'synthetical',
      meta: { title: '综合分' },
      component: resolve => require(['views/creditscore/synthetical'], resolve)
    },
    {
      name: 'creditscore.duodai',
      path: 'duodai',
      meta: { title: '多贷分' },
      component: resolve => require(['views/creditscore/duodai'], resolve)
    },
    {
      name: 'creditscore.fraudscore',
      path: 'fraudscore',
      meta: { title: '欺诈分' },
      component: resolve => require(['views/creditscore/fraudscore'], resolve)
    }
    

  ],
}]

export default routers
    