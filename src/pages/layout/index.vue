<template>
  <el-container style="height:100%">
    <el-aside :style="collapse?'width:65px':'width:250px'" :collapse="collapse" id="aside">
      <router-link to="/">
        <div id="logoPanel">
          <img src="../../assets/images/logo.png" style="width:25%;height:120%" class="logo">
          <span>东兴旺 - 客户端</span>
        </div>
      </router-link>
      <menu-panel ref="menuPanel"></menu-panel>
    </el-aside>
    <el-container>
      <el-header style="height:40px">
        <div style="float:right">
          <nav-panel></nav-panel>
        </div>
      </el-header>
      <div id="navTab" class="navLocation" :style="collapse?'left:65px':'left:250px'">
        <el-breadcrumb>
          <i class="el-icon-location" style="color:gray;float:left"></i>
          <el-breadcrumb-item v-for="item in currentNodePaths" :key="item.name">{{(item.meta||{}).title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-main id="mainContainer" v-loading="loading" element-loading-text="loading ..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <keep-alive>
          <router-view id="mainView" v-if="$route.meta.keepAlive" ref="defaultRootView"></router-view>
        </keep-alive>
        <router-view id="mainView" v-if="!$route.meta.keepAlive" ref="defaultRootView"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" rel="stylesheet/less">
.el-header {
  height: 40px;
  line-height: 40px;
  // background-color: #545c64;

  padding: 0px 5px;
  padding-right: 0px;
  //background: url("../../assets/images/ERP_logo.png") 0 0 no-repeat;
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .el-submenu .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }
  .el-badge__content {
    top: 10px;
  }
  .el-breadcrumb {
    line-height: 40px;
  }
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(0, 140, 247, 0.1);
}

#aside {
  .el-menu {
    border-right: none;
    //margin-top: 5px;

    .el-menu {
      background: none !important;
      li {
        margin: 0 10px;
      }
      li.is-active {
        background: #bee3d9;
        font-weight: bold;
        color: #199a85;
        opacity: 1;
      }
    }
    .el-submenu .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
  }
  .el-menu-item:hover,
  .el-menu-item:focus {
    outline: none;
    background: #bee3d9;
    font-weight: bold;
    color: black;
    opacity: 0.8;
  }
  background-color: #11a47d;

  .el-submenu__title:hover {
    background: #28779a;
  }

  #logoPanel {
    background: #3162a5;
    height: 40px;
    line-height: 40px;
    color: white;
    font-size: 15px;
    padding:5px 15px;
  }
  #logoPanel img {

    height: 35px;
  }
  #logoPanel span{
    margin: 4px;
  }
}
.navLocation {
  //position: absolute;
  width: 100%;
  color: gray;
  margin-left: 5px;
  // margin-top: 15px;
  line-height: 35px;
  .hamburger {
    fill: #409eff;
  }
  .el-breadcrumb {
    margin-top: -30px;
    color: white;
    margin-left: 25px;
  }
}
.el-main {
  padding: 5px 5px;
  // background: rgb(245, 247, 249);
  //margin:5px 8px;
}
.navTab {
  position: absolute;
  width: 100%;
  overflow: hidden;
  display: none;
  margin-top: 10px;
  .el-tabs__header {
    margin: 0 0;
  }
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
  }
  .el-tabs__nav-wrap {
    background: #e9eae9;
    //border-bottom: 1px solid #409eff;
    border-bottom: 1px solid #fff;
  }
  .el-tabs__nav {
    background: #fff;
    // -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    //   0 0 3px 0 rgba(0, 0, 0, 0.04);
    // background: #fff;
    // border-bottom: 1px solid #d8dce5;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  }
}
.navTab .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  font-weight: bold;
}
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #409eff;
  color: #303133;
}
/* .el-aside {
  color: #333;
} */
</style>

<script>
  import {routers} from '@/router';
  import {bus} from '@/utils';
  import NavPanel from './NavPanel';
  import MenuPanel from './MenuPanel';
  import Hamburger from './Hamburger';

  function resizeMainView() {
  let $mainContainer = document.getElementById('mainContainer');
  let $mainTab = document.getElementById('navTab');
  let height = $mainContainer.offsetHeight - $mainTab.offsetHeight;

  document.getElementById('mainView').style.height = height - 80 + 'px';
}

export default {
  components: { NavPanel, MenuPanel, Hamburger },
  data() {
    return {
      collapse: false,
      currentNodePaths: [],
      currentTab: '',
      tabs: [],
      loading: false
    };
  },
  watch: {
    $route() {
      this.activeTab();
    }
  },
  methods: {
    flushBreadcrumb() {
      let paths = [];
      function getNodePath(r, name) {
        if (!r) {
          return;
        }
        paths.push(r);
        if (r.name != undefined && r.name == name) {
          throw new Error('find'); //查询到，即中断跳出
        }
        if (r.children && r.children.length > 0) {
          for (let i = 0, l = r.children.length; i < l; i++) {
            getNodePath(r.children[i], name);
          }
        }
        paths.pop();
      }
      let name = this.currentTab;
      try {
        for (let i = 0, l = routers.length; i < l; i++) {
          getNodePath(routers[i], name);
        }
      } catch (e) {}
      this.currentNodePaths = paths;
    },
    onToggle() {
      this.collapse = !this.collapse;
      this.$refs.menuPanel.toggoleCollapse(this.collapse);
    },
    isTabClosable(tab) {},
    getTab(name) {
      let rs = this.tabs.filter(tab => tab.name == name);
      return rs.length > 0 ? rs[0] : null;
    },
    activeTab() {
      // this.loading = true;
      const r = this.$route;
      this.tabs.forEach(t => t.depth++);
      if (r) {
        let closable = (r.meta || {}).closable;
        if (closable === undefined) {
          closable = true;
        }
        let tab = this.getTab(r.name);
        if (!tab) {
          tab = {
            title: r.meta.title,
            name: r.name,
            query: r.query,
            params: r.params,
            depth: 0,
            closable: closable
          };
          if (!r.query._current) {
            this.tabs.push(tab);
          }
        }
        tab.depth = 0; //最先
        if (!r.query._current) {
          this.currentTab = tab.name;
        }
        this.$nextTick(() => {
          resizeMainView();
          this.$refs.defaultRootView.$emit('init', r.query);
          this.loading = false;
        });
        //显示导航
        this.flushBreadcrumb();
      }
    },
    onTabClick(tab) {
      this.tabs.forEach(t => t.depth++);
      tab.depth = 0;
      this._onTabClick(tab.name);
    },
    _onTabClick(name) {
      let rs = this.tabs.filter(_tab => _tab.name == name);
      this.$router.push({
        name: name,
        query: rs[0].query,
        params: rs[0].params
      });
    },
    onTabRemove(name) {
      for (let i = 0, len = this.tabs.length; i < len; i++) {
        let t = this.tabs[i];
        if (t.name == name) {
          this.tabs.splice(i, 1);
          break;
        }
      }
      let minDepthTab = null;
      for (let i = 0, l = this.tabs.length; i < l; i++) {
        let t = this.tabs[i];
        if (minDepthTab == null || minDepthTab.depth > t.depth) {
          minDepthTab = t;
        }
      }
      if (!minDepthTab) {
        this.$router.push('/');
      } else {
        this._onTabClick(minDepthTab.name);
      }
    },
    toRouter(routerOpt, closeCurrentFlag = true) {
      if (closeCurrentFlag) {
        this.onTabRemove(this.currentTab);
      }
      this.$router.push(routerOpt);
    }
  },
  created() {
    bus.$on('request:start', () => {
      //发起请求时调起loading
      this.loading = true;
    });
    bus.$on('request:end', () => {
      //结束请求时关闭loading
      this.loading = false;
    });
  },
  mounted() {
    this.activeTab();
    this.$bus.$on('app:toRouter', this.toRouter);
    window.onresize = () => {
      resizeMainView();
    };
  }
};
</script>
