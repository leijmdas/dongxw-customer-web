import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/promotion/dispatchUser/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/promotion/dispatchUser/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/promotion/dispatchUser/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/promotion/dispatchUser/delete/'+id,
      method: 'POST'
    })
  },
}
