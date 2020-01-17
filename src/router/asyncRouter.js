//动态路由
import Layout from '../pages/layout'

let router0 = [{
    path: '/p',
    component: Layout,
    meta: { title: '停车管理', icon: 'parking',roles: ['admin']},
    children: [{
      path: 'park/manage',
      component: require('@/pages/app/parkInfo/Manage.vue'),
      name: 'park:manage',
      meta: { title: '停车场管理',roles: ['admin']}
    }, {
      path: 'accessInfo/manage',
      component: require('@/pages/app/accessInfo/Manage.vue'),
      name: 'accessInfo:manage',
      meta: { title: '停车流水',roles: ['admin']}
    },{
      path: 'require/manage',
      component: require('@/pages/app/requireCode/Manage.vue'),
      name: 'require:manage',
      meta: { title: '停车场邀请码',roles: ['admin']}
    }],
  },
  {
    path: '/f',
    component: Layout,
    meta: { title: '支付结算', icon: 'finance', roles: ['admin']},
    children: [{
        path: 'settleAccount/manage',
        component: require('@/pages/app/settleAccount/Manage.vue'),
        name: 'settleAccount:manage',
        hidden:true,
        meta: { title: '收款账户管理',roles: ['admin']}
      },
      {
        path: 'merchantInfo/formShow',
        component: require('@/pages/app/merchantInfo/FormShow.vue'),
        name: 'merchantInfo:formShow',
        meta: { title: '帐户信息',roles: ['admin']}
      },
      {
        path: 'payOrder/manage',
        component: require('@/pages/app/payOrder/Manage.vue'),
        name: 'payOrder:manage',
        meta: { title: '支付记录',roles: ['admin']},
      },

      {
        path: 'parkingBill/manage',
        component: require('@/pages/app/parkingBill/Manage.vue'),
        name: 'parkingBill:manage',
        meta: { title: '临停帐单',roles: ['admin']},
        params: {
          bizType: 1
        }
      },
      {
        path: 'bookingBill/manage',
        component: require('@/pages/app/parkingBill/Manage.vue'),
        name: 'bookingBill:manage',
        meta: { title: '预约帐单',roles: ['admin']},
        params: {
          bizType: 2
        }
      },

      {
        path: 'takeoutRecord/manage',
        component: require('@/pages/app/takeoutRecord/Manage.vue'),
        name: 'takeoutRecord:manage',
        meta: { title: '提现记录',roles: ['admin']}
      },

      // {
      //   path: 'takeoutRecord/managePayList',
      //   component: require('@/pages/app/parkingBill/ManagePayList.vue'),
      //   name: 'managePayList:manage',
      //   meta: { title: '查看明细',roles: ['admin']}
      // },
      // {
      //   path: 'takeoutRecord/applyTakeout',
      //   component: require('@/pages/app/parkingBill/ManagePayList.vue'),
      //   name: 'applyTakeout:manage',
      //   meta: { title: '申请提现',roles: ['admin']}
      // }
    ]
  },
  {
    path: '/act',
    component: Layout,
    meta: { title: '活动及营销', icon: 'promotion',roles: ['admin']},
    children: [{
      path: 'promotionDispatchChannel/manage',
      component: require('@/pages/app/act/promotionDispatchChannel/Manage.vue'),
      name: 'promotionDispatchChannel:manage',
      meta: { title: '商户管理',roles: ['admin']}
    }, {
      path: 'promotion/manage',
      component: require('@/pages/app/act/promotionInfo/Manage.vue'),
      name: 'promotion:manage',
      meta: { title: '优惠管理',roles: ['admin']}
    }, {
      path: 'couponBatch/manage',
      component: require('@/pages/app/act/promotionCouponBatch/Manage.vue'),
      name: 'couponBatch:manage',
      meta: { title: '优惠券派发',roles: ['admin']}
    }, {
      path: 'coupon/manage',
      component: require('@/pages/app/act/promotionCoupon/Manage.vue'),
      name: 'coupon:manage',
      meta: { title: '优惠券',roles: ['admin']}
    }],
  },
  {
    path: '/r',
    component: Layout,
    meta: { title: '订单及报表', icon: 'cart',roles: ['admin','user']},
    children: [{
        path: 'bookingOrder/manage',
        component: require('@/pages/app/bookingOrder/Manage.vue'),
        name: 'bookingOrder:manage',
        meta: { title: '预约订单',roles: ['admin', 'user']}
      },
      {
        path: 'parkingOrder/manage',
        component: require('@/pages/app/parkingOrder/Manage.vue'),
        name: 'parkingOrder:manage',
        meta: { title: '停车订单',roles: ['admin', 'user']}
      }
      // , {
      //   path: 'coupon/report',
      //   component: require('@/pages/app/report/CouponReport.vue'),
      //   name: 'coupon:report',
      //   meta: { title: '优惠券统计',roles: ['admin']},
      // }
    ]
  }
]

export const asyncRouter = [].concat(router0)


// export const asyncRouter = sysRouter
