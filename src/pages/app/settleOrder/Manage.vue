<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="商户">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button @click="create">新增</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450">
      <el-table-column prop="name" label="商户" width="200">
        <template slot-scope="{row}">
          {{(row.merchantInfo||{name:'-'}).name}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="帐户" width="200">
      </el-table-column>
      <el-table-column prop="type" label="帐户类型" width="120">
        <template slot-scope="{row}">
          {{$dict.getText(row.type,$dict.store.ACCOUNT_TYPE)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="月份" width="120">
        <template slot-scope="{row}">
          0101 - 0201
        </template>
      </el-table-column>
       <el-table-column prop="name" label="金额" width="120">
        <template slot-scope="{row}">
         10
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
         <template slot-scope="{row}">
          {{$dict.getText(row.status,$dict.store.STATUS)}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
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
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";


export default {
  components: { MerchantSelect },
  data() {
    return {
      formStatus: 1,
      orderDateRange: [],
      page: {
        query: {
          sortBys:'id|desc',
          param: {
            isDeleted:false
          }
        },
        getData: this.$api.ipark.SettleAccountService.query
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
      this.$refs.formDiag.show();
    },
    edit(row) {
      this.$refs.formDiag.show({id:row.id});
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.CorpInfoService.delete(row.id).then(rsp => {
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
