<!--订单生产计划管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <!--<el-form-item label="客户" prop="customerId">-->
                    <!--<customer-select :fnChange="search" v-model="page.query.param.customerId"-->
                                     <!--:clearable="true"></customer-select>-->

                <!--</el-form-item>-->
                <el-form-item label="订单" prop="orderId">
                    <order-master-select :fnChange="search" :customerId="page.query.param.customerId"
                                         v-model="page.query.param.orderId" :clearable="true">
                    </order-master-select>
                </el-form-item>

                <!--<el-dropdown @command="handleCommand">-->
                    <!--<el-button type="primary" :disabled="disabledAddBtn" >-->
                        <!--同步订单计划<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                    <!--</el-button>-->
                    <!--<el-dropdown-menu slot="dropdown">-->
                  <!--<el-dropdown-item command="add">新增订单计划</el-dropdown-item>-->
                  <!--<el-dropdown-item command="del">删除计划多余产品</el-dropdown-item>-->
                  <!--<el-dropdown-item command="check">检查订单计划</el-dropdown-item>-->
                  <!--&lt;!&ndash;<el-dropdown-item command="del">删除订单计划</el-dropdown-item>&ndash;&gt;-->
                  <!--</el-dropdown-menu>-->
                <!--</el-dropdown>-->
                <!--<el-form-item label="外发标志" prop="outFlag">-->
                    <!--<el-select @change="search" clearable style="width:100%" v-model="page.query.param.outFlag">-->
                        <!--<el-option v-for="item in $dict.store.OUT_FLAG" :key="item[0]" :value="item[0]"-->
                                   <!--:label="item[1]"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="日期">

                    <div slot="label">
                        <el-select v-model="dateRangeType" filterable clearable style="width:120px" class="formitem-label">
                            <el-option value="orderDate" label="接单日期"></el-option>
                            <el-option value="issueDate" label="要求交期"></el-option>
                            <el-option value="rmDate" label="物料到位日期"></el-option>
                            <el-option value="pkgDate" label="包材到位日期"></el-option>
                            <el-option value="planStart" label="计划上线日期"></el-option>
                            <el-option value="planEnd" label="计划完成日期"></el-option>
                            <el-option value="realEnd" label="实际完成日期"></el-option>
                        </el-select>
                    </div>
                    <el-date-picker style="width:270px" v-model="dateRange" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期"
                                    format="yyyy年MM月dd日"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>

                    <!--<el-form-item label="EP订单号" prop="epOrderCode">-->
                        <!--<el-input v-model="page.query.param.epOrderCode" clearable></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="客户订单号" prop="customerOrderCode">-->
                        <!--<el-input v-model="page.query.param.customerOrderCode" clearable></el-input>-->
                    <!--</el-form-item>-->

                </el-form-item>
                <!--<el-form-item label="状态" prop="status">-->
                    <!--<el-select :clearable="true" v-model="page.query.param.status" style="width:100px">-->
                        <!--<el-option v-for="item in $dict.store.ORDER_STATUS" :key="item[0]" :value="item[0]"-->
                                   <!--:label="item[1]"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->


                <!--<el-form-item label="订单类型" prop="orderType">-->
                    <!--<el-select @change="search" :clearable="true" v-model="page.query.param.orderType" style="width:100px">-->
                        <!--<el-option v-for="item in $dict.store.ORDER_TYPE" :key="item[0]" :value="item[0]"-->
                                   <!--:label="item[1]"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>

            </el-form>
        </div>
            <v-toolbar title="数据列表" type="alert">

                <!--<el-button style="margin-left: 30px" slot="tip" type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>-->
                <!--<el-button slot="tip" @click="cancel">取消</el-button>-->

                <el-button plain @click="exportRecords">导出 XLS</el-button>
           </v-toolbar>
        <v-table ref="table" :page="page" :dblclick="edit" :table-minheight="450" @dataloaded="onDataloaded">

            <el-table-column prop="seq" label="序号" width="50">
                <template slot-scope="scope">  {{scope.$index + 1}}  </template>
            </el-table-column>


            <!--<el-table-column prop="outFlag" label="外发标志" width="70">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span :style="row.outFlag==1?'color:blue':''">-->
                    <!--{{$dict.getText(row.outFlag,$dict.store.OUT_FLAG)}}-->
                        <!--</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="customerId" label="客户代码" width="80">-->
                <!--<template slot-scope="{row}">-->
                    <!--{{ row.customer?row.customer.custNo:'-'}}-->
                 <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="customerId" label="客户名称" width="100">
                <template slot-scope="{row}">
                    {{ row.customer?row.customer.custName:'-'}}
                </template>
            </el-table-column>

            <!--<el-table-column prop="epOrderCode" label="EP订单号" width="120"></el-table-column>-->
            <el-table-column prop="customerOrderCode" label="客订单号" width="110">
                <template slot-scope="{row}">
                    {{ row.orderMaster?row.orderMaster.customerOrderCode:'-'}}
                </template>
            </el-table-column>

            <el-table-column prop="code" label="客款号" width="100">
                <template slot-scope="{row}">
                    {{ row.product?row.product.code:'-'}}
                </template>
            </el-table-column>
          <el-table-column prop="remark" label="产品描述">
            <template slot-scope="{row}">
              {{ row.product?row.product.remark:'-'}}
            </template>
          </el-table-column>
            <el-table-column prop="color" label="颜色" width="80">
                <template slot-scope="{row}">
                    {{ row.product?row.product.color:'-'}}
                </template>
            </el-table-column>

            <el-table-column prop="qty" label="数量" width="100">
                <template slot-scope="{row}">
                    {{ row.orderLine?row.orderLine.qty:'-'}}
                </template>
            </el-table-column>

            <!--<el-table-column prop="businessBy" label="业务员" width="100"></el-table-column>-->

            <el-table-column prop="orderDate" label="接单日期" width="100">
                <template slot-scope="{row}">
                {{ $dict.viewDate(row.orderDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="issueDate" label="要求交期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.issueDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="rmDate" label="物料到位日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.rmDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="pkgDate" label="包材到位日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.pkgDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="planStart" label="计划上线日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.planStart)}}
                </template>
            </el-table-column>
            <el-table-column prop="planEnd" label="计划完成日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.planEnd)}}
                </template>
            </el-table-column>
            <el-table-column  prop="finishFlag" label="是否完成" width="75">
                <template slot-scope="{row}">
                    <span :style="row.finishFlag==0?'color: red':'color: green'">
                        {{$dict.getText(row.finishFlag,$dict.store.FINISH_FLAG)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="realEnd" label="实际完成日期" width="100">
                <template slot-scope="{row}">
                    {{ $dict.viewDate(row.realEnd)}}
                </template>
            </el-table-column>

            <!--<el-table-column  prop="status" label="订单状态" width="80">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span :style="row.status==0?'color: red':''">-->
                        <!--{{$dict.getText(row.orderMaster?row.orderMaster.status:-1,$dict.store.ORDER_STATUS)}}-->
                    <!--</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="remark" label="备注"></el-table-column>-->

            <!--<el-table-column prop="createDate" label="建档时间"  >-->
                <!--<template slot-scope="{row}">-->
                    <!--{{ $dict.viewDate(row.createDate)}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="createByName" label="建档人" width="100">-->
            <!--</el-table-column>-->

            <!--<el-table-column  width="80" label="操作" :fixed="'right'">-->
                <!--<template slot-scope="scope">-->
                   <!---->
                    <!--<el-button type="text" title="编辑" @click="edit(scope.row)">-->
                        <!--<i class="el-icon-edit"></i>-->
                    <!--</el-button>-->


                    <!--<el-tooltip class="item" effect="green" content="只有草稿状态才可以删除!" placement="top-start">-->
                        <!--<el-button type="text" style="color:red" @click="del(scope.row,scope.$index)" title="删除"   >-->
                            <!--<i style = "color:red" class="el-icon-delete"></i>-->
                        <!--</el-button>-->
                    <!--</el-tooltip>-->

                    <!---->
                <!--</template>-->
            <!--</el-table-column>-->

        </v-table>


        <v-dialog ref="formDiag" title="信息编辑" :width="'50%'">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button type="default" @click="()=>{$refs.formDiag.hide()}">取消</el-button>
            </div>
        </v-dialog>


    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
    .el-input{
        width: 160px;
    }
    .el-dropdown {
        vertical-align: top;
    }
    .el-dropdown + .el-dropdown {
        margin-left: 15px;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>
<script>
    import CustomerSelect from '@/components/customer/CustomerSelect.vue';
    import OrderMasterSelect from '@/components/customer/OrderMasterSelect.vue';

    export default {
        components: {OrderMasterSelect,  CustomerSelect},
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
                    getData: this.$api.customer.MakePlan.query
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
        computed: {
            disabledAddBtn: {
                get() {
                    return this.page.query.param.orderId <= 0
                },
            },
        },

        methods: {

            handleCommand(command) {
                if (command === "add") {
                    this.makePlan();
                } else {
                    this.$message('click on item ' + command);

                }
            },
            onDataloaded(rsp) {

            },
            makePlan() {
                let self = this;

                this.$confirm("确定要新增订单产品计划吗?", "提示：可多次操作，已增加不会重复。", {
                    type: "warning"
                }).then(() => {

                    self.$api.customer.MakePlan.makePlanByOrder(this.page.query.param.orderId).then(rsp => {
                        self.search()
                        self.$msgJsonResult(rsp)
                    });

                });
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
                    self.$api.customer.MakePlan.export(params);

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
                    self.$api.customer.MakePlan.exportMail(params);

                });

            },
            create() {
                this.$refs.formDiag.show();
            },
            edit(row) {
                this.$refs.formDiag.show({id: row.id});
            },
            clickRow(row) {
                //this.row = row;
                //console.log(row);
            },

            view(row) {
                this.$refs.formDiagView.show({id: row.id});
            },
            toggleStatus(row) {

            },
            del(row) {
                this.$confirm("确定删除此条记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.$api.customer.MakePlan.deleteById(row.id).then(rsp => {
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
                this.$refs.table.currentPage = 1;
                this.$refs.table.load();
            },
            cancel() {
                this.dateRangeType=null;
                this.dateRange = [];
                this.page.query.param = {};
                this.search();
            },
            clickbtn() {
                this.$alert('这是一段内容', '标题名称', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: `action: ${ action }`
                        });
                    }
                });
            },
            showLine(row) {
                console.log(JSON.stringify(row));
                console.log("fatherMethodL: " + this.fatherMethod);
                if (row.orderType != 100 && this.fatherMethod) {
                    this.fatherMethod(row);
                }
                if (row.orderType == 100){
                    this.$message("父订单没有产品清单！")
                }
            },
            showPic(row) {
                console.log(JSON.stringify(row));
                console.log("funShowPic: ");
                console.log( this.funShowPic);
                if (this.funShowPic) {
                    this.funShowPic(row);
                }

            },
            getRow() {
                console.log(this.row);

                if (this.row) {
                    return this.row;
                }else{
                }
                console.log(this.$refs.table.tableData);
                if (this.$refs.table.tableData) {
                    this.row = this.$refs.table.tableData[0];
                }
                return this.row;
            }
        },

        created() {
        },
        mounted() {
            this.$on("init", this.init);
        }
    };
</script>
