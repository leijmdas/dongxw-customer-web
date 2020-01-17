<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true" >
        <!-- <el-form-item label="商户">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item> -->
        <el-form-item label="手机号">
          <el-input v-model="mobileNO" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="create" type="primary">新增</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450">

      <el-table-column prop="name" label="姓名" width="200">
        <template slot-scope="{row}">
          {{row.userInfo.realname}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="type" label="商户" width="150">
        <template slot-scope="{row}">
          {{(row.merchantInfo||{name:'-'}).name}}
        </template>
      </el-table-column> -->
     <el-table-column prop="headerTel" label="手机号" width="180">
        <template slot-scope="{row}">
          {{row.userInfo.mobileNo}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="备注" >
        <template slot-scope="{row}">
          {{row.userInfo.remark}}
        </template>
      </el-table-column>
      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">


          <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog ref="formDiag" title="新增用户" :appendToBody="true" width="400px">
      <form-panel @saved="onFormSaved"></form-panel>
      <div slot="footer">
        <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
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
      mobileNO:'',
      remark:'',
      page: {
        query: {
          orderBys:'id|desc',
          param: {
            isDeleted:false
          }
        },
        getData: this.$api.ipark.PromotionDispatchUserService.query
      },
    };
  },
  computed: {},

  methods: {

    create() {
      if(!this.mobileNO){
        this.$message('手机号不能为空');
        return ;
      }
      this.$api.ipark.UserInfoService.findByMobileNO(this.mobileNO).then(r=>{
        if(!r){
          //this.$message('手机号不存在');
          this.$refs.formDiag.show({default:{mobileNo:this.mobileNO}});
          return ;
        } else {
          this.userId = r.id;
          this.addDispatchUser();
        }
      });
    },
    addDispatchUser(){
      this.$api.ipark.PromotionDispatchUserService.save({
        userId:this.userId,
        dispatchChannelId:this.dispatchChannelId,
        remark:this.remark
      }).then(r=>{
        this.$message('添加成功');
        this.search();
      })

    },
    edit(row) {
      this.$refs.formDiag.show({id:row.id});
    },

    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.PromotionDispatchUserService.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    onFormSaved(id){
      this.$refs.formDiag.hide();
      this.userId = id;
      this.addDispatchUser();
    },
    init(options = {}) {
      this.dispatchChannelId = options.dispatchChannelId;
      this.search();
    },
    search() {
      this.page.query.param.dispatchChannelId = this.dispatchChannelId
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.$on("init", this.init);
  }
};
</script>
