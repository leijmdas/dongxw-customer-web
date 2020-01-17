<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default">
      
    <el-alert title="" type="warning" :closable="false" >
        尚未开通支付宝支付，<span style="float:right">请谨慎配置帐户信息！</span>
      </el-alert>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="onTabClick">
    <el-tab-pane label="微信支付" name="weixin"><form-panel :type="1" @saved="onFormSaved" ref="weixinPayForm"></form-panel></el-tab-pane>
    <el-tab-pane label="支付宝支付" name="ali" :disabled="true"><form-panel :type="2" @saved="onFormSaved" ref="aliPayForm"></form-panel></el-tab-pane>

  </el-tabs>
  </div>
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
      activeTab:'weixin',
      accounts:[]
    };
  },
  computed: {},

  methods: {
    onTabClick(tab){
      let account = this.getPayAccount(tab.name=='weixin'?1:'2');
      switch(tab.name){
        case 'weixin':this.$refs.weixinPayForm.$emit('init',{id:account==null?null:account.id});break;
        case 'ali':this.$refs.aliPayForm.$emit('init',{id:account==null?null:account.id});break;
      }
    },
    getPayAccount(type){
      let rs = this.accounts.filter(r=>r.type==type)
      return rs.length<1?null:rs[0];
    },
    onFormSaved(){
      this.$message('保存成功！');
    },
    init(options = {}) {
      this.search();
    },
    search() {
      this.$api.ipark.SettleAccountService.query({start:0,limit:-1}).then(rsp=>{
        let rs = rsp.data||[];
        this.accounts = rs;
        this.activeTab = 'weixin';
        this.onTabClick({name:'weixin'});
      })
    }
  },
  created() {},
  mounted() {
    this.$on("init", this.init);
  }
};
</script>
