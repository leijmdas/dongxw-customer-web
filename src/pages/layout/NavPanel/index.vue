<!--菜单 -->
<template>
  <div>

    <el-menu

      mode="horizontal"
      :default-active="activeIndex"
      text-color="#000"
      style="float:right"
    >
      <span style="margin-right: 200px">
      <span>中文</span>
      <span>English</span>
      </span>
      <el-menu-item index="0">
        <el-popover
          placement="bottom"
          width="300"
          trigger="hover"
        >
          <ul class="msgUL">
            <li
              v-for="r in msgPage.data"
              :key="r.id"
              @click="onMsgClick(r.id)"
            >
              <a href="javascript:void(0)">{{r.title}}</a>
              <span style="color: #a0a0a0;font-size: 12px;">{{r.msgOn}}</span>

            </li>

          </ul>
          <el-alert
            title=""
            v-if="msgPage.total<1"
          >暂无</el-alert>
          <router-link to="/msg">
            <el-button type="text">更多</el-button>
          </router-link>
          <div slot="reference">
            <el-badge
              :value="msgPage.total"
              v-if="msgPage.total>0"
            >
              <icon
                name="bell-fill"
                scale="2"
              ></icon>
            </el-badge>
            <icon
              name="bell-fill"
              scale="2"
              v-if="msgPage.total<1"
            ></icon>
          </div>

        </el-popover>
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <icon
            name="account"
            scale="2"
          v-show="!user.headerImg" ></icon>
          <img :src="user.headerImg" class="headerImg" v-show="user.headerImg">
          <span>{{user.username}}</span>

        </template>

        <el-menu-item-group>
          <template slot="title">--- 系统设置 ---</template>
          <el-menu-item
            index="2-3"
            @click="onModifyPwd"
          >修改密码</el-menu-item>
          <el-menu-item
            index="2-4"
            @click="logout"
          >退出登录</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>


    <el-dialog
      title="个人信息"
      :visible.sync="personalInfoShowFlag"
      width="50%"
    >
      <personal-info ref="personalInfoForm"></personal-info>
    </el-dialog>
    <el-dialog
      title="密码修改"
      :visible.sync="resetPwdDiagShowFlag"
      width="50%"
    >
      <modify-pwd-panel
        ref="modifyPwdPanel"
        @saved="onModifyOk"
      ></modify-pwd-panel>
    </el-dialog>
  </div>
</template>
<style lang="less" >
 .headerImg{
  width: 30px;
  height:30px;
      border-radius: 30px;
}
#appNavPanel .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #545c64;
  color: #ffd04b;
  background-color: #545c64;
}

#appNavPanel .el-menu {
  display: table-cell;
}
.msgUL li {
  height: 50px;

  margin-bottom: 5px;
  border-bottom: 1px solid #e9eae9;
  cursor: pointer;

  padding: 5px;
}
.msgUL li > a {
  color: #5b748d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.msgUL li:hover {
  background: #fafafa;
}
</style>

<script>
import router, { routers } from "@/router";
import { bus, auth, fetch } from "@/utils";
import ModifyPwdPanel from "../ModifyPwd";
import PersonalInfo from "../PersonalInfo.vue";
let timer = null;
export default {
  components: { ModifyPwdPanel, PersonalInfo },
  data() {
    return {
      activeIndex: "0-3",
      domainIndex:'domain_crm',
      permRouters: [],
      msgPage: {
        data: [],
        total: 0
      },
      isNest: false,
      resetPwdDiagShowFlag: false,
      personalInfoShowFlag: false,
      user: router.app.user || { realName: "匿名" }
    };
  },
  watch: {
    "$router.app.user": function(val) {
      this.user = val;
    }
  },
  methods: {
    onPersonalInfo() {
      this.personalInfoShowFlag = true;
      this.$nextTick(() => {
        this.$refs.personalInfoForm.$emit("init", {
          userId: this.user.id
        });
      });
    },
    onMsgClick(msgId) {
      this.$router.push({ name: "msg:view", query: { id: msgId } });
    },

    linkTo(path) {
      this.$router.push(path);
    },
    logout() {
      auth.removeToken();
      this.$router.app.user = null;
      this.$router.push("/login");
    },

    onModifyPwd() {
      this.resetPwdDiagShowFlag = true;
    },
    onModifyOk() {
      let _this = this;
      this.$alert("修改成功！请重新登录", "提示", {
        confirmButtonText: "确定",
        callback: action => {
          _this.logout();
        }
      });
    },
    logout() {
      bus.$emit("app:logout");
    },
    onDomainSelected(menu){
      bus.$emit('app:domain:selected',menu.replace('domain_',''))
    },
    loadMsg() {
      let { user } = router.app;
      //加载消息
      fetch.base.MsgInfo.query(
        {
          pageDTO: { start: 0, pageSize: 5 },
          readState: 0,
          receiverUserId: (user || {}).id
        },
        {
          openLoading: false
        }
      ).then(rsp => {
        this.msgPage = rsp;
      });
    }
  },
  destroyed() {
    if (timer) {
      timer = clearInterval(timer);
    }
  },
  mounted() {
    let self = this;
    if (this.$router.app.openMsg) {
      self.loadMsg();
      timer = setInterval(function() {
        //加载消息
        self.loadMsg();
      }, 10000);
    }
  }
};
</script>
