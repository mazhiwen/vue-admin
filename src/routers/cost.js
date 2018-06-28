
const routers = [{
  name: 'cost',
  path: '/cost',
  meta: { title: '费用' },
  component: resolve => require(['views/cost'], resolve),
  children: [],
}]

export default routers
    