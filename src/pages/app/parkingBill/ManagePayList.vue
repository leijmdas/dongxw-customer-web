<!--停车场管理支付流水-->
<template>


  <div>
    <div class="panel panel-default" style="height:600px;overflow-y: auto">

      <el-row height="180" border style="width: 100%">
        <el-col :span="12">
          <template>
            <div class="grid-content"> 查看{{this.pageBizType==1?'临停':'预约'}}明细　
                  <!--{{periodData.startDate==null?"":periodData.startDate.substring(0,10)+"=>"+periodData.endDate.substring(0,10)}}-->
            </div>
          </template>
        </el-col>

        <el-col :span="2">
            <el-button type="primary" @click="exportPayOrder" v-keycode="'ENTER'">导出</el-button>

        </el-col>
        <!--<el-col :span="2">-->
          <!--<el-button click="this.$refs.managerPayListDialog.hide()" >退出</el-button>-->

        <!--</el-col>-->
      </el-row>
      <el-row height="20" border style="width: 100%"/>
      <el-row height="150" border style="width: 100%">


        <el-col :span="3">
          <div class="grid-content">总金额:</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">￥{{actualAmount}}</div>
        </el-col>

        <el-col :span="3">
          <div class="grid-content">结算金额:</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">￥{{checkAmount}}</div>
        </el-col>
        <el-col :span="4">
          <div v-show='this.pageBizType==2' class="grid-content">平台服务费({{100-settleInfo.merchantPercent}}%):</div>
        </el-col>
        <el-col :span="4">
          <div v-show='this.pageBizType==2' class="grid-content">￥{{(actualAmount-checkAmount).toFixed(2)}}</div>
        </el-col>
        <!--<el-col :span="8">-->
          <!--<div class="grid-content">(平台收取{{100-settleInfo.merchantPercent}}%服务费)</div>-->
        <!--</el-col>-->

      </el-row>


      <v-table ref="table" width="100%" :page="page" class="panel-main" :table-minheight="450" >
        <el-table-column prop="seq" label="序号" width="60">

          <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

        </el-table-column>
        <el-table-column prop="tradeNo" label="交易编号" width="240">
          <template slot-scope="{row}">
            {{row.tradeNo}}
          </template>
        </el-table-column>
        <el-table-column prop="bizType" label="业务类型" width="140">
          <template slot-scope="{row}">
            {{pageBizType==2?'预约':'临停'}}
          </template>
        </el-table-column>
        <el-table-column prop="bizOrderNo" label="业务单号" width="160">
          <template slot-scope="{row}">
            {{row.bizOrderNo}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="订单金额(元)" width="120">
          <template slot-scope="{row}">
            {{this.pageBizType==1?row.parkingOrder?row.parkingOrder.totalAmount:0
                                 :row.bookingOrder?row.bookingOrder.totalAmount:0}}
          </template>
        </el-table-column>


        <el-table-column prop="discountAmount" label="优惠金额(元)" width="120">
          <template slot-scope="{row}">
            {{this.pageBizType==1?row.parkingOrder?row.parkingOrder.discountAmount:0:
                                  row.bookingOrder?row.bookingOrder.discountAmount:0}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="实收金额(元)" width="120">
          <template slot-scope="{row}">
            {{row.amount}}
          </template>
        </el-table-column>


        <el-table-column prop="payTime" width="160" label="支付时间">
          <template slot-scope="{row}">
            {{row.payTime}}
          </template>
        </el-table-column>

      </v-table>
    </div>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
  .status_1 {
    color: gray;
  }

  .status_2 {
    color: blue;
  }

  .el-row {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple {
    background: #f9fafc;
    /*d3dce6;*/
  }

  .row-bg {
    padding: 20px 0;
    background-color: #f9fafc;
  }

</style>
<script>
  import {fetch} from '@/utils';

  export default {
    data() {
      return {
        settleInfo:{},

        // commissionRate:25,
        visible: this.show,
        dialogFormVisible: false,
        periodData:{},
        //pageBizType:页面业务类型
        pageBizType: 1,//临停，2预约

        actualAmount: 0,
        checkAmount: 0,

        // formStatus: 1,
        orderDateRange: [],
        page: {
          query: {
            orderBys: 'payTime|desc',
            param: {
              status: 2
            }
          },
          getData:  this.$api.ipark.BillService.queryParking
        },
        tableActions: [
          {
            name: '编辑',
            handle: this.edit
          },
          {
            name: '删除',
            handle: this.del,
            style: 'color:red'
          }
        ]
      };
    },
    computed: {},
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      show() {
        this.visible = this.show;

      }
    },
    methods: {

      labelPriodsDate(s, e) {
        return s + ' -> ' + e;
      },
      fillStatusMap() {
        st = this.$dict.store.BILL_APPLY_STATUS;
        this.mapBILL_APPLY_STATUS = {};
        for (var i = 0; i < st.length; i++) {
          // console.log(st[i]);
          this.mapBILL_APPLY_STATUS[st[0]] = st[1];
        }
        return st;
      },
      create() {
        this.formStatus = 1;
        this.$refs.formPanel.init({});
      },

      applyTakeout(row) {
        alert(JSON.stringify(row));
      },

      edit(row) {
        this.formStatus = 2;
        this.$refs.formPanel.setValues(row);
      },
      del(row) {
        this.$confirm('确定删除此条记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          fetch.base.Brand.delete(row.id).then(rsp => {
            this.search();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        });
      },
      getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
      },

      init(options = {}) {
        this.pageBizType = options.bizType;
        this.periodData = options.periodData;
        this.actualAmount = options.actualAmount;
        this.checkAmount = options.checkAmount;
        //alert(JSON.stringify(options.periodData));
        //this.page.query = {};
        this.page.query.param.bizType = options.bizType;
        this.page.query.param.parkId = options.parkId;
        this.page.getData = this.pageBizType == 1 ? this.$api.ipark.BillService.queryParking :
          this.$api.ipark.BillService.queryBooking;

        this.$api.ipark.MerchantInfoService.getSettlementInfo().then(
          rsp => {
            this.settleInfo = rsp;
          });

        this.search();
        //alert(JSON.stringify(this.$refs.table.getTableData()))

      },
      exportPayOrder() {

        if(this.pageBizType == 1 ) {
          this.$api.ipark.BillService.exportParking(this.page.query);
          //this.$api.ipark.BillService.exportParking({});

        }
        else{
          this.$api.ipark.BillService.exportBooking(this.page.query);
          //this.$api.ipark.BillService.exportBooking({});
        }

      },
      search() {
        this.page.query.dateRanges = {};

        if (this.periodData != null  ) {
          this.page.query.dateRanges['payTime'] = {
            startDate:  this.periodData.startDate,
            endDate: this.periodData.endDate.substring(0,10)+' 23:59:59'
          };
        }

        this.$refs.table.load();
      }
    },
    created() {
    },
    mounted() {
      this.$on('init', this.init);
    }
  };
</script>


