import request from '@/utils/request';

export default {
  //Request URL:http://localhost:8089/api/ipark/settlement/merchant/56 getSettlementInfo
  /**
   * 获取商户结算帐户与规则
   */
  getSettlementInfo() {
    return request({
      url: '/ipark/merchant_info/getSettlementInfo',
      method: 'GET'
    });
  },

  /**
   * 检查密码
   */
  checkPayPasswd(password) {
    return request({
      url: '/ipark/merchant_info/checkPayPasswd?password=' + password,
      method: 'POST'
    });
  },
  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/merchant_info/query',
      method: 'POST',
      data
    });
  },
  save(data) {
    return request({
      url: '/ipark/merchant_info/save',
      method: 'POST',
      data
    });
  },
  get(id) {
    return request({
      url: '/ipark/merchant_info/get/'+id,
      method: 'GET'
    });
  },
  getBank(id) {
    return request({
      url: '/ipark/merchant_info/getBank',
      method: 'GET'
    });
  },
  delete(id) {
    return request({
      url: '/ipark/merchant_info/delete/'+id,
      method: 'POST'
    });
  }
};
