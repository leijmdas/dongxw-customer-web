<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="支付时间">
          <el-date-picker v-model="orderDateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="page.query.param.status" :clearable="true" style="width:100px">
            <el-option v-for="item in $dict.store.PAY_ORDER_STATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务单号">
          <el-input v-model="page.query.param.bizOrderNo" :clearable="true"></el-input>
        </el-form-item>
         <el-form-item label="交易编号">
          <el-input v-model="page.query.param.tradeNo" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">

       <el-table-column prop="tradeNo" label="交易编号" width="240">
         <template slot-scope="{row}">
         <span :title="row.tradeNo">{{row.tradeNo}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="code"  label="业务类型" width="80">
        <template slot-scope="{row}">
          {{$dict.getText(row.bizType,$dict.store.PAY_BIZ_TYPE)}}
        </template>
      </el-table-column>
      <el-table-column prop="bizOrderNo" label="业务单号" width="140">
      </el-table-column>


      <el-table-column prop="amount" label="交易金额(元)" width="100">
      </el-table-column>
        <el-table-column prop="voucherNo" label="收款方账户" width="150">
           <template slot-scope="{row}">
             <span v-if="row.payeeAccountInfo">
            [{{$dict.getText(row.payeeAccountInfo.type,$dict.store.ACCOUNT_TYPE)}}]{{row.payeeAccountInfo.name}}
            </span>
        </template>
      </el-table-column>

       <el-table-column prop="stayTime" label="支付方式" width="100">
          <template slot-scope="{row}">
         {{$dict.getText(row.payWay,$dict.store.PAY_WAY)}}
        </template>
      </el-table-column>
      <el-table-column prop="payChannel" label="支付渠道" width="140">
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间" width="140">
      </el-table-column>
       <el-table-column prop="payTime" label="支付状态" width="80">
        <template slot-scope="{row}">
         <span :class="'status_'+row.status">{{$dict.getText(row.status,$dict.store.PAY_ORDER_STATUS)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>

    </v-table>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
  .status_1{
    color:gray;
  }
  .status_2{
    color:blue;
  }
</style>
<script>
import { fetch } from "@/utils";
export default {
  data() {
    return {
      formStatus: 1,
      orderDateRange:[],
      page: {
        query: {
          orderBys:'id|desc',
          param: {}
        },
        getData: this.$api.ipark.PayOrderService.query
      },
      tableActions: [
        {
          name: "编辑",
          handle: this.edit
        },
        {
          name: "删除",
          handle: this.del,
          style: "color:red"
        }
      ]
    };
  },
  computed: {},

  methods: {
    create() {
      this.formStatus = 1;
      this.$refs.formPanel.init({});
    },

    edit(row) {
      this.formStatus = 2;
      this.$refs.formPanel.setValues(row);
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        fetch.base.Brand.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    init(options={}){
      this.search()
    },
    search() {
      this.page.query.dateRanges = {};

      if (this.orderDateRange != null && this.orderDateRange.length > 0) {
        this.page.query.dateRanges['payTime'] = {
          startDate: this.orderDateRange[0],

          endDate: this.orderDateRange.length > 1 ? this.orderDateRange[1] : null
        };
      }
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.$on('init',this.init)
  }
};
</script>
