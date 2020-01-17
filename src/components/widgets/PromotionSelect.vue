<!--规则定义 -->
<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <el-option v-for="item in options" :key="item.id" :label="'['+item.code+'] '+item.name" :value="item.id">

       <span style="float: left">[{{item.code}}] {{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.discountCondition}}</span>
        <div style="clear:both">{{item.startOn}} ~ {{item.endOn}}</div>
    </el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      options: [],
      disOpts: []
    };
  },
  props: {
    value: {
      required: true
    },
    clearable: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    
  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
 
  methods: {
    remoteMethod(query){
      let params = {
          sortBys:'id|desc',
          keywords:query,
          param: {
            status:1,
            isDeleted:false
          }
        }
      this.$api.ipark.PromotionInfoService.query(params).then(rsp=>{
        this.options = rsp.data||[]
      });
    }
  },
  created() {
    this.remoteMethod();
  }
};
</script>
