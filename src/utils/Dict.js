import Vue from "vue";
let Dict = {

    store: {
      PUBLIISH_STATUS: [[0, '停用'],[1, '启用'], [2, '预发布']],
      STATUS: [[1, '启用'], [0, '停用']],
      SETTLEMENT_TYPE: [[1, '月结'], [2, '周结']],
      SERVICE_TYPE:[[1,'临停'],[2,'预约']],
      BILL_APPLY_STATUS:[[1,'未申请'],[2,'待审核'],[3,'审核通过'],[4,'审核不通过'],[5,'已结算']],
      TYPE: [[1, '预约型'], [2, '混合型']],
      CORP_TYPE:[[1,'有限责任公司'],[2,'个人独资'],[3,'合伙企业'],[4,'集体所有制企业'],[5,'个体工商户'],[0,'其它']],//企业类型
      ACCESS_STATUS:[[0,'未离场'],[1,'预离场'],[2,'已离场']],
      ACCOUNT_TYPE:[[1,'微信'],[2,'支付宝'],[3,'好收']],
      PARK_CHANNELTYPE:[[1,'入口'],[2,'出口']],
      PAY_WAY:[[0,'钱包'],[1,'微信'],[2,'支付宝']],
      PAY_BIZ_TYPE:[[0,'钱包充值'],[1,'停车'],[2,'预约']],
      PAY_ORDER_STATUS:[[1,'未支付'],[2,'支付成功'],[3,'支付失败'],[4,'转入退款'],[5,'已关闭'],[6,'已冲正'],[7,'已撤销']],
      PARKING_ORDER_STATUS: [[1, '未支付'], [2, '支付成功'], [4, '已超时'], [5, '已完结']],
      MERCHANT_TYPE:[[1,'普通商户'],[2,'特约商户']],
      PROMOTION_EFFECT_TIMEUNIT:[['day','天'],['hour','小时']],
      PROMOTION_VISIBILITY:[['public','公开'],['private','私有']],
      PROMOTION_STATUS:[[0,'草稿'],[1,'已上架'],[2,'已下架']],
      COUPON_STATUS:[[0,'未使用'],[1,'使用中'],[2,'已使用']],
      GATE_TYPE: [[1, '传统道闸'], [2, '无道闸']],
      BILL_WAY: [[0,'未设定'],[1, '线下'], [2, '线上']], // 计费方式
      PAYWAY:[[-1, '未支付'],[0,'钱包'],[1,'微信'],[2,'支付宝']],
      // BOOKING_ORDER_STATUS: [[1, '待付款'], [2, '已付款'], [3, '已降锁'], [5, '已完结'], [0, '已取消']],
      BOOKING_ORDER_STATUS: [[2, '已付款'], [5, '已完结']],

    },
    getEntry: function (key, storeArr) {
        let arr = storeArr || []
        return arr.find((entry) => entry[0] == key)
    },
    getText: function (key, storeArr) {
        let tmp = this.getEntry(key, storeArr)
        return tmp ? tmp[1] : '-'
    }
}
Vue.prototype.$dict = Dict
export default Dict
