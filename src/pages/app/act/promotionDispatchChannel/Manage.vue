<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <!-- <el-form-item label="商户">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item> -->
        <el-form-item label="名称">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button @click="create">新增</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450">

      <el-table-column prop="name" label="名称" width="200">
      </el-table-column>
      <!-- <el-table-column prop="type" label="商户" width="150">
        <template slot-scope="{row}">
          {{(row.merchantInfo||{name:'-'}).name}}
        </template>
      </el-table-column> -->
      <el-table-column prop="linkmanName" label="联系人" width="180">
      </el-table-column>
     <el-table-column prop="linkmanTel" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="status" label="备注" >
        <template slot-scope="{row}">
          {{row.remark}}
        </template>
      </el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">

          <el-button type="text" title="用户" @click="showDispatchUserManage(scope.row)">
            <icon name="account"></icon>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button style="color: red" type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
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
    <v-dialog ref="userDiag" title="渠道用户管理">
      <dispatch-user-manage></dispatch-user-manage>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";
import DispatchUserManage from "../promotionDispatchUser/Manage";
export default {
  components: { FormPanel,MerchantSelect,DispatchUserManage },
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
        getData: this.$api.ipark.PromotionDispatchChannelService.query
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
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.PromotionDispatchChannelService.delete(row.id).then(rsp => {
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
