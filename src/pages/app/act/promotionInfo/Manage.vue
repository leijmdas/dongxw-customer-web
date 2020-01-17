<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <!-- <el-form-item label="商户">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item> -->
        <el-form-item label="编码">
          <el-input v-model="page.query.param.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select :clearable="true" v-model="page.query.param.status" style="width:100px">
            <el-option v-for="item in $dict.store.PROMOTION_STATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button @click="create">新增</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450" @dataloaded="onDataloaded">
      
      <el-table-column prop="code" label="编码" width="120">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200">
      </el-table-column>
      <!-- <el-table-column prop="type" label="商户" width="150">
        <template slot-scope="{row}">
          {{(row.merchantInfo||{name:'-'}).name}}
        </template>
      </el-table-column> -->
      <el-table-column prop="startOn" label="开始时间" width="150">
      </el-table-column>
      <el-table-column prop="endOn" label="结束时间" width="150">
      </el-table-column>
      <el-table-column prop="effectDays" label="有效期" width="80">
        <template slot-scope="{row}">
          {{row.effectTimes}} {{$dict.getText(row.effectTimeUnit,$dict.store.PROMOTION_EFFECT_TIMEUNIT)}}
        </template>
      </el-table-column>
      <el-table-column prop="visibility" label="可见性" width="80">
        <template slot-scope="{row}">
          {{$dict.getText(row.visibility,$dict.store.PROMOTION_VISIBILITY)}}
        </template>
      </el-table-column>
      <el-table-column prop="tip" label="优惠">
         <template slot-scope="{row}">
          {{row.discountValue}} <span v-show="row.discountType==1">元</span>
        </template>
      </el-table-column>
      <el-table-column prop="tip" label="总量/发放/使用" width="100">
        <template slot-scope="{row}">
          {{row.limitTotalNum?row.limitTotalNum:'不限'}} / {{ (summaryMap[row.id]||{instanceNum:0}).instanceNum}} /  {{ (summaryMap[row.id]||{usedNum:0}).usedNum}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="{row}">
          {{$dict.getText(row.status,$dict.store.PROMOTION_STATUS)}}
        </template>
      </el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="上/下架" @click="toggleStatus(scope.row)">
            <i class="el-icon-upload2" v-show="scope.row.status==0||scope.row.status==2"></i>
             <i class="el-icon-download" v-show="scope.row.status==1"></i>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <!-- <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button> -->
        </template>
      </el-table-column>
    </v-table>
    <v-dialog ref="formDiag" title="信息编辑">
      <form-panel @saved="onFormSaved"></form-panel>
      <div slot="footer">
        <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
        <el-button type="default" @click="()=>{$refs.formDiag.hide()}">取消</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";

export default {
  components: { FormPanel,MerchantSelect },
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
        getData: this.$api.ipark.PromotionInfoService.query
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
    onDataloaded(rsp){
      if(rsp.total<1) return ;
      let promotionIds = rsp.data.map(r=>r.id);
      this.$api.ipark.PromotionInfoService.summaryGroupByPromotionId(promotionIds).then(rs=>{
        let _rs = rs||[];
        _rs.forEach(r=>{
          this.summaryMap[r.promotionId]=r;
        })
      })
    },
    create() {
      this.$refs.formDiag.show();
    },
    edit(row) {
      this.$refs.formDiag.show({id:row.id});
    },
    toggleStatus(row){
      let status = row.status;
      let msg = '确定上架此活动吗？</br><span style="color:red">一旦上架，部分信息不允许修改!</span>';
      if(status==1){
        msg = '确定下架此活动吗?';
      }
      this.$confirm(msg, "确认", {
        type: "warning",
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$api.ipark.PromotionInfoService.updateStatus(row.id,status==1?2:1).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      });
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.PromotionInfoService.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
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
