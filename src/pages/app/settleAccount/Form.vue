<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
    <fieldset>
      <legend>基本信息</legend>

      <el-form-item label="名称" prop="name">
        <el-input v-model="entity.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="类型" prop="type">
        <el-row>
          <el-col :span="6">
            <el-select v-model="entity.type" @change="resetProps">
              <el-option v-for="item in $dict.store.ACCOUNT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16" v-show="entity.type==3"> 
              <el-checkbox label="支持支付宝支付" v-model="entity.supportAli"></el-checkbox>
              <el-checkbox label="支持微信支付" v-model="entity.supportWeixin" ></el-checkbox>
          </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item label="支付通道" v-show="entity.type==3">
        <el-row>
          
          <el-col :span="16" > <!--好收-->
              <el-checkbox label="支持支付宝支付" v-model="entity.supportAli"></el-checkbox>
              <el-checkbox label="支持微信支付" v-model="entity.supportWeixin" ></el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="服务商子商户">
        <el-switch v-model="entity.isSubmch" active-text="是" inactive-text="" @change="resetProps">
        </el-switch>
      </el-form-item>
      <!-- <el-form-item label="商户帐户">
        <el-switch v-model="entity.isMerchant" active-text="是" inactive-text="">
        </el-switch>
      </el-form-item>
      <el-form-item label="所属商户" prop="merchantId" v-show="entity.isMerchant">
        <merchant-select v-model="entity.merchantId"></merchant-select>
      </el-form-item> -->
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="entity.remark"></el-input>
      </el-form-item>
      
    </fieldset>
    <fieldset>
      <legend>帐户属性</legend>
      <el-form-item v-for="(item, index) in entity.props" :key="item.propName" :label="item.propName" :prop="'props.'+index+'.propValue'" :rules="{
        required: item.required, message: '不能为空', trigger: 'blur'
      }">
        <el-input v-model="item.propValue"></el-input>
      </el-form-item>
    </fieldset>
    <div style="margin-top:20px">
      <el-alert title="" type="success" :closable="false" >
      <el-form-item >
        <el-button type="danger" @click="submitForm" style="width:100px">保存</el-button>
      </el-form-item>
      </el-alert>
    </div>
  </el-form>
</template>
<style lang="less" scoped>
.el-upload-dragger {
  img {
    width: 300px;
    height: 300px;
  }
}
</style>

<script>
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import { defines, getPropFields } from "./SettleAccountPropDefine";

const defaultEntity = {
  id: null,
  status: 1,
  isSubmch:true,
  isMerchant: true,
  props: [],
  supportAli:false,
  supportWeixin:false,
  remark: ""
};
export default {
  components: { MerchantSelect },
  props:{
    type:{
      type:Number,
      default:1
    }
  },
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
      rules: {
        name: [
          { required: true, message: "中文名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    resetProps() {
      let type = this.entity.type;
      if (!type) {
        this.$message("请选择帐户类型");
        return;
      }

      let items = getPropFields(type);

      let props = this.entity.props || [];
      console.log(props);
      let propsMap = {};
      for (let i = 0; i < props.length; i++) {
        let p = props[i];
        propsMap[p.propKey] = p;
      }
      props.splice(0, props.length);
      for (let i = 0; i < items.length; i++) {
        let r = items[i];
        if(!r.isSubMch&&this.entity.isSubmch){
          continue;
        }
        props.push({
          propName: r.name,
          propKey: r.key,
          propValue: propsMap[r.key] == null ? "" : propsMap[r.key].propValue,
          id: propsMap[r.key] == null ? "" : propsMap[r.key].id,
          required: !!r.required
        });
      }
      this.entity.props = props;
    },
    setValues(vals) {
      this.resetEntity = _.cloneDeep(vals);
      this.entity = _.cloneDeep(this.resetEntity);
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = this.entity;
          if (!params.isMerchant) {
            params.merchantId = 0;
          }
          this.$api.ipark.SettleAccountService.save(params).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
      this.entity = _.cloneDeep(defaultEntity);
    },
    init(options) {
      
      this.resetForm();
      this.entity.type = this.type;
      this.resetProps();
      if (options.id) {
        //loadData
        this.$api.ipark.SettleAccountService.get(options.id).then(r => {
          r.isMerchant = !!r.merchantId;
          this.entity = r;
          this.entity.props = r.props || [];
          this.resetProps();
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