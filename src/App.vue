<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  @import "variables";
  @import "base";
  html,
  body {
    height: 100%;
     ::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #f8f8f8;
    }
     ::-webkit-scrollbar {
      //滚动条的宽度
      width: 6px;
      height: 6px;
    }
     ::-webkit-scrollbar-thumb {
      //滚动条的设置
      background-color: #dddddd;
      background-clip: padding-box;
      min-height: 28px;
    }
     ::-webkit-scrollbar-thumb:hover {
      background-color: #bbb;
    }
  }
  
  #app {
    height: 100%;
  }
</style>
<script>
  import {
    KeyCode,
    fetch,
    bus,
    auth,
    Consts
  } from "./utils";
  import router, {
    routers
  } from "./router";
  
  function getPermissionRouters(allRouters, resGroups) {}
  export default {
    data() {
      return {
      }
    },
    methods: {
       keysEvent(e){
        const code = KeyCode.getKeyCode(e)
        if(code){
         let el = document.querySelector('[keycode='+code+']');
        
         if(el){
           el.click()
         }
        }
      },
    },
    beforeDestroy(){
      document.removeEventListener('keyup', this.keysEvent)
    },
    mounted() {
      //登陆成功处理
      bus.$on("app:logged", () => {
        // 跳转之前获取停车场信息 判断是否有道闸  根据整个来显示左侧菜单列表
      


        let getUserRole = (true ? 'admin' : 'user')
        localStorage.setItem('userRole', getUserRole)


        this.$router.push("/");
      });
      bus.$on("app:logout", () => {
  
        auth.removeToken();
        router.app.isLogged = false;
        router.app.user = null;
        window.location.href='/'
        // this.$nextTick(() => {
        //   this.$router.push("/login");
        // });
      });
      //获取授权信息成功
      bus.$on("app:user:set", () => {});

      document.addEventListener('keyup', this.keysEvent)
    }
  };
</script>
