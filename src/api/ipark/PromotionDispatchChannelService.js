import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/promotion/dispatchChannel/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/promotion/dispatchChannel/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/promotion/dispatchChannel/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/promotion/dispatchChannel/delete/'+id,
      method: 'POST'
    })
  },
}
