import router, { routers } from './router'
import Vue from 'vue'
import { Message } from 'element-ui'
import {asyncRouter} from './router/asyncRouter'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'// progress bar style

import { getToken,setCurrentUserId,init as authInit } from '@/utils/auth' // getToken from cookie
import { fetch,bus } from '@/utils'
import AppService from '@/api/AppService'

NProgress.configure({ showSpinner: false });

const whiteList = ['/login','/forgotPwd','/401','/404']// no redirect whitelist

// permissiom judge function
//资源控制（最小粒度）
function hasPermission(resCode) {
  return router.app.isLogged
}
function hasRole(roleCode){
  let roles = router.app.roles||[]
  
  let tmp = roles.filter(r=>r.roleCode==roleCode)
  return tmp.length>0
}
Vue.prototype.$hasPermission =  hasPermission
Vue.prototype.$hasRole =  hasRole

function gotoNext(to, next) {
  if (to.path === '/login') {
    next({ path: '/', replace: true})
    return;
  }
  if(to.path.indexOf('/access_token')>-1){
    next({ path: '/', replace: true})
    return ;
  }
  let _m = to.meta||{}
  if (hasPermission(_m.perm)) {
    next()
  } else {
    next({ path: '/401', replace: true, query: { noGoBack: true } })
  }
}

export default {
  init() {
    let asyncRouteLoaded = false;
    authInit();
    router.beforeEach((to, from, next) => {
      const app = router.app
      let GetRole = localStorage.getItem("userRole")
      NProgress.start() // start progress bar
      if (app.isLogged) { //如果登陆了
        gotoNext(to, next)
        return;
      }
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
        return;
      }
      if (getToken()) { // determine if there has token
        /* has token*/

        if (!!app.user) {
          gotoNext(to, next)
          return;
        }
        AppService.authorization(getToken()).then(r => {
          app.isLogged = true;
            app.user = r.user;
            gotoNext(to, next)
            bus.$emit('app:user:set')
        }).catch((err) => {
          console.log(err)
          Message.error('认证失败，请重新登陆！')
          next({ path: '/login' })
        })
      } else {
        next('/login') // 否则全部重定向到登录页
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it

      }
    })

    router.afterEach((to, from) => {
      NProgress.done() // finish progress bar
    })

  }
}