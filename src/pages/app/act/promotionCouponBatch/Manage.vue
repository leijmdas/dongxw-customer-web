<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <!-- <el-form-item label="商户">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item> -->
        <el-form-item label="批次号">
          <el-input v-model="page.query.param.batchNo" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button @click="create">新增</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450">
      <el-table-column prop="batchNo" label="编号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="优惠券">
        <template slot-scope="{row}">
           [{{row.promotionInfo.name}}]-{{row.promotionInfo.discountCondition}}
          <span
            style="color:gray"
          >{{row.promotionInfo.tip}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="type" label="商户" width="150">
        <template slot-scope="{row}">
          {{(row.merchantInfo||{name:'-'}).name}}
        </template>
      </el-table-column> -->
      <el-table-column prop="linkmanName" label="渠道" width="180">
        <template slot-scope="{row}">
          {{(row.promotionDispatchChannel||{}).name}}
        </template>
      </el-table-column>
     <el-table-column prop="expectNum" label="数量" width="80">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="{row}">
          {{row.actualNum?'已生成':'未生成'}}
        </template>
      </el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <div v-show="!scope.row.actualNum">
          <el-button type="text" title="生成" @click="genCoupons(scope.row)">
            <i class="el-icon-tickets"></i>
          </el-button>

          <el-button type="text" title="编辑" @click="edit(scope.row)" v-if="!scope.row.actualNum">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button style="color: red" type="text" @click="del(scope.row,scope.$index)"
                     title="删除" v-if="!scope.row.actualNum">
            <i class="el-icon-delete red"></i>
          </el-button>
          </div>
          <el-button type="text" title="查看" @click="view(scope.row)">
            <i class="el-icon-view"></i>
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog ref="formDiag" title="信息编辑" :width="'500px'">
      <form-panel @saved="onFormSaved"></form-panel>
      <div slot="footer">
        <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
        <el-button  @click="()=>$refs.formDiag.hide()">取消</el-button>
      </div>
    </v-dialog>
    <v-dialog ref="formDiagView" title="信息查看">
      <view-panel></view-panel>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";
import ViewPanel from "./ViewPanel";
import DispatchUserManage from "../promotionDispatchUser/Manage";
export default {
  components: { FormPanel,ViewPanel,MerchantSelect,DispatchUserManage },
  data() {
    return {
      formStatus: 1,
      orderDateRange: [],
      summaryMap:{},
      page: {
        query: {
          orderBys:'id|desc',
          param: {
            isDeleted:false
          }
        },
        getData: this.$api.ipark.PromotionCouponBatchService.query
      }
    };
  },
  computed: {},

  methods: {
    //展示管理用户
    showDispatchUserManage(row){
      this.$refs.userDiag.show({dispatchChannelId:row.id});
    },
    create() {
      this.$refs.formDiag.show();
    },
    edit(row) {
      this.$refs.formDiag.show({id:row.id});
    },
    view(row){
      this.$refs.formDiagView.show({batch:row});
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "确认", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.PromotionCouponBatchService.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    genCoupons(row){
      this.$confirm("确定生成优惠券吗?", "确认", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.PromotionCouponBatchService.genCoupons(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "生成成功!"
          });
        });
      });
    },
    onFormSaved(){
      this.$refs.formDiag.hide();
      this.$nextTick(this.search);
    },
    init(options = {}) {
      this.search();
    },
    search() {
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.$on("init", this.init);
  }
};
</script>
