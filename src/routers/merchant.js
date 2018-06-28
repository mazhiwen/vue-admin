
const routers = [{
  name: 'merchant',
  path: '/merchant',
  meta: { title: 'merchant' },
  component: resolve => require(['views/merchant'], resolve),
  children: [
    {
      name: 'merchant.list',
      path: 'list',
      meta: {title: '概览'},
      component: resolve => require(['views/merchant/list'], resolve)
    },
    {
      name: 'merchant.edit',
      path: 'edit/:id',
      meta: {title: '概览'},
      component: resolve => require(['views/merchant/edit'], resolve)
    }
  ],
}]

export default routers
    