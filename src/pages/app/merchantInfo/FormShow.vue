<template>
    <div>
      <div class="panel panel-default panel-search" >

      <!--<legend>帐户管理</legend>-->
    <el-form  style="margin-top: 10px;margin-left: 10px;" :model="entity"   ref="form" label-width="120px">
      <el-row>
        <el-col :span="12"  >
          <el-form-item label="名称" prop="name">
            <el-input :readonly="true" v-model="entity.name"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select :disabled="true" v-model="entity.type">
              <el-option  v-for="item in $dict.store.MERCHANT_TYPE" :key="item[0]" :value="item[0]"
                         :label="item[1]"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="结算类型" prop="type">
            <el-select :disabled="true" v-model="entityBank.type">
              <el-option
                v-for="item in $dict.store.SETTLEMENT_TYPE"
                :key="item[0]"
                :value="item[0]"
                :label="item[1]"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算日" prop="day">
            <el-input :readonly="true" v-model.number="entityBank.day"></el-input>
          </el-form-item>
          <el-form-item label="预约提成比例(%)" prop="merchantPercent">
            <el-input :readonly="true" v-model="entityBank.merchantPercent"></el-input>
          </el-form-item>
          <el-form-item label="续约提成比例(%)" prop="reMerchantPercent">
            <el-input :readonly="true" v-model="entityBank.reMerchantPercent"></el-input>
          </el-form-item>
          <el-form-item label="最低限额(元)" prop="minAmount">
            <el-input :readonly="true" v-model="entityBank.minAmount"></el-input>
          </el-form-item>
          <el-form-item label="银行名称" prop="bankName">
            <el-input :readonly="true" v-model="entityBank.bankName"></el-input>
          </el-form-item>
          <el-form-item label="银行帐号" prop="bankAccountId">
            <el-input :readonly="true" v-model="entityBank.bankAccountId"></el-input>
          </el-form-item>
          <el-form-item label="银行户主" prop="bankAccountOwner">
            <el-input :readonly="true" v-model="entityBank.bankAccountOwner"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input :readonly="true" v-model="entityBank.remark"></el-input>
          </el-form-item>
        </el-col>

      </el-row>


    </el-form></div>
  </div>
</template>
<style>
 .el-input__inner .el-select{
    background:#b3d8ff;
    color: #ff00ff;
  }
.el-input__inner {
    height: 33px;
    font-size: 13px;
    box-shadow: none;
    border: 1px solid #e9e9e9;
}
</style>
<style lang="less" >
.merchantLogo .el-upload-dragger {
  img {
    height: 180px !important;
  }

}

</style>

<script>
const defaultEntity = {
  id: null,
  logo: '',

  status: 1,
  remark: ''
};
export default {
  components: {},
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      entityBank: {},
      types: [],
      rules: {
        name: [

        ]
      }
    };
  },
  methods: {
    setValues(vals) {
      this.resetEntity = _.cloneDeep(vals);
      this.entity = _.cloneDeep(this.resetEntity);
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$api.ipark.MerchantInfoService.save(this.entity).then(rsp => {
            this.$emit('saved', rsp);
          });
        }
      });
    },
    resetForm() {
      this.entity = _.cloneDeep(this.resetEntity);
    },
    init(options) {
      this.$refs['form'].resetFields();
      this.entity = _.cloneDeep(defaultEntity);

        //loadData
        this.$api.ipark.MerchantInfoService.getBank().then(r => {
          this.entity = r.merchantInfoDTO;
          this.entityBank = r.settlementInfoDTO;
        });

    }
  },
  mounted() {
    this.$on('init', this.init);
    // this.$on("submit", this.submitForm);
  }
};
</script>
