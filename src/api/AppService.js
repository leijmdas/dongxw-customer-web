import request from '@/utils/request'
export default {

  /**
   * 获取认证信息
   */
  authorization(token) {
    return request({
      url: '/ipark/auth/authorization',
      method: 'POST',
      params:{
          token:token
      }
    })
  },
  login(params) {
    return request({
      url: '/ipark/auth/login',
      method: 'POST',
      params:params
    })
  },
  modifyPwd(data){
    return request({
      url: '/ipark/merchant_info/updatePass',
      method: 'POST',
      data
    })
  }
}
