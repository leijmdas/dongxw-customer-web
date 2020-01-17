import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/user_info/query',
      method: 'POST',
      data
    })
  },
  findByMobileNO(mobileNO){
    return request({
      url: '/ipark/user_info/findByMobileNO',
      method: 'GET',
      params:{mobileNO}
    })
  },
  save(data){
    return request({
      url: '/ipark/user_info/save',
      method: 'POST',
      data
    })
  }
}
