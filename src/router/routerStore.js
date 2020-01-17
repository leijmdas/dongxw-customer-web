
import Vue from 'vue';
import Vuex from 'vuex';
import {constantRouter} from './constRouter'
import {asyncRouter} from './asyncRouter'
Vue.use(Vuex);

function hasPermission(roles, route) {
	if (route.meta && route.meta.roles) {
		return roles.some(role => route.meta.roles.indexOf(role) >= 0)
	} else {
		return true
	}
}
const store = new Vuex.Store({
  state: {
    initRouters: constantRouter,
    addRouters: []
  },
  getters: {
    addRouters: (state) => {
      return state.addRouters
    }
  },
  mutations: {
  	SET_ROUTERS: (state, routers) => {
  		state.addRouters = routers;
  		state.routers = constantRouter.concat(routers);
  	}
  },
  actions: {
  	GenerateRouters({ commit }, data) {
  		return new Promise(resolve => {
  			const { roles } = data;
        console.log(roles);
  			const accessedRouters = asyncRouter.filter(v=>{
  				// if (roles.indexOf('admin') >=0) {
      //       console.log('11116666666666666666')
  				// 	return true;
  				// }
  				if (hasPermission(roles, v)) {
  					if (v.children && v.children.length > 0) {
  						v.children = v.children.filter(child =>{
  							if (hasPermission(roles, child)) {
  								return child
  							}
  							return false;
  						});
  						return v;
  					} else {
  						return v;
  					}
  					return false;
  				}
  			});
        console.log(accessedRouters)
  			commit('SET_ROUTERS', accessedRouters);
  			resolve();
  		})
  	}
  }
})
 
export default store;


