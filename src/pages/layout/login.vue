<template>
  <div class="loginPanel">
    
    <div  class="login" v-show="show==='account'" v-loading="loading" element-loading-text="loading ..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="login-box" >
        <p class="title"><img src="../../assets/images/logo.png" class="logo"> 系统登录</p>
        <div class="content" @keydown.enter.stop="loginFocus">
          <div class="form-group account">
            <label><icon name="user" scale="2"></icon></label>
            <input id="account" type="text" maxlength="32" v-model="account.account" placeholder="用户名">
          </div>
          <div class="form-group password">
            <label><icon name="password" scale="2"></icon></label>
            <input type="password" name="password" style="display: none;">
            <input id="password" name="password" @keydown.enter.stop="login" type="password" v-model="account.password" maxlength="32" placeholder="密码">
          </div>
          <div class="btn-group">
            <el-button type="success" @click="login" style="width:100%;margin-top:20px" v-keycode="'ENTER'">登录</el-button>
            <!-- <div style="text-align:right;color:#aeaeae;margin-top:5px;">忘记密码？<el-button type="text" @click="forgotPwd()">找回密码</el-button></div> -->
          </div>
        </div>
      </div>
      
      </div>
    </div>
</template>
<script>
import { fetch, KeyCode, FocusTab, assistance, bus, auth } from "../../utils";
export default {
  name: "login",
  props: {
    skin: {
      type: String,
      default() {
        return "erp";
      }
    }
  },
  data() {
    return {
      loading: false,
      account: {
        show: true,
        account: "",
        password: ""
      },
      factoryBrand: {
        show: false,
        keepChoice: true,
        list: []
      }
    };
  },
  computed: {
    show() {
      if (!this.$parent.isLogged || this.account.show) {
        return "account";
      }
      if (this.account.show) {
        return "account";
      }
      return "";
    }
  },
  watch: {
    $route(val) {
      this.$emit("change-skin");
      if (val.name !== "login") {
        document.removeEventListener("keydown", this.keysEvent);
        this.account.show = true;
        this.factoryBrand.show = false;
      } else {
        document.addEventListener("keydown", this.keysEvent);
      }
    }
  },
  methods: {
    //登录，登录成功后获取厂牌
    login() {
      const { account: loginName, password } = this.account;
      this.loading = true;

      this.$api.AppService.login({ username:loginName, password })
        .then(data => {
          this.loading = false;
          auth.setToken({access_token:data.token,expires_in:data.expiresIn,createTime:data.createTime});
          bus.$emit("app:logged");
          
        })
        .catch(err => {
          this.loading = false;
          if (err.code === "unvalidPass") {
            this.$message({ message: `用户名或密码错`, type: "error" });
          } else {
            this.$message({ message: "登录异常:"+err.msg, type: "error" });
          }
        });
    },
    //重置
    reset() {
      this.account.account = "";
      this.account.password = "";
      $("#account").focus();
    },
    forgotPwd(){
      this.$router.push({path:'/forgotPwd'})
    }
  },
  mounted() {
    bus.$emit("app:reset");
  },
  beforeDestroy() {}
};
</script>
<style rel="stylesheet/less" lang='less' >
@import "../../variables";
.loginPanel{
  //background: url("../../assets/images/login-bg.jpg") ;
    background-position: top center;
    background-size: cover;
    height:100%;
    background-image: linear-gradient(-135deg, #3984DC 0%, #11A47D 100%);
}
.logo{
  height:25px;
}
.title{
  color:white;
  font-size:14px;
  font-weight: 200;
}

.login {
  width: 100%;
  height: 100%;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  position:absolute;
  .title {
    /* background: @purple; */
    color: #212b37;
    font-size: 14px;
    text-indent: 10px;
    margin: 0;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    box-shadow: 0 1px 1px #999;
  }
  .login-content {
    position: relative;
    top: 30px;
    left: 40px;
    width: 300px;
    height: 200px;
  }
  .login-content .form-group {
    position: absolute;
    left: 70px;
    display: block;
    width: 200px;
  }
  .login-content .account {
    top: 34px;
  }
  .login-content .password {
    top: 78px;
  }
  .login-content .form-group input {
    background: #fff;
    width: 200px;
    height: 28px;
    line-height: 28px;
    border: 0;
    outline: none;
  }
  .login-box {
    .title {
      line-height: 40px;
    }
    width: 400px;
    height: 240px;
    border-radius: 4px;
    box-shadow: 0 0 6px #333;
    background: #fff;
    .content {
      width: 300px;
      margin: 0 auto;
      padding-top: 20px;
      .form-group {
        
        display: block;
        line-height: 36px;
        background: #f0eef1;
        color: #666;
        border: 1px solid silver;
        //padding-left: 6px;
        input {
          height: 36px;
          outline: none;
          border: none;
          width: 100%;
          background: #f0eef1;
          text-indent:40px;
        }
        label {
          display: inline-block;
          min-width: 30px;
          padding:5px 5px 0px 10px;
              position: absolute;
        }
      }
      .password {
        margin-top: 10px;
      }
    }
  }
  
}
</style>
