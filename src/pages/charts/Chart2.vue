<template>
    <div>
       <el-form :inline="true">
           <el-form-item label="车辆进出情况">
        <el-radio-group v-model="dateRangeModel"  size="mini" @change="onRangeChange">
            <el-radio-button :label="1">最近7天</el-radio-button>
            <el-radio-button :label="2">最近半个月</el-radio-button>
            <el-radio-button :label="3">最近1个月</el-radio-button>
        </el-radio-group>
        </el-form-item>
      </el-form>
        <div :id="chartId" style="width:100%;height:450px" ></div>
    </div>
</template>
<style lang="less" scoped>

</style>

<script>
import echarts from 'echarts' //引入echarts

var option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    
    legend: {
        data:['进场','出场']
    },
    xAxis: [
        {
            type: 'category',
            data: [],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '数量',
            min: 0,
            interval: 50,
            axisLabel: {
                formatter: '{value} '
            }
        }
    ],
    series: [
        {
            name:'进场',
            type:'bar',
            data:[]
        },
        {
            name:'出场',
            type:'bar',
            data:[]
        }
    ]
};

var chart0 = null;
        

export default {
  props: {},
  data() {
    return {
        chartId:new Date().getTime(),
        dateRangeModel:'1',
    };
  },
  methods: {
    onRangeChange(radio){
        let endDate = new Date();
        let startDate = null;
        switch(radio){
            case 1:startDate = this.$moment(endDate).subtract(7,'days');break;
            case 2:startDate = this.$moment(endDate).subtract(14,'days');break;
            case 3:startDate = this.$moment(endDate).subtract(1,'months');break;
        }
        
        this.$api.ipark.ReportService.findParkingReport({
            params:{
            startDate:startDate.format("YYYY-MM-DD HH:mm:ss"),
            endDate:this.$moment(endDate).format("YYYY-MM-DD HH:mm:ss")
            }
        }).then(rsp=>{
            
            this.updateChart(rsp.data||[]);
        })

    },
    getChart0(){
        if(this.chart0 == null){
            this.chart0 = echarts.init(document.getElementById(this.chartId));
            this.chart0.setOption(option);
        }
        return this.chart0;
    },
    updateChart(rs){
       let seriesData0 = rs.map(r=>r.totalEntryNum);
       let seriesData1 = rs.map(r=>r.totalLeaveNum);
       let category0 = rs.map(r=>r.entryOn);
       let c = this.getChart0();
       let cOption = c.getOption();
       cOption.xAxis[0].data = category0;
       cOption.series[0].data = seriesData0;  
       cOption.series[1].data = seriesData1;    
       c.setOption(cOption);
    },
    init(options = {}) {
        
        this.onRangeChange(1);
       
    }
  },
  created() {
    
  },
  mounted() {
    this.getChart0().setOption(option);
    
    this.$on("init", this.init);
  }
};
</script>
