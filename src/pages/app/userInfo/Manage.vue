<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="page.query.param.mobileNo" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page"  :table-minheight="450">
      <el-table-column prop="username"  label="用户名">
      </el-table-column>
      <el-table-column prop="mobileNo" label="手机号" width="150">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
      </el-table-column>
      <el-table-column prop="remark"  label="备注">
      </el-table-column>

      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>
      <el-table-column width="80" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
      </el-table-column>
    </v-table>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
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
          param: {}
        },
        getData: this.$api.ipark.UserInfoService.query
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
    onDataloaded(rsp) {
      if (rsp.total < 1) return;
      let cfgIds = rsp.model.map(m => m.workTypeId);
      console.log(cfgIds);
      //按ID加载
    },
    init(options={}){
      this.search()
    },
    search() {
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.$on('init',this.init)
  }
};
</script>
