<!--规则定义 -->
<template>
    <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" @change="handleChange">
        <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" :disabled="item.disabled">
        </el-option>
    </el-select>
</template>

<script>
  let allOptions = [];
  export default {
    data () {
      return {
        loading: false,
        options: [],
        disOpts: []
      }
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
      emptyLabel: {
        required: false
      },
      discountType:{
        required:true,
        default:0
      }
    },
    computed: {
      currentValue: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      discountType: function () {
        this.refresh()
      }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val,this.options)
      },
      refresh(){
        this.options = allOptions.filter(item=>item.discountType==this.discountType);
        let tmp = this.options.filter(item=>item.code==this.value);
        if(tmp.length<1){
          this.currentValue = '';
        }
      },
      loadAll () {
        this.loading = true
        this.$api.ipark.PromotionInfoService.getRuleDefs({}).then(rs => {
          allOptions = rs||[]
          //this.options = rs
          this.loading = false
          this.$emit('loaded',rs)

          this.refresh();
        })
      }
    },
    created () {
      this.loadAll()
    }
  }
</script>
