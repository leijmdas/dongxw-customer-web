//动态路由
import Layout from '../pages/layout'

let router0 = [{
    path: '/order',
    component: Layout,
    meta: { title: '订单信息', icon: 'finance',roles: ['admin']},
    children: [{
      path: 'customer/order/manage',
      component: require('@/pages/customer/order/Manage.vue'),
      name: 'order:manage',
      meta: { title: '订单信息',roles: ['admin']}
    }, {
      path: 'customer/order/ManagePlan',
      component: require('@/pages/customer/order/ManagePlan.vue'),
      name: 'order:managePlan',
      meta: { title: '生产进度表',roles: ['admin']}
    } ]
  },

]

export const asyncRouter = [].concat(router0)


// export const asyncRouter = sysRouter
