import './assets/css/reset.css'
// import 'material-design-lite/dist/material.indigo-blue.min.css'
import './assets/css/easyzoom.css'

import './element-variables.scss'
import Vue from 'vue'
import ElementUI from 'element-ui'

import Icon from 'vue-svg-icon/Icon.vue';
Vue.component('icon', Icon);
import moment from 'vue-moment';
Vue.use(moment);

import router from './router'
import permission from './permission'
import './directives'
import vueFilter from './filter'
import api from './api'
import _ from 'lodash'

import './components'
import App from './App'
import {
  KeyCode,
  bus
} from './utils'
import VueDirectiveImagePreviewer from './directives/imagePreview'
import './mock' // simulation data
Vue.use(ElementUI, {
  size: 'mini'
})

Vue.use(vueFilter)

import axios from 'axios'
Vue.prototype.$http = axios
Vue.prototype.$bus = bus
Vue.prototype.$api = api
Vue.prototype.$msgJsonResult = function(rsp)
{
  if (rsp.code ===  0 ) {
    this.$message({
      type: "success",
      message: rsp.msg
    });
  } else {
    this.$message({
      type: "error",
      message: rsp.msg
    });
  }
}
permission.init();
const app = new Vue({
  el: '#app-wrap',
  router,
  ...App
})
