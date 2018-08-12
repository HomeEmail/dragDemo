<template>
<el-container ref="fullscreenBox" :style="fullscreenBoxCss">
  <el-header class="">
    <div class="topLeftCol">
      <span class="">可视化编辑器</span>
    </div>
    <div class="topRightCol">
      <el-tooltip class="item" effect="dark" content="全屏" placement="top">
        <el-button type="plain" @click="fullScreen()">{{fullScreenText}}</el-button>
      </el-tooltip>
    </div>
  </el-header>

  <el-container>
    <el-aside class="left-aside" width="200px">
      左边
    </el-aside>
    <el-main ref="conterMain" class="center-main">
      <!-- <router-view></router-view> -->
      <div ref="contentWrapper" :style="contentWrapperCss">
        <div :style="contentBoxCss">中间</div>
      </div>

    </el-main>
    <el-aside class="right-aside" width="200px">
      右边
    </el-aside>
  </el-container>
</el-container>
</template>

<script>
  export default {
    name: 'drag_test',
    data(){
      return {
        fullScreenText:'全屏',
        dateStr:'',
        fullscreenBoxCss:{
          background:'#ffffff',
          position:'relative',
          left:'0px',
          top:'0px',
          zIndex:666,
          padding:'0px',
          width:'100%'
        },
        contentWrapperCss:{
          padding: '10px',position: 'relative',width:'1310px'
        },
        contentBoxCss:{
          width:'1280px',height:'720px',boxShadow: '0px 0px 10px #aaa',position:'relative'
        }
      }
    },
    methods: {
      fullScreen() {
        // true全屏，false非全屏 
        if(document.fullscreen||document.mozFullScreen||document.webkitIsFullScreen||document.msFullscreenElement){//退出全屏
          
          if (document.exitFullscreen) { //W3C
              document.exitFullscreen();
          } else if (document.mozCancelFullScreen) { //FireFox 
              document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) { //Chrome等
              document.webkitCancelFullScreen();
          } else if (document.msExitFullscreen) { //IE 11
              document.msExitFullscreen();
          }
        }else{//退出全屏
          
          //let docElm = document.documentElement;
          console.log('$refs',this.$refs);
          console.log('$parent',this.$parent);
          let docElm = this.$refs.fullscreenBox.$el;//自定义的组件返回vm对象，so需要$el才能拿到dom对象
          //let docElm = this.$refs.contentWrapper;//原生标签返回原生dom对象
          if (docElm.requestFullscreen) { //W3C
              docElm.requestFullscreen();
          } else if (docElm.mozRequestFullScreen) { //FireFox 
              docElm.mozRequestFullScreen();
          } else if (docElm.webkitRequestFullScreen) { //Chrome等
              docElm.webkitRequestFullScreen();
          } else if (docElm.msRequestFullscreen) { //IE 11
              docElm.msRequestFullscreen();
          }

        }
      }


    },
    watch: {
      '$route': function (to, from) {

      }
    },
    mounted(){

    },
    created(){
      let that=this;
      //this.userName=this.$store.state.userInfo.userName;
      //this.dateStr=new Date().Format("yyyy-MM-dd hh:mm:ss");
      document.onwebkitfullscreenchange=function(e){
        //console.log('onwebkitfullscreenchange',e);

        if (document.webkitIsFullScreen) { 
          that.fullScreenText='退出全屏';  
          // that.fullscreenBoxCss.position='absolute'; 
          // that.fullscreenBoxCss.padding='20px'; 
          console.log('当前状态：全屏');
        } else {
          console.log('当前状态：非全屏');
          that.fullScreenText='全屏';
          // that.fullscreenBoxCss.position='relative'; 
          // that.fullscreenBoxCss.padding='0px'; 
        }
      };
    },
    activated(){

    },
    destroyed(){
      document.onwebkitfullscreenchange=null;
    }
  }
</script>

<style scoped>
.el-container{
  height: 100%;
}
.el-header{
  background-color: #efefef;
  border-bottom: 1px #ddd solid;
}
.el-aside{

}
.topLeftCol{
  height: 60px;
  line-height: 60px;
  float: left;
}
.topRightCol{
  position: absolute;
  right: 20px;
  top: 15px;
}
.left-aside{
  border-right: 1px #ddd solid;
  padding: 20px;
  background-color: #fbfafa;
}
.right-aside{
  border-left: 1px #ddd solid;
  padding: 20px;
  background-color: #fbfafa;
}
.center-main{
  overflow: auto;
}
</style>