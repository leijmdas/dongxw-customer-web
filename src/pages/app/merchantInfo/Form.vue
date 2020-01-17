<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
    <el-row>
      <el-col :span="16">
        <el-form-item label="名称" prop="name">
          <el-input v-model="entity.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="entity.type">
          <el-option v-for="item in $dict.store.MERCHANT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="entity.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="entity.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="entity.email"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="entity.address"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <div style="margin:10px" class="merchantLogo">
          <v-image-uploader :form-data="{}" v-model="entity.logo">

          </v-image-uploader>
          <div style="text-align:center">
            LOGO
          </div>
        </div>
      </el-col>
    </el-row>

    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" v-model="entity.remark"></el-input>
    </el-form-item>
  </el-form>
</template>
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
  logo: "",

  status: 1,
  remark: ""
};
export default {
  components: {},
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择商户类型",
            trigger: "change"
          }
        ],
        status: [
          {
            type: "number",
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
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
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$api.ipark.MerchantInfoService.save(this.entity).then(rsp => {
            this.$emit("saved", rsp);
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
      if (options.id) {
        //loadData
        this.$api.ipark.MerchantInfoService.get(options.id).then(r => {
          this.entity = r;
        });
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>