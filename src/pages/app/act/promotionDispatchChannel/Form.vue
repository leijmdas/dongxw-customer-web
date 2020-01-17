<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="120px">
    
      <el-form-item label="名称" prop="name">
        <el-input v-model="entity.name"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="linkmanName">
        <el-input v-model="entity.linkmanName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="linkmanTel">
        <el-input v-model="entity.linkmanTel"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="entity.remark"></el-input>
      </el-form-item>
      
  </el-form>
</template>
<style lang="less" >

</style>

<script>
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import PromotionRuleDefSelect from "@/components/widgets/PromotionRuleDefSelect.vue";
const defaultEntity = {
  id: null,
  name:'',
  remark: ""
};
export default {
  components: { MerchantSelect, PromotionRuleDefSelect },
  data() {
    return {
      ruleTpl: { when: null, then: null },
      entity: _.cloneDeep(defaultEntity),
      oldProps: [],
      ruleDefs: [],
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
        linkmanTel:[{required:true,message:'手机号不合法',trigger:'blur',validator:this.$validator.isValidPhone}]
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
          
          this.$api.ipark.PromotionDispatchChannelService.save(params).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    init(options) {
      this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.PromotionDispatchChannelService.get(options.id).then(r => {
         
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