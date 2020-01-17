import request from '@/utils/request'

export default {

  //导出预约流水
  exportBooking(data) {
    return request({
      url: '/ipark/pay_order/exportBooking',
      method: 'POST',
      data,
      responseType: 'blob'
    })
  },
  //导出临停流水
  exportParking(data) {
    return request({
      url: '/ipark/pay_order/exportParking',
      method: 'POST',
      data,
      responseType: 'blob'
    })
  },
  //updateStatus2Apply
  /**
   * 修改帐单为申请提现状态{ id:1 }
   */
  updateStatus2Apply(id) {
    return request({
      url: '/ipark/settle_period/updateStatus2Apply?id='+id ,
      method: 'POST'

    });
  },


  /**
   * 查询已经支付的预约单queryParkBookingPayed
   */
  queryBooking(data) {
    return request({
      url: '/ipark/pay_order/queryBooking',
      method: 'POST',
      data
    });
  },
  /**
   * 查询已经支付的临停单
   */
  queryParking(data) {
    return request({
      url: '/ipark/pay_order/queryParking',
      method: 'POST',
      data
    });
  },
  /**
   * 查询帐单
   */
  query(data) {
    return request({
      url: '/ipark/settle_period/query',
      method: 'POST',
      data
    });
  },

  /**
   * 查询商户的停号场列表
   */
  queryParkList() {
    return request({
      url: '/ipark/settle_period/queryParkList',
      method: 'POST'

    });
  },
  /**
   * 查询帐期列表
   */
  queryPeriod() {
    return request({
      url: '/ipark/settle_period/queryPeriod',
      method: 'POST'

    });
  },

  get(id) {
    return request({
      url: '/ipark/settle_period/get/' + id,
      method: 'GET'
    })
  },

}
