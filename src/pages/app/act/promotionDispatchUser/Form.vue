<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="120px">
    <el-form-item label="手机号" prop="mobileNo">
      <el-input v-model="entity.mobileNo"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="realname">
      <el-input v-model="entity.realname"></el-input>
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" v-model="entity.remark"></el-input>
    </el-form-item>
  </el-form>
</template>
<style lang="less" >
</style>

<script>
const defaultEntity = {
  id: null,
  mobileNo:'',
  name: "",
  entity:1,
  remark: ""
};
export default {
  components: {  },
  data() {
    return {
      ruleTpl: { when: null, then: null },
      entity: _.cloneDeep(defaultEntity),
      oldProps: [],
      ruleDefs: [],
      rules: {
        realname: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        mobileNo: [
          {
            required: true,
            message: "手机号不合法",
            trigger: "blur",
            validator: this.$validator.isValidPhone
          }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs["form"].resetFields();
      this.entity = _.cloneDeep(defaultEntity);
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.entity);
          params['username']=params['mobileNo'];
          this.$api.ipark.UserInfoService.save(params).then(
            rsp => {
              this.$emit("saved", rsp);
            }
          );
        }
      });
    },
    init(options) {
      this.resetForm();
      Object.assign(this.entity,options.default);
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>