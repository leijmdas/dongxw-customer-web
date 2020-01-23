<!--模板名称选择-->

<template>
    <el-select :width="width" v-model="currentValue" placeholder="请选择" filterable :loading="loading"
               :clearable="clearable" :disabled="disabled" @change="handleChange">

        <el-option  v-for="item in options" :key="item.id"
                    :label="item.customerOrderCode"   :value="item.id" :disabled="item.disabled">
            <span style="float: left">{{ item.customerOrderCode }}</span>
            <span style="float: left">{{ item.epOrderCode }}</span>

        </el-option>
    </el-select>
</template>
<style rel="stylesheet/less" lang="less">
    /*.el-select {*/
        /*width: 250px;*/
    /*}*/
    .el-select-dropdown__item span{
        width:140px;
        text-align:left;
    }
</style>
<script>
    import { fetch } from "@/utils";

    export default {
        data () {
            return {
                loading: false,
                options: [],
                disOpts: []
            }
        },
        props: {
            fnChange:{
                required:false,
                type:Function
            },
            value: {
                required: true
            },
            width: {
                type: String,
                required: false,
                defult: "60%"
            },
            clearable: {
                type: Boolean
            },

            disabled: {
                type: Boolean
            },
            customerId: {
               // type: Number,
            },
            orderType:{
                type:Number,
                required:false,
                default : null
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
            customerId: {
                handler: function(newVal, oldVal) {
                    // this.value = ''
                    // this.currentValue = ''
                    this.refresh();
                },
                deep: true
            }
        },
        methods: {
            handleChange(val) {
                this.$emit('change', val)
                if (this.fnChange) {
                    this.fnChange();
                }
            },
            refresh() {
                this.loading = true
                this.$api.customer.OrderMaster.query(
                    {
                        param: {
                            customerId: this.customerId,
                            orderType: this.orderType,
                            isDeleted: false
                        }
                    }
                ).then(rsp => {
                    this.options = rsp.data
                    this.loading = false
                })
            }
        },
        created() {
            this.refresh()
        }
    }
</script>
