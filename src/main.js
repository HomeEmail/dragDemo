import Vue from 'vue'
import App from './App'


import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import 'element-ui/lib/theme-default/index.css'
//import './css/common.css'

Vue.use(Element,{size:'mini'}); //medium small mini

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
