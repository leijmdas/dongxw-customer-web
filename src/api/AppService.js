import request from '@/utils/request'
export default {

  /**
   * 获取认证信息
   */
  authorization(token) {
    return request({
      url: '/customer/auth/authorization',
      method: 'POST',
      params:{
          token:token
      }
    })
  },
  login(params) {
    return request({
      url: '/customer/auth/login',
      method: 'POST',
      params:params
    })
  },
  modifyPasswd(data){
    return request({
      url: '/customer/updatePasswd',
      method: 'POST',
      data
    })
  }
}
