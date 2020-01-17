/**
 * 访问记录
 */
import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/access_info/query',
      method: 'POST',
      data
    })
  },
}
