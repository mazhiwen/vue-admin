
const routers = [{
  name: 'car',
  path: '/car',
  meta: { title: '车辆信息' },
  component: resolve => require(['views/car'], resolve),
  children: [
    {
      name: 'car.summary',
      path: 'summary',
      meta: { title: '概览 - 车辆信息' },
      component: resolve => require(['views/car/summary'], resolve)
    },
    {
      name: 'car.drive',
      path: 'drive',
      meta: { title: '驾驶证信息' },
      component: resolve => require(['views/car/drive'], resolve)
    },
    {
      name: 'car.passport',
      path: 'passport',
      meta: { title: '行驶证信息' },
      component: resolve => require(['views/car/passport'], resolve)
    }

  ],
}]

export default routers
    