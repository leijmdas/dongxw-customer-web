<!--菜单 -->
<template>
  <el-menu class="el-menu-demo" unique-opened text-color="#fff" :collapse="collapse" :default-openeds="defaultOpeneds">
    <template v-for="item in permRouters" v-if="!item.hidden&&item.children">

      <el-submenu :index="item.name||item.path" :key="item.name" v-if="getShowingChildren(item.children)">
        <template slot="title">
          <!-- <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon> -->
          <icon :name="item.meta.icon" scale="2" v-if="item.meta&&item.meta.icon"></icon>
          <span slot="title" v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <router-link :to="{name:child.name,params:child.params,query:child.query}" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon> -->
              <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>
<style lang="less">
.el-menu-demo {
  background-image: linear-gradient(-180deg, #3162A5 0%, #11A47D 100%);
}

</style>
<script>
import router, { routers } from "@/router";
import { bus, auth, fetch } from "@/utils";
let timer = null;
export default {
  components: {},
  data() {
    return {
      collapse: false,
      activeIndex: null,
      currentDomain: '', //当前域
      permRouters: [],
      defaultOpeneds: [],
      msgPage: {
        data: [],
        total: 0
      },
      isNest: false,
      level: ''
    };
  },

  methods: {
    toggoleCollapse(flag) {
      this.collapse = flag;
    },
    getShowingChildren(children) {
      const showingChildren = children.filter(item => {

        return !item.hidden && this.$hasPermission(item.meta.perm);
      });
      return showingChildren;
    },
    hasOneShowingChildren(children) {
      const showingChildren = this.getShowingChildren(children)
      if (showingChildren.length === 1) {
        return true;
      }
      return false;
    },
    hasMoreThanOneShowingChildren(children) {
      const showingChildren = this.getShowingChildren(children)
      if (showingChildren.length > 1) {
        return true;
      }
      return false;
    },
    generateTitle(title) {
      return title;
    },
    linkTo(path) {
      this.$router.push(path);
    },

    getPermRouter(_r) {
      let r = _.cloneDeep(_r);
      let m = r.meta || {};
      let result = null;
      if (r.children) {
        let childs = [];
        for (let i = 0; i < r.children.length; i++) {
          let c = r.children[i];
          let tmp = this.getPermRouter(c);
          if (tmp != null) {
            childs.push(tmp);
          }
        }
        if (childs.length > 0) {
          result = r;
          result.children = childs;
        }
        return result;
      } else {
        if (this.$hasPermission(m.perm)) {
          return r;
        } else {
          return null;
        }
      }
    },
    getPermRouters() {
      let rs = [];
      routers.forEach(r => {
        let tmp = this.getPermRouter(r);
        tmp && rs.push(tmp);
        // if (r.meta && r.meta.roles) {
        //   if (r.meta.roles.indexOf(this.level) >= 0) {
        //     let tmp = this.getPermRouter(r);
        //     tmp && rs.push(tmp);
        //   }
        // }
      });
      return rs;
    }
  },

  mounted() {
    // 获取停车场信息
    let query = {
      orderBys: 'id|asc',
      param: { isDeleted: false },
      limit: 100
    };
    let self = this;
    self.permRouters = self.getPermRouters();
    self.level ='admin'

    // this.$api.ipark.ParkInfoService.query(query).then(function(data) {
    //   if (data.data.length > 0) {
    //     // gateType 1:传统道闸,2:无道闸
    //     if (data.data[0].gateType == 2) {
    //       self.level = 'user'
    //     } else {
    //       self.level ='admin'
    //     }
    //     self.permRouters = self.getPermRouters();
    //   }
    // })
    //
  }
};

</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>
