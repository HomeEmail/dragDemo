import Vue from 'vue'
import App from './App'


import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import 'element-ui/lib/theme-default/index.css'
//import './css/common.css'

Vue.use(Element,{size:'mini'}); //medium small mini

Vue.config.productionTip = false

//指令，将dom绑定到监听的数据对象里,默认是key是el
Vue.directive('dom', {
    bind: function (el, binding) { //el监听的dom，binding 当前指令对象
    	console.log('directive dom binding:',binding);
        var obj = binding.value;//指令对象里的绑定的数据对象
        if (obj != null) {
            var key = Object.keys(binding.modifiers)[0] || "el";
            Vue.set(obj, key, el);
        }
    }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
