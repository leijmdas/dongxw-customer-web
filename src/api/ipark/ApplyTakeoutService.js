import request from '@/utils/request';

export default {

  /**
   * 确认提现申请
   */
  confirmTakeout(data) {
    return request({
      url: '/ipark/takeout_apply/confirmTakeout',
      method: 'POST',
      data
    });
  },

  /**
   * 查询帐单
   */
  findByNotNullProps(data) {
    return request({
      url: '/ipark/takeout_apply/findByNotNullProps',
      method: 'POST',
      data
    });
  },

  /**
   * 查询帐单
   */
  query(data) {
    return request({
      url: '/ipark/takeout_apply/query',
      method: 'POST',
      data
    });
  },
  save(data) {
    return request({
      url: '/ipark/takeout_apply/save',
      method: 'POST',
      data
    });
  },
  update(data) {
    return request({
      url: '/ipark/takeout_apply/update',
      method: 'POST',
      data
    });
  }


};
