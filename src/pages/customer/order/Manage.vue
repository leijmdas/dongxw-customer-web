<!--订单管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">


                <el-form-item label="日期">

                    <div slot="label">
                        <el-select v-model="dateRangeType" filterable clearable style="width:120px" class="formitem-label">
                            <el-option value="orderDate" label="下单日期"></el-option>
                            <el-option value="customerIssueDate" label="客户交货日期"></el-option>
                            <el-option value="checkDate" label="验货日期"></el-option>
                            <el-option value="factroyIssueDate" label="工厂交货日期"></el-option>
                        </el-select>
                    </div>
                    <el-date-picker style="width:270px" v-model="dateRange" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期"
                                    format="yyyy年MM月dd日"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>

                    <el-form-item label="EP订单号" prop="epOrderCode">
                        <el-input v-model="page.query.param.epOrderCode" clearable></el-input>
                    </el-form-item>


                    <el-form-item label="客户订单号" prop="customerOrderCode">
                        <el-input v-model="page.query.param.customerOrderCode" clearable></el-input>
                    </el-form-item>




                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select :clearable="true" v-model="page.query.param.status" style="width:100px">
                        <el-option v-for="item in $dict.store.ORDER_STATUS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单类型" prop="orderType">
                    <el-select @change="search" :clearable="true" v-model="page.query.param.orderType" style="width:100px">
                        <el-option v-for="item in $dict.store.ORDER_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>


            </el-form>
        </div>
            <v-toolbar title="数据列表" type="alert">
                <span slot="tip" style="margin-left:60px;">

                </span>
                <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                <el-button @click="cancel">取消</el-button>

                <el-button type="primary" plain @click="create">新增</el-button>

                <el-button plain @click="exportRecords">导出 XLS</el-button>
                <!--<el-button plain @click="exportMail" style="color:green" >发送邮件</el-button>-->
           </v-toolbar>
        <v-table ref="table" :page="page" :dblclick="showLine" :click="clickRow" :table-minheight="450" @dataloaded="onDataloaded">

            <el-table-column prop="seq" label="序号" width="50">
                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
            </el-table-column>

            <el-table-column prop="orderType" label="订单类型" width="70">
                <template slot-scope="{row}">
                    <span :style="'style:red'"> {{$dict.getText(row.orderType,$dict.store.ORDER_TYPE)}}</span>
                </template>
            </el-table-column>



            <el-table-column prop="customerId" label="客户代码" width="80">
                <template slot-scope="{row}">
                    {{ row.customer?row.customer.custNo:'-'}}
                 </template>
            </el-table-column>


             <el-table-column @click="view(scope.row)" prop="customerOrderCode" label="客户订单号+原件" width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="view(scope.row)" v-if="scope.row.customerOrderImg" plain>{{scope.row.customerOrderCode}}</el-button>
                    <span v-if="!scope.row.customerOrderImg"> {{scope.row.customerOrderCode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="epOrderCode" label="EP订单号" width="120"></el-table-column>


            <el-table-column  prop="status" label="订单状态" width="80">
                <template slot-scope="{row}">
                    <span :style="'style:red'"> {{$dict.getText(row.status,$dict.store.ORDER_STATUS)}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="moneyType" label="结算币种" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.moneyType,$dict.store.MONEY_TYPE)}}
                </template>
            </el-table-column>
            <!--<el-table-column prop="businessBy" label="业务员" width="100"></el-table-column>-->

            <el-table-column prop="orderDate" label="下单日期" width="100">
                <template slot-scope="{row}">
                {{ $dict.viewDate(row.orderDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="customerIssueDate" label="客户交货日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.customerIssueDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="checkDate" label="验货日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.checkDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="factroyIssueDate" label="工厂交货日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.factroyIssueDate)}}
                </template>
            </el-table-column>

            <el-table-column prop="invoiceNoIni" label="预收发票编号" width="120"></el-table-column>
            <el-table-column prop="invoiceNo" label="正式发票编号" width="120"></el-table-column>


            <el-table-column prop="createDate" label="建档时间" width="150">
            </el-table-column>
            <el-table-column prop="createBy" label="建档人" width="150">
            </el-table-column>

            <el-table-column prop="remark" label="备注"></el-table-column>

            <el-table-column width="145" label="操作" :fixed="'right'">
                <template slot-scope="scope">

                    <el-button type="text" title="编辑" @click="edit(scope.row)">
                        <i class="el-icon-edit"></i>
                    </el-button>

                    <el-button  v-if="scope.row.orderType!=100" style="color:green"  type="info" plain title="产品" @click="showLine(scope.row)">
                        产品
                    </el-button>
                    <el-tooltip class="item" effect="green" content="只有草稿状态才可以删除!" placement="top-start">
                        <el-button type="text" style="color:red" @click="del(scope.row,scope.$index)" title="删除"
                                   v-if="scope.row.status==0">
                            <i style = "color:red" class="el-icon-delete"></i>
                        </el-button>
                    </el-tooltip>

                    <!--<el-button v-if="scope.row.orderType==20" type="info" @click="showLine(scope.row)" >增加子订单</el-button>-->

                </template>
            </el-table-column>

        </v-table>




    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
    .el-input{
        width: 160px;
    }
</style>
<script>

    export default {
        components: { },
        props: {
            fatherMethod: {
                type: Function,
                default: null
            },
            funShowPic: {
                type: Function,
                default: null
            },

        },
        data() {
            return {
                dateRangeType: 'orderDate',
                row : null,
                formStatus: 1,
                dateRange: [],
                summaryMap: {},
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            customerId: undefined,
                            isDeleted: false
                        }
                    },
                    getData: this.$api.customer.OrderMaster.query
                },
                tableActions: [
                    {
                        name: "编辑",
                        handle: this.edit
                    },
                    {
                        name: "删除",
                        handle: this.del,
                        style: "color:red"
                    }
                ]
            };
        },
        computed: {},

        methods: {
            onDataloaded(rsp) {

            },
            getSearchParams() {
                this.page.query.dateRanges = {};
                if (this.dateRangeType != null && this.dateRange && this.dateRange.length > 0) {
                    this.page.query.dateRanges[this.dateRangeType] = {
                        startDate: this.dateRange[0],
                        endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
                    };
                }
                return this.page.query;
            },
            /*
            导出
            */
            exportRecords() {
                let self = this;
                this.$confirm("确定要导出所有查询的记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    let params = self.getSearchParams();
                    self.$api.customer.OrderMaster.export(params);

                });

            },
             /*发送邮件
             * */
            exportMail() {
                let self = this;
                this.$confirm("确定要发送订单记录的邮件吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    let params = self.getSearchParams();
                    self.$api.customer.OrderMaster.exportMail(params);

                });

            },
            create() {
                this.$refs.formDiag.show();
            },
            edit(row) {
                this.$refs.formDiag.show({id: row.id});
            },
            clickRow(row) {
                this.row = row;
                console.log(row);
            },

            view(row) {
                this.$refs.formDiagView.show({id: row.id});
            },

            del(row) {
                this.$confirm("确定删除此条记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.$api.customer.OrderMaster.deleteById(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    });
                });
            },
            onFormSaved() {
                this.$refs.formDiag.hide();
                this.$nextTick(this.search);
            },
            init(options = {}) {
                this.row = null;
                this.search();
            },
            search() {
                this.getSearchParams();
                this.$refs.table.load();
            },
            cancel() {
                this.dateRangeType=null;
                this.dateRange = [];
                this.page.query.param = {};
                this.search();
            },


        },

        created() {
        },
        mounted() {
            this.$on("init", this.init);
        }
    };
</script>
