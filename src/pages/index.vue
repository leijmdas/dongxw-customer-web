<template>
  <div class="indexPanel">

  </div>
</template>
<style lang="less" scoped>
  .indexPanel {
    height: 100%;
    width: 100%;
    background-image: url("../assets/images/index_bg.png");
    background-repeat: repeat;
    background-size: 100% 100%;
  }

  .panel0 {
    background: #fff;
    padding: 10px 10px;
    ul > li {
      float: left;
      width: 24%;
      height: 80px;
      text-align: center;
      line-height: 35px;
      background: #eaeaea;
      margin: 5px;

      a {
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

		},
		gotoAccessManage(status){
			// this.$router.push({name:'accessInfo:manage',query:{status:status}})
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
