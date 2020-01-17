<!--停车场管理-->
<template>
  <div>


    <div class="panel panel-default panel-search">
      <el-form :inline="true" label-width="100px">
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
        <el-form-item label="业务类型" width="100">
          <el-select @onchange="search" v-model="page.query.param.bizType" :clearable="true" style="width:100px">
            <el-option v-for="item in $dict.store.SERVICE_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="进度" width="160">
          <el-select @onchange="search" v-model="page.query.param.status" :clearable="true" style="width:100px">
            <el-option v-for="item in $dict.store.BILL_APPLY_STATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button  @click="page.query.param = {}; search();" >取消</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" class="panel-main" :table-minheight="550">
      <el-table-column prop="seq" label="序号" width="60">

        <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

      </el-table-column>

   <!--   <el-table-column prop="id" label="提现单号" width="100">
        <template slot-scope="{row}">
          <span :title="row.id">{{row.id}}</span>
        </template>
      </el-table-column>-->

      <el-table-column prop="parkId" label="停车场名称" width="240">
        <template slot-scope="{row}">
          {{findParkName(row.parkId)}}
        </template>

      </el-table-column>
      <el-table-column prop="periodId" label="帐期" width="180">
        <template slot-scope="{row}">
          {{findPeriodName(row.periodId)}}
        </template>

      </el-table-column>
      <el-table-column prop="bizType" label="业务类型" width="80">
        <template slot-scope="{row}">
          {{$dict.getText(row.bizType,$dict.store.PAY_BIZ_TYPE)}}
        </template>
      </el-table-column>


      <el-table-column prop="amount" label="提现金额(元)" width="100">
      </el-table-column>

      <!--merchantId-->
      <el-table-column prop="payChannel" label="渠道类型" width="80">
      </el-table-column>
      <el-table-column prop="bankName" label="银行名称" width="160">
      </el-table-column>

      <el-table-column prop="cardNo" label="卡号" width="160">
      </el-table-column>
      <el-table-column prop="cardOwner" label="持卡人" width="140">
      </el-table-column>
      <el-table-column prop="status" label="进度" width="100">
        <template slot-scope="{row}">
          {{row.bizType==1?'已结算':$dict.getText(row.status, $dict.store.BILL_APPLY_STATUS)}}
        </template>
      </el-table-column>


      <el-table-column prop="applyDate" label="申请时间" width="140">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>


    </v-table>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
  .status_1{
    color:gray;
  }
  .status_2{
    color:blue;
  }
</style>
<script>
  import {fetch} from '@/utils';

  export default {
  data() {
    return {
      seq : 0,
      // 帐期列表
      periodsData: [],
      // 车场列表
      parkList : [],
      formStatus: 1,
      orderDateRange:[],
      page: {
        query: {
          orderBys:'periodId|desc,applyDate|desc',
          param: {}
        },
        getData: this.$api.ipark.ApplyTakeoutService.query
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
    create() {
      this.formStatus = 1;
      this.$refs.formPanel.init({});
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
    genSeq( row ) {
      this.seq=this.seq+1;
      row.seq=this.seq;
      return row.seq;
    },
    findPeriodName(id) {
      for (var i = 0; i < this.periodsData.length; i++) {
        if (this.periodsData[i].id == id) {
          return  this.periodsData[i].startDate.substring(0,10)+ ' -> ' + this.periodsData[i].endDate.substring(0,10);
        } // console.log(i,"类型："+typeof i,arr[i]);
      }
      return id;
    },
    findParkName(parkId) {
      for (var i = 0; i < this.parkList.length; i++) {
        if (this.parkList[i].id == parkId) {
          return this.parkList[i].name;
        } // console.log(i,"类型："+typeof i,arr[i]);
      }
      return parkId;
    },

    init(options={}){
      //查询帐期
      this.$api.ipark.BillService.queryPeriod().then(rsp => {
        this.periodsData = rsp.data;
        console.log(JSON.stringify(rsp));
        //alert(JSON.stringify(this.periodsData));
      });
      //查询 停车场 列表
      this.$api.ipark.BillService.queryParkList().then(rsp => {
        this.parkList = rsp;
        //console.log(JSON.stringify(rsp));
        //alert(JSON.stringify(this.periodsData));
      });
      this.search();
    },
    search() {
      this.seq = 0;
      //this.orderDateRange=["2019-05-01 00:00:00",  "2019-05-31 00:00:00"];
      this.page.query.dateRanges = {};
      if (this.orderDateRange != null && this.orderDateRange.length > 0) {
        this.page.query.dateRanges['applyDate'] = {
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
