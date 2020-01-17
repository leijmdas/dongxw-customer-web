<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="停车场">
          <park-select v-model="page.query.param.parkId" :clearable="true"></park-select>
        </el-form-item>
        <el-form-item>
          <div slot="label">
            <el-select v-model="dateRangeType" style="width:120px" class="formitem-label">
              <el-option value="entryOn" label="进场时间"></el-option>

              <el-option value="leaveOn" label="出场时间"></el-option>

              <el-option value="createOn" label="记录时间"></el-option>
            </el-select>
          </div>

          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="page.query.param.status" :clearable="true" style="width:85px" class="formitem-label">
                <el-option v-for="item in $dict.store.ACCESS_STATUS" :value="item[0]" :key="item[0]" :label="item[1]"></el-option>
              </el-select>
          </el-form-item>

        <el-form-item label="车牌号" >
          <el-input v-model="page.query.param.carNum" style="width:120px"></el-input>
        </el-form-item>
         <!--<el-form-item label="业务流水号" >-->
          <!--<el-input v-model="page.query.param.clientSn"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button   @click="cancel"  >取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">
      <el-table-column prop="code" label="停车场">
        <template slot-scope="{row}">{{row.parkInfo.name}}</template>
      </el-table-column>
      <el-table-column prop="clientSn" label="业务流水号(地端)" width="140"></el-table-column>
      <el-table-column prop="voucherNo" label="停车凭证号" width="140"></el-table-column>
      <el-table-column prop="carNum" label="车牌号" width="100"></el-table-column>
      <el-table-column prop="entryOn" label="进场时间" width="140"></el-table-column>
      <el-table-column prop="leaveOn" label="出场时间" width="140"></el-table-column>

      <el-table-column prop="stayTime" label="停留时长(分)" width="140">
         <template slot-scope="{row}">{{Math.floor(row.stayTime/60/1000)}}</template>
      </el-table-column>
      <el-table-column prop="lastPayedOn" width="140" label="最近成功支付时间">
        <template slot-scope="{row}">{{row.lastPayedOn}}</template>
      </el-table-column>
      <el-table-column prop="createOn" width="80" label="状态">
        <template slot-scope="{row}">{{$dict.getText(row.status,$dict.store.ACCESS_STATUS)}}</template>
      </el-table-column>
      <el-table-column prop="createOn" label="创建时间">
        <template slot-scope="{row}">{{row.createOn}}</template>
      </el-table-column>
      <!-- <el-table-column width="80" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="查看" @click="edit(scope.row)">
            查看
          </el-button>


        </template>
      </el-table-column> -->
    </v-table>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
  import ParkSelect from '@/components/widgets/ParkSelect';

  export default {
  components:{ParkSelect},
  data() {
    return {
      formStatus: 1,

      dateRange: [],

      dateRangeType: 'entryOn',

      page: {
        query: {
          orderBys: 'id|desc',

          param: {
            status: null
          },

          dateRanges: {}
        },

        getData: this.$api.ipark.AccessInfoService.query
      }
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

    init(options = {}) {
      if(this.$route.query.status){
        let now = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        this.dateRange = [now,now];
        this.page.query.param.status=parseInt(this.$route.query.status);
      }
      this.search();
    },

    cancel() {
      this.dateRange = [],

        this.page.query = {
          orderBys: 'id|desc',

          param: {
            status: null
          },

          dateRanges: {}
        };

      this.search();
      },

    search() {
      this.page.query.dateRanges = {};

      if (this.dateRangeType != null &&this.dateRange&& this.dateRange.length > 0) {
        this.page.query.dateRanges[this.dateRangeType] = {
          startDate: this.dateRange[0],

          endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
        };
      }

      this.$refs.table.load();
    }
  },

  created() {},

  mounted() {
    this.$on('init', this.init);

  }
};
</script>
