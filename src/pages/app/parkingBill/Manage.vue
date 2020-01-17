<!--商户帐单管理-->
<template>
  <div>

    <div class="panel panel-default panel-search">
      <el-form :inline="true" label-width="100px" >
        <el-form-item label="选择帐期" width="160">
          <el-select v-model="page.query.param.periodId" :clearable="true" style="width:100px">
            <el-option v-for="item in periodsData" :key="item.id" :value="item.id"
                       :label="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停车场" width="360">
          <el-select v-model="page.query.param.parkId" :clearable="true" style="width:100px">
            <el-option v-for="item in parkList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="pageBizType==2" label="状态" width="160">
          <el-select @onchange="search" v-model="page.query.param.status" :clearable="true" style="width:100px">
            <el-option v-for="item in $dict.store.BILL_APPLY_STATUS" :key="item[0]" :value="item[0]"
                       :label="item[1]"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button  @click="page.query.param = {}; search();" >取消</el-button>

        </el-form-item>
      </el-form>
    </div>

    <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">
      <el-table-column prop="seq" label="序号" width="50">

        <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

      </el-table-column>
      <el-table-column prop="parkName" label="停车场" width="200">
        <template slot-scope="{row}">
          {{row.viewBase.parkName}}
        </template>
      </el-table-column>
      <el-table-column prop="periodId" label="帐期" width="180">
        <template slot-scope="{row}">
          {{labelPriodsDate(row.startDate,row.endDate)}}
        </template>
      </el-table-column>
      <el-table-column prop="actualAmount" label="实收金额(元)" width="100">
        <template slot-scope="{row}">
          {{row.actualAmount}}
        </template>
      </el-table-column>
      <el-table-column prop="checkAmount" label="结算金额(元)" width="100">
        <template slot-scope="{row}">
          {{row.checkAmount}}
        </template>
      </el-table-column>
      <el-table-column prop="bizType" label="业务类型" width="100">
        <template slot-scope="{row}">
          {{$dict.getText(row.bizType, $dict.store.SERVICE_TYPE)}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="{row}">
          {{pageBizType==1?'已结算':$dict.getText(row.status, $dict.store.BILL_APPLY_STATUS)}}
        </template>
      </el-table-column>
      <el-table-column prop="createOn" width="160" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>
      <el-table-column   label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" @click="openDialogTakeoutDetail(row)" v-keycode="'ENTER'">查询明细</el-button>
          <!--<el-button type="default" @click="applyTakeoutClick(row)"
         <el-button type="default" @click="dialogFormVisibleApply = true"
                       v-if="pageBizType==2&&row.checkAmount!=0&&(row.status==1||row.status==4)">申请提现
          </el-button>-->
          <el-button type="default" @click="applyTakeoutClick(row)"
                     :disabled="checkPeriodTakeoutDisable(row)"
                     v-if="pageBizType==2&&row.checkAmount!=0&&(row.status==1||row.status==4)">申请提现
          </el-button>
        </template>

      </el-table-column>
    </v-table>


    <div>
      <el-dialog width="40%" title="申请提现" :visible.sync="dialogFormVisibleApply"  >

        <fieldset  width="100%">
          <legend>商户名称: {{applyTakeout.merchantName}}</legend>
          <el-form   ref="form" :rules="rules" label-width="100px" autocomplete="off">
            <el-row >
              <el-col :span="23" background-color="#545c64" >
                <el-form-item  label=" " prop="spaceline">

                </el-form-item>
                <el-form-item  label="银行名称" prop="bankName">
                  <el-input :disabled="true"  v-model="applyTakeout.bankName"></el-input>
                </el-form-item>
                <el-form-item  label="银行帐号" prop="bankAccountId">
                  <el-input :disabled="true"  v-model="applyTakeout.cardNo"></el-input>
                </el-form-item>
                <el-form-item label="银行户主" prop="bankAccountOwner">
                  <el-input :disabled="true"   v-model="applyTakeout.cardOwner"></el-input>
                </el-form-item>
                <el-form-item label="帐期" prop="periodId">
                  <el-input :disabled="true"   v-model="applyTakeout.periodId"></el-input>
                </el-form-item>
                <el-form-item label="金额(元)" prop="bankAccountOwner">
                  <el-input :disabled="true" :readonly = "true" v-model="applyTakeout.amount"></el-input>
                </el-form-item>
                <el-form-item label="交易密码" prop="password" >
                  <el-input type="password" name="password" clearable autocomplete="new-password" v-model="password"></el-input>
                </el-form-item>

                <el-form-item :rows="8" label="备注" prop="remark">
                  <el-input type="textarea" v-model="applyTakeout.remark"></el-input>
                </el-form-item>
              </el-col>

            </el-row>

          </el-form>
        </fieldset>
        <div slot="footer" class="dialog-footer1" >
          <el-button type="primary" :disabled="!enableTakeoutBtn" @click="confirmTakeoutClick">确 定</el-button>
          <el-button @click="dialogFormVisibleApply = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <v-dialog ref="managerPayListDialog" title="查看明细" height="300px">
      <ManagePayList></ManagePayList>
    </v-dialog>
  </div>


  <!--<el-dialog title="查看明细"   >-->
</template>

<style rel="stylesheet/less" scoped lang="less">
  .customDialogWidth {
    width: 300px;
  }

  .status_1 {
    color: gray;
  }

  .status_2 {
    color:blue;
  }
</style>
<script>
  import {fetch} from '@/utils';
  import ManagePayList from './ManagePayList';

  const defaultEntityapplyTakeout = {
    settlementPeriodId:0,

    periodId : 0,// '帐期标识',
    merchantId : 0,
    merchantName: '',
    parkId : 0,
    bizType: 0,
    amount: 0, //   '提现金额',
    payChannel:'银行卡',//     comment '支付渠道',
    bankName: '',
    cardNo :'',  //提现卡号',
    cardOwner :'', //       comment '持卡人',
    status      :1,//  状态进度 '0'
    applyDate : null, // '申请时间',
    remark     : '',
    auditRemark: ''
  };
export default {
  components: {
    ManagePayList
  },

      data() {
        return {
          enableTakeoutBtn : true,
          rules: {
            // password: [
            //   {required: true, message: '密码不能为空', trigger: 'blur'},
            //   {
            //     min: 1,
            //     max: 64,
            //     message: '长度在 1 到 64 个字符',
            //     trigger: 'blur'
            //   }
            // ]
          },

        nowPeriod: new Date().getFullYear() * 100 + new Date().getMonth() + 1,
        show: false,
        password: '',
        settleInfo: {},

        applyTakeout: _.cloneDeep(defaultEntityapplyTakeout),

        dialogFormVisibleDetail: false,
        dialogFormVisibleApply: false,

        //pageBizType:页面业务类型
        pageBizType: 1,
      // 帐期列表
      periodsData: [],
      // 车场列表
      parkList: [],
      // formStatus: 1,
      //orderDateRange: [],
      page: {
        query: {
          orderBys: 'opOn|desc',
          param: {
            //status: 1
          }
        },
        getData: this.$api.ipark.BillService.query

      },

      tableActions: [
        {
          name: '编辑',
          handle: this.edit
        },
        {
          name: '删除',
          handle: this.del,
          style: 'color:red'
        }
      ]
    };
  },
  computed: {},


  methods: {
    //检查帐期可提现
    checkPeriodTakeoutDisable(row){
      // console.log(JSON.stringify(row));
      // console.log(  this.nowPeriod > row.periodId );
      return  this.nowPeriod <= row.periodId;
    },

    openDialogTakeoutDetail(row) {
      function findPeriodData(id, lst) {

        for (let i = 0; i < lst.length; i++) {

          if (lst[i].id == id) {

            return lst[i];
          }
        }
        return {};
      }
      this.$refs.managerPayListDialog.show({

        bizType: row.bizType,
        periodId: row.periodId,
        parkId: row.parkId,
        actualAmount: row.actualAmount,
        checkAmount: row.checkAmount,


        periodData: findPeriodData(row.periodId, this.periodsData)
      });
    },


    labelPriodsDate(s, e) {
      return s + ' -> ' + e;
    },
    fillStatusMap() {
      st = this.$dict.store.BILL_APPLY_STATUS;
      this.mapBILL_APPLY_STATUS = {};
      for (var i = 0; i <st.length; i++){
          this.mapBILL_APPLY_STATUS[st[0]]=st[1];
      }
      return st;
    },
    create() {
      this.formStatus = 1;
      this.$refs.formPanel.init({});
    },
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    }
    ,
    applyTakeoutClick(row) {
      this.password = '';
      if(row.checkAmount<this.settleInfo.minAmount){
        this.$message('不能提现!提现金额小于最低限额'+this.settleInfo.minAmount);
        return;
      }
      this.dialogFormVisibleApply = true;

      this.$api.ipark.MerchantInfoService.getBank().then(r => {
        let entityBank = r.settlementInfoDTO;
        this.applyTakeout.merchantId = r.merchantInfoDTO.id;
        this.applyTakeout.merchantName = r.merchantInfoDTO.name;
        this.applyTakeout.parkId = row.parkId;
        this.applyTakeout.periodId = row.periodId;
        this.applyTakeout.amount = row.checkAmount;
        this.applyTakeout.bizType = this.pageBizType;
        this.applyTakeout.status = 2;
        this.applyTakeout.cardNo = r.settlementInfoDTO.bankAccountId;
        this.applyTakeout.cardOwner = r.settlementInfoDTO.bankAccountOwner;
        this.applyTakeout.bankName = r.settlementInfoDTO.bankName;

        this.applyTakeout.applyDate = this.formatDate(new Date());
        //帐单ID
        this.applyTakeout.settlementPeriodId = row.id;

      });
    },

    confirmTakeoutClick() {
      this.enableTakeoutBtn = false;
      let confirmReq = {
        password: this.password,

        //1 临停 2 预约
        bizType: this.applyTakeout.bizType,

        periodId: this.applyTakeout.periodId,
        merchantId: this.applyTakeout.merchantId,
        parkId: this.applyTakeout.parkId,
        remark: this.applyTakeout.remark

      };
      this.$api.ipark.ApplyTakeoutService.confirmTakeout(confirmReq).then(() => {
        this.$message('申请成功！');
        this.dialogFormVisibleApply = false;
        this.search();
      });
      // this.$api.ipark.MerchantInfoService.checkPayPasswd(this.password).then(() => {
      //
      //   this.$api.ipark.ApplyTakeoutService.findByNotNullProps(
      //     {
      //
      //       'settlementPeriodId': this.applyTakeout.settlementPeriodId,
      //       'parkId': this.applyTakeout.parkId,
      //       'periodId': this.applyTakeout.periodId,
      //       'merchantId': this.applyTakeout.merchantId
      //     }).then(
      //     result => {
      //       if (result.length > 0) {
      //         this.applyTakeout.id = result[0].id;
      //         this.$api.ipark.ApplyTakeoutService.update(this.applyTakeout).then(
      //           ret => {
      //             if(!ret.status){
      //               this.$message(ret.msg);
      //               return;
      //             }
      //             this.$api.ipark.BillService.updateStatus2Apply(this.applyTakeout.settlementPeriodId).then(
      //               rsp => {
      //                 this.$message('申请成功！');
      //                 this.search();
      //               }
      //             );
      //           });
      //       } else {
      //         this.applyTakeout.applyDate = null;
      //
      //         this.$api.ipark.ApplyTakeoutService.save(this.applyTakeout).then(
      //           ret => {
      //             this.$api.ipark.BillService.updateStatus2Apply(this.applyTakeout.settlementPeriodId).then(
      //               rsp => {
      //                 this.$message('申请成功！');
      //                 this.search();
      //               }
      //             );
      //           });
      //       }
      //     }
      //   );
      // });

    },

    edit(row) {
      this.formStatus = 2;
      this.$refs.formPanel.setValues(row);
    },
    del(row) {
      this.$confirm('确定删除此条记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        fetch.base.Brand.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      });
    },
    getUrlKey: function (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
    },
    init(options = {}) {
      //this.pageBizType = this.getUrlKey('bizType');
      this.pageBizType = this.$route.params.bizType;
      if (this.pageBizType == null) {
        this.pageBizType = localStorage.pageBizType;
      } else {
        localStorage.pageBizType = this.pageBizType;
      }

      // alert(JSON.stringify(this.$route.params));
      // alert( this.pageBizType  );
      this.page.query.param.bizType = this.pageBizType;

      //查询帐期
      this.$api.ipark.BillService.queryPeriod().then(rsp => {
        this.periodsData = rsp.data;
        console.log(JSON.stringify(this.periodsData));
      });
      //查询 停车场 列表
      this.$api.ipark.BillService.queryParkList().then(rsp => {
        this.parkList = rsp;
        //console.log(JSON.stringify(rsp));
      });
      this.$api.ipark.MerchantInfoService.getSettlementInfo().then(
        rsp => {
          this.settleInfo = rsp;
          //alert(JSON.stringify(this.settleInfo));
        });
      this.search();
    },
    search() {
      this.page.query.dateRanges = {};

      if (this.orderDateRange != null && this.orderDateRange.length > 0) {
        this.page.query.dateRanges['payTime'] = {
          startDate: this.orderDateRange[0],

          endDate: this.orderDateRange.length > 1 ? this.orderDateRange[1] : null
        };
      }
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.$on('init',this.init);
  }
};
</script>
