
const routers = [{
  name: 'accesskey',
  path: '/accesskey',
  meta: { title: 'accesskey' },
  component: resolve => require(['views/accesskey'], resolve),
  children: [],
}]

export default routers
    