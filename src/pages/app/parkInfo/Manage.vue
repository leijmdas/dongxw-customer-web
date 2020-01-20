<!--停车场管理-->
<template>
  <div>
    <el-alert title="停车场">
      <span style="margin-left:20px">共{{parkPage.total}}个</span>
    </el-alert>
    <!--<img  src="../../../assets/images/park.jpeg" />-->

    <el-row>
      <el-col :span="8" v-for="(p, index) in parkPage.data" :key="p.id" :offset="index >=0 ? 2 : 0"
              style="width:160px;margin-bottom: 20px">
        <el-card :body-style="{ padding: '0px' }">
          <div class="parkImg" >
            <el-tooltip content="场内付二维码" placement="top">
                   <img src="../../../assets/images/park.jpeg" @click="flushQrCode(p)"/>
            </el-tooltip>

          </div>

          <div style="padding: 12px;background:darkgrey;color: white;height: 50px">
            <el-tooltip content="车场详情" placement="top">
              <el-button type="text" align="center" @click="view(p)">
                {{ p.name }}
              </el-button>
            </el-tooltip>

            <div class="bottom clearfix">
              {{ p.code }}
              <!--<time class="time">{{ p.createOn }}</time>-->
              <span class="action">
              <el-button type="text" class="button" @click="view(p)">
                <i class="el-icon-view"></i>
              </el-button>
              <el-button type="text" title="场内付二维码" @click="flushQrCode(p)">
                <icon name="qrcode"></icon>
              </el-button>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <v-dialog title="信息查看" ref="formDiag">
      <form-panel  v-display="true"></form-panel>
    </v-dialog>

    <v-dialog title="扫码支付二维码" ref="qrDiag" width="400px">
      <el-alert title="链接" type="warning" :description="qrCode.content" :closable="false"></el-alert>
      <div class="panel panel-default" style="text-align:center;padding:10px">
        <img :src="qrCode.imgUrl" />
      </div>

    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
  .parkImg {
    height: 160px;
    width: 160px;
    cursor: pointer;
  img {

    width: 100%;
    height: 100%;
  }
}
.action {
  float:right;
}
</style>
<script>
  import CorpSelect from '@/components/widgets/CorpSelect.vue';
  import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
  import FormPanel from './Edit';
  import BindCorpPanel from './BindCorp';

  export default {
  components: { CorpSelect, FormPanel, BindCorpPanel, MerchantSelect },
  data() {
    return {
      formStatus: 1,
      qrCode: {},
      parkPage: { total: 0, data: [] }
    };
  },
  computed: {},

  methods: {
    view(row) {
      this.$refs.formDiag.show({ id: row.id });
    },

    flushQrCode(row) {
      this.$refs.qrDiag.show();
      this.$nextTick(() => {
        this.$api.ipark.ParkInfoService.scanQr(row.id).then(r => {
          this.qrCode = r;
        });
      });
    },

    init(options = {}) {
      this.search();
    },
    search() {

      let query = {
        orderBys: 'id|asc',
        param: {isDeleted: false},
        limit: 100
      };
      // this.$api.ipark.ParkInfoService.query(query).then(rsp => {
      //   //this.parkPage = rsp;
      // });
    }
  },
  created() {},
  mounted() {
    this.$on('init', this.init);
  }
};
</script>
