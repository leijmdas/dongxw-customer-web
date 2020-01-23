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
            url: '/customer/ordermaster/save',
            method: 'POST',
            data
        })
    },
    /**
     * 查询
     */
    query(data) {
        return request({
            url: '/customer/ordermaster/query',
            method: 'POST',
            data
        })
    },
    /**
     * 导出xlsx
     */
    export(data) {
        return request({
            url: '/customer/ordermaster/export',
            method: 'POST',
            data,
            responseType: 'blob'
        })
    },
    /**
     * 导出xlsxMail
     */
    exportMail(data) {
        return request({
            url: '/customer/ordermaster/exportMail',
            method: 'POST',
            data
        })
    },

    findById(id) {
        return request({
            url: '/customer/ordermaster/findById/'+id,
            method: 'POST'
        })
    },
    deleteById(id) {
        return request({
            url: '/customer/ordermaster/deleteById/'+id,
            method: 'POST'
        })
    },


}
