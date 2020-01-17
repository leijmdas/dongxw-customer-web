import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/promotion/couponBatch/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/promotion/couponBatch/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/promotion/couponBatch/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/promotion/couponBatch/delete/'+id,
      method: 'POST'
    })
  },
  genCoupons(id){
    return request({
      url: '/ipark/promotion/couponBatch/genCoupons/'+id,
      method: 'POST'
    })
  }
}
