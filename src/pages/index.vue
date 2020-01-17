<template>
	<div  >
		<el-row>
			<el-row :span="8">
				<div class="panel panel-default panel0" >
					<div class="title">当日情况</div>
					<div class="panel-body">
						<ul style="height:80px">
							<li>
								<div class="num">
									<a href="javascript:void(0)" @click="gotoAccessManage()">{{currentDayParking.totalNum}}</a></div>
								<div>进场数</div>
							</li>
							<li>
								<div class="num">
									<a href="javascript:void(0)" @click="gotoAccessManage(1)">{{currentDayParking.totalPayedNum}}</a></div>
								<div>已支付数</div>
							</li>
							<li>
								<div class="num"><a href="javascript:void(0)" @click="gotoAccessManage(2)">{{currentDayParking.totalLeaveNum}}</a></div>
								<div>已离场数</div>
							</li>
						</ul>
					</div>
				</div>
			</el-row>
		</el-row>
		<div class="panel panel-default panel0" style="width:100%;height:400px" >
			<chart2 ref="chart2" style="width:100%;height:400px"></chart2>
		</div>
		<!-- <chart1 ref="chart1" style="width:400px;height:500px;"></chart1> -->
	</div>
</template>
<style lang="less" scoped>
.panel0{
	    background: #fff;
    padding: 10px 10px;
	ul>li{
		float: left;
		width:24%;
		height:80px;
		text-align: center;
		line-height: 35px;
		    background: #eaeaea;
		margin: 5px;
		
		a{
			font-size: 15px;
		}
	}
}
</style>

<script>
import Chart1 from './charts/Chart1';
import Chart2 from './charts/Chart2';
export default {
	components:{Chart1,Chart2},
	props: {
		
	},
	data () {
		return {
			currentDayParking:{
				entryOn: "2018-12-20",
				totalLeaveNum: 0,
				totalNum: 0,
				totalPayedNum: 0
			}
		}
	},
	mounted(){
		
		this.$on('init',this.init)
	},

	methods:{
		init(){
			this.$api.ipark.ReportService.findCurrentDayParkingReport().then(rsp=>{
				this.currentDayParking = rsp||{
					totalLeaveNum: 0,
					totalNum: 0,
					totalPayedNum: 0
				}
			})
			this.$refs.chart2.$emit('init');

		},
		gotoAccessManage(status){
			this.$router.push({name:'accessInfo:manage',query:{status:status}})
		}
	}
}
</script>
<style lang="less">

	#index{
		height: 622px;
	}
	.erp_bg {
		background: url('../assets/images/index_bg.png') no-repeat 50%;
	}
</style>
