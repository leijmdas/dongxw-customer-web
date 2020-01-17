<!--停车场邀请码-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="订单编号">
          <el-input v-model="page.query.param.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="泊位编码">
          <el-input v-model="page.query.param.portCode"></el-input>
        </el-form-item>
        <el-form-item label="车位锁编码">
          <el-input v-model="page.query.param.lockCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button type="success" @click="exportRecords">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">
      <el-table-column prop="orderNo" label="序号" width="80"></el-table-column>
      <el-table-column prop="parkInfoName" label="停车场" width="200">
        <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
      </el-table-column>
      <el-table-column prop="portCode" label="邀请码" width="120"></el-table-column>
      <el-table-column prop="lockCode" label="邀请码总量" width="120"></el-table-column>
      <el-table-column prop="lockCode" label="激活数量" width="120"></el-table-column>
      <el-table-column prop="lockCode" label="未激活数量" width="120"></el-table-column>
      <el-table-column prop="prepaymentAmount" label="状态" width="100"></el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">{{row.createOn}}</template>
      </el-table-column>
      <el-table-column prop="lockCode" label="备注" width="150"></el-table-column>
      <el-table-column label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="详情" @click="openDetail(scope.row)">详情</el-button>
          <el-button type="text" title="申请邀请码" @click="applyCode(scope.row)">申请邀请码</el-button>
        </template>
      </el-table-column>
    </v-table>
     <v-dialog ref="formDiag" title="申请邀请码" :width="'500px'">
      <el-form ref="form">
        
      </el-form>
      <el-input placeholder="请填写申请邀请码数量"></el-input>
      <div slot="footer">
        <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">申请</el-button>
        <el-button  @click="()=>$refs.formDiag.hide()">取消</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
export default {
  components: {},

  data() {
    return {
      page: {
        query: {
          orderBys: 'id|desc',
          param: {
            isdelete: false,
            plateNumber: '',
            orderNo: '',
            username: '',
            creatingStartOn: '',
            creatingEndOn: '',
            parkingEndOn: '',
            parkingStartOn: '',
            merchantId: '',
            lockCode: '',
            parkingPortId: ''
          }
        },
        getData: this.$api.ipark.BookingOrderService.query
      }
    };
  },
  computed: {},
  methods: {
    init() {
      this.search();
    },
    search() {
      this.$refs.table.load();
    },
    exportRecords() {
      let params = this.getSearchParams();
      this.$api.ipark.BookingOrderService.export(params);
    },
    getSearchParams() {
      return this.page.query;
    },
    applyCode(row) {
      this.$refs.formDiag.show({id:row.id});
    },
    openDetail() {

    },
    submitForm(){
      console.log('12312');
      return
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = Object.assign({},this.entity);
          // this.$api.ipark.PromotionCouponBatchService.save(params).then(r => {
          //   this.$emit("saved", r);
          // });
        }
      });
    }
  },
  created() {},
  mounted() {
    this.$on("submit", this.submitForm);
    this.$on('init', this.init);
  }
};

</script>
