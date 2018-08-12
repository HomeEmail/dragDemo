<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <HelloWorld/>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld'
import HelloWorld from './components/drag_test'
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
body,html{
  padding: 0;
  margin:0;
  height: 100%;
}
/* 美化chrome浏览器滚动条 */
::-webkit-scrollbar-track-piece{width:8px;background-color:#ffffff;}

::-webkit-scrollbar{width:8px;height:6px;}

::-webkit-scrollbar-thumb{height:50px;background:#ddd; cursor:pointer;border-radius: 8px;}

::-webkit-scrollbar-thumb:hover{background:#ccc; cursor:pointer;}


#app{
  /*padding: 20px;*/
  height: 100%;
}
</style>
