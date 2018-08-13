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
      <div style="line-height:30px;font-size:14px;color:#666;margin-bottom: 10px;border-bottom: 1px #ddd solid;">画布操作:</div>
      <el-radio-group v-model="contentBoxIsAllowMove">
        <el-radio-button :label="true">拖动</el-radio-button>
        <el-radio-button :label="false">选择</el-radio-button>
      </el-radio-group>
      <div style="height:10px;"></div>
      <el-button @click="resetContentBoxPosition">重置位置</el-button>
      <div style="height:20px;"></div>

      <div style="line-height:30px;font-size:14px;color:#666;margin-bottom: 10px;border-bottom: 1px #ddd solid;">组件列表:</div>
      <el-button @click="myElClick" type="text" icon="el-icon-info" :disabled="contentBoxIsAllowMove">文字</el-button>
      <div style="height:10px;"></div>
      <el-button type="success" icon="el-icon-success" :disabled="contentBoxIsAllowMove">按钮</el-button>
      <div style="height:10px;"></div>
      <el-button type="primary" icon="el-icon-picture" :disabled="contentBoxIsAllowMove">图片</el-button>
      <div style="height:20px;"></div>

    </el-aside>
    <el-main ref="conterMain" class="">
      <!-- <router-view></router-view> -->
      <div class="center-main" @mousedown="contentWrapperMouseDown" @mouseup="contentWrapperMouseUp" @mousemove="contentWrapperMouseMove" @mouseout="contentWrapperMouseOut" :style="{cursor: this.contentBoxIsAllowMove?'-webkit-grab':'default',userSelect:this.contentBoxIsAllowMove?'none':'auto'}">
        <div ref="contentWrapper" :style="contentWrapperCss">
          <div :style="contentBoxCss">
            中间<canvas width="200" height="200" ref="canvas1"></canvas>
          </div>
        </div>
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
        dragOrSelect:'选择',
        contentBoxWidth:1280,
        contentBoxHeight:720,
        contentBoxIsAllowMove:true,
        contentWrapperTop:0,
        contentWrapperLeft:0,
        contentWrapperTopNew:0,
        contentWrapperLeftNew:0,
        contentWrapperInitTop:0,
        contentWrapperInitLeft:0,
        contentBoxIsMoving:false,
      }
    },
    computed:{
      contentBoxCss:function(){
        return {width:this.contentBoxWidth+'px',height:this.contentBoxHeight+'px',boxShadow: '0px 0px 10px #aaa',position:'relative', boxSizing: 'border-box'};
      },
      contentWrapperCss:function(){
        return {padding: '10px',position: 'relative',width:(this.contentBoxWidth+30)+'px',position:'absolute',left:this.contentWrapperLeft+'px',top:this.contentWrapperTop+'px', boxSizing: 'border-box',cursor: this.contentBoxIsAllowMove?'-webkit-grab':'default'};
      }
    },
    methods: {
      myElClick(e){
        console.log('myElClick:',e);
      },
      contentWrapperMouseMove(e){
        if(this.contentBoxIsAllowMove&&this.contentBoxIsMoving){
          //console.log('contentWrapperMouseMove:',e);
          let new_top=e.clientY||e.y;
          let new_left=e.clientX||e.x;
          let T=new_top-this.contentWrapperInitTop;
          let L=new_left-this.contentWrapperInitLeft;
          if(T==0&&L==0) return ;
          this.contentWrapperTop=this.contentWrapperTopNew+T;
          this.contentWrapperLeft=this.contentWrapperLeftNew+L;
        }
        return 0;

      },
      resetContentBoxPosition(e){
        this.contentWrapperTop=0;
        this.contentWrapperLeft=0;
        this.contentWrapperTopNew=0;
        this.contentWrapperLeftNew=0;
      },
      contentWrapperMouseDown(e){
        if(!!!this.contentBoxIsAllowMove) return 0;
        this.contentBoxIsMoving=true;
        this.contentWrapperInitTop=e.clientY||e.y;
        this.contentWrapperInitLeft=e.clientX||e.x;
        this.contentWrapperTopNew=this.contentWrapperTop;
        this.contentWrapperLeftNew=this.contentWrapperLeft;
        console.log('contentWrapperMouseDown',this.contentBoxIsMoving,e);
      },
      contentWrapperMouseUp(e){
        if(!!!this.contentBoxIsMoving) return 0;
        this.contentBoxIsMoving=false;
        console.log('contentWrapperMouseUp',this.contentBoxIsMoving,e);
      },
      contentWrapperMouseOut(e){
        this.contentWrapperMouseUp(e);
      },

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
      //console.log(this.$refs.canvas1);
      //console.log(this.$refs.canvas1.getContext('2d'));
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
  position: relative;
  height: 100%;
}
</style>