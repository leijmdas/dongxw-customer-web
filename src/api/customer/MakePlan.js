/**
 * 访问记录
 */
import request from '@/utils/request'

export default {
    /**
     * 保存
     */
    save(data) {
        return request({
            url: '/customer/makeplan/save',
            method: 'POST',
            data
        })
    },
    /**
     * 查询
     */
    query(data) {
        return request({
            url: '/customer/makeplan/query',
            method: 'POST',
            data
        })
    },
    /**
     * 导出xlsx
     */
    export(data) {
        return request({
            url: '/customer/makeplan/export',
            method: 'POST',
            data,
            responseType: 'blob'
        })
    },
    findById(id) {
        return request({
            url: '/customer/makeplan/findById/'+id,
            method: 'POST'
        })
    },
    deleteById(id) {
        return request({
            url: '/customer/makeplan/deleteById/'+id,
            method: 'POST'
        })
    },
    makePlanByOrder(orderId) {
        return request({
            url: '/customer/makeplan/makePlanByOrder/'+orderId,
            method: 'POST'
        })
    },


}
