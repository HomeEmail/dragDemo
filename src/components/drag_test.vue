<template>
<el-container ref="fullscreenBox" :style="fullscreenBoxCss">
  <el-header class="">
    <div class="topLeftCol">
      <span class="">可视化编辑器</span>
    </div>
    <div class="topRightCol">
      <el-tooltip class="item" effect="dark" :content="fullScreenText" placement="top">
        <el-button type="plain" @click="fullScreen()">{{fullScreenText}}</el-button>
      </el-tooltip>
    </div>
  </el-header>

  <el-container>
    <el-aside class="left-aside" width="200px">
      <div style="line-height:30px;font-size:14px;color:#666;margin-bottom: 10px;border-bottom: 1px #ddd solid;">画布操作:</div>
      <span style="font-size:14px;color:#666;">宽:</span>
      <el-input-number v-model="contentBoxWidth"></el-input-number>
      <div style="height:10px;"></div>
      <span style="font-size:14px;color:#666;">高:</span>
      <el-input-number v-model="contentBoxHeight"></el-input-number>
      <div style="height:10px;"></div>

      <el-radio-group v-model="contentBoxIsAllowMove">
        <el-radio-button :label="true">拖动</el-radio-button>
        <el-radio-button :label="false">选择</el-radio-button>
      </el-radio-group>
      <div style="height:10px;"></div>

      <el-button-group>
        <el-button type="primary" @click="zoomOut" icon="el-icon-zoom-out"></el-button>
        <el-button type="primary" @click="zoomIn" icon="el-icon-zoom-in"></el-button>
      </el-button-group>
      <el-button type="text">{{contentWrapperScaleText}}</el-button>
      <div style="height:10px;"></div>

      <el-button @click="resetContentBoxPosition">重置</el-button>
      <div style="height:20px;"></div>

      <div style="line-height:30px;font-size:14px;color:#666;margin-bottom: 10px;border-bottom: 1px #ddd solid;">组件列表:</div>

      <el-button draggable="true" @selectstart.native="myElSelectstart" @dragstart.native="myElDragstart" @dragend.native="myElDragend" data-el-name="my-text" type="text" icon="el-icon-info" :disabled="contentBoxIsAllowMove">文字</el-button>
      <div style="height:10px;"></div>

      <el-button draggable="true" @selectstart.native="myElSelectstart" @dragstart.native="myElDragstart" @dragend.native="myElDragend" data-el-name="my-button" type="success" icon="el-icon-success" :disabled="contentBoxIsAllowMove">按钮</el-button>
      <div style="height:10px;"></div>

      <el-button draggable="true" @selectstart.native="myElSelectstart" @dragstart.native="myElDragstart" @dragend.native="myElDragend" data-el-name="my-img" type="primary" icon="el-icon-picture" :disabled="contentBoxIsAllowMove">图片</el-button>
      <div style="height:20px;"></div>

    </el-aside>
    <el-main ref="conterMain" class="">
      <!-- <router-view></router-view> -->
      <div class="center-main" @mousedown="contentWrapperMouseDown" @mouseup="contentWrapperMouseUp" @mousemove="contentWrapperMouseMove" @mouseout="contentWrapperMouseOut" :style="{cursor: this.contentBoxIsAllowMove?'-webkit-grab':'default',userSelect:this.contentBoxIsAllowMove?'none':'auto'}">
        <div ref="contentWrapper" :class="{allowDrag:!this.contentBoxIsAllowMove}" :style="contentWrapperCss">
          <div ref="contentBox" class="contentBox" :style="contentBoxCss" @dragenter="myElDragenter" @dragover="myElDragover" @drop="myElDrop">
            <!-- <div style="width:100px;height:300px;border:1px yellow solid;">dsdfds dlf dskf</div> -->
            <div v-for="item in myElArray" :style="item.css" @mousedown="myElMouseDown($event,item.css)" @mouseup="myElMouseUp" @mousemove="myElMouseMove" @mouseout="myElMouseOut">
              <span v-if="item.type==1">{{item.name}}<!-- 文字 --></span>
            </div>
            <div v-for="item in myElArray" :style="item.focus.css" @mousedown="myElMouseDown($event,item.focus.css)" @mouseup="myElMouseUp" @mousemove="myElMouseMove" @mouseout="myElMouseOut">
              
            </div>
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
        contentBoxShadowColor:'#aaa',
        contentBoxWidth:1280,
        contentBoxHeight:720,
        contentBoxIsAllowMove:true,
        contentWrapperScale:1,
        contentWrapperTop:0,
        contentWrapperLeft:0,
        contentWrapperTopNew:0,
        contentWrapperLeftNew:0,
        contentWrapperInitTop:0,
        contentWrapperInitLeft:0,
        contentBoxIsMoving:false,

        myElIsMoving:false,
        myElTopNew:0,
        myElLeftNew:0,
        myElInitTop:0,
        myElInitLeft:0,
        myElTop:0,
        myElLeft:0,
        myElZindex:0,

        myElObjCss:{},
        myElArray:[ //type:1文字 2按钮 3图像
          {
            name:'bt1',
            type:2,
            css:{
              backgroundColor:'#ddd',
              border:'1px #aaa solid',
              width:200+'px',
              height:300+'px',
              top:30+'px',
              left:200+'px',
              visibility:'visible',
              zIndex:1
            },
            focus:{
              name:'bt1-focus',
              css:{
                border:'2px #aaa solid',
                width:200+'px',
                height:300+'px',
                top:126+'px',
                left:196+'px',
                visibility:'visible',
                zIndex:2
              }
            }
          },
          {
            name:'欢迎是东方大陆十分艰苦拉萨的发',
            type:1,
            css:{
              backgroundColor:'#666',
              border:'1px #aaa solid',
              width:200+'px',
              height:300+'px',
              top:330+'px',
              left:230+'px',
              visibility:'visible',
              zIndex:1
            },
            focus:{
              name:'bt2-focus',
              css:{
                border:'2px #aaa solid',
                width:200+'px',
                height:300+'px',
                top:326+'px',
                left:296+'px',
                visibility:'visible',
                zIndex:2
              }
            }
          }
        ]
      }
    },
    computed:{
      contentBoxCss:function(){
        return {width:this.contentBoxWidth+'px',height:this.contentBoxHeight+'px',boxShadow: '0px 0px 10px '+this.contentBoxShadowColor,position:'relative', boxSizing: 'border-box'};
      },
      contentWrapperCss:function(){
        return {padding: '10px',position: 'relative',width:(this.contentBoxWidth+30)+'px',position:'absolute',left:this.contentWrapperLeft+'px',top:this.contentWrapperTop+'px', boxSizing: 'border-box',cursor: this.contentBoxIsAllowMove?'-webkit-grab':'default',transform: 'scale('+this.contentWrapperScale+','+this.contentWrapperScale+')'};
      },
      contentWrapperScaleText:function(){
        return Math.round(this.contentWrapperScale*100)+'%';
      },
    },
    methods: {
      myElClick(e){
        console.log('myElClick:',e);
      },
      zoomIn(e){
        this.contentWrapperScale+=0.1;
      },
      zoomOut(e){
        this.contentWrapperScale-=0.1;
      },
      myElSelectstart(e){
        console.log('myElSelectstart:',e);
        return false;
      },
      myElDragstart(e){
        console.log('myElDragstart:',e,e.target.dataset);
        e.dataTransfer.setData("text", e.target.dataset.elName);
        e.dataTransfer.effectAllowed='all';
      },
      myElDragend(e){
        console.log('myElDragend:',e);
        e.dataTransfer.clearData("text");
        this.contentBoxShadowColor='#aaa';
        return false;
      },
      myElDragenter(e){
        console.log('myElDragenter:',e);
        if(this.myElIsMoving) return false;
        this.contentBoxShadowColor='#047af3';
        return true;
      },
      myElDragover(e){
        //console.log('myElDragover:',e.offsetX,e.offsetY);
        e.preventDefault();
        return false;
      },
      myElDrop(e){
        console.log('myElDrop:',e,e.dataTransfer.getData("text"));
        console.log('x:',e.offsetX,'y:',e.offsetY);
        
        if(this.myElIsMoving) return false;
      },

      resetContentBoxPosition(e){
        this.contentWrapperTop=0;
        this.contentWrapperLeft=0;
        this.contentWrapperTopNew=0;
        this.contentWrapperLeftNew=0;
        this.contentWrapperScale=1;
      },

      myElMouseDown(e,obj){
        if(!!this.contentBoxIsAllowMove) return 0;
        this.myElObjCss=obj;
        this.myElIsMoving=true;
        this.myElZindex=obj.zIndex;//暂存原来的值
        obj.zIndex=99999;//暂时设置最高
        this.myElInitTop=e.clientY||e.y;
        this.myElInitLeft=e.clientX||e.x;
        this.myElTopNew=parseInt(obj.top,10);
        this.myElLeftNew=parseInt(obj.left,10);
        console.log('myElMouseDown',this.myElIsMoving,e,obj);
      },
      myElMouseMove(e){
        if(!!this.contentBoxIsAllowMove) return 0;
        if(this.myElIsMoving){
          //console.log('myElMouseMove:',e);
          let new_top=e.clientY||e.y;
          let new_left=e.clientX||e.x;
          let T=new_top-this.myElInitTop;
          let L=new_left-this.myElInitLeft;
          if(T==0&&L==0) return ;
          this.myElTop=this.myElTopNew+T;
          this.myElLeft=this.myElLeftNew+L;
          this.myElObjCss.top=this.myElTop+'px';
          this.myElObjCss.left=this.myElLeft+'px';
        }
        return 0;

      },
      myElMouseUp(e){
        if(!!!this.myElIsMoving) return 0;
        this.myElIsMoving=false;
        this.myElObjCss.zIndex=this.myElZindex;//还原之前暂存的值
        this.myElZindex=0;
        this.myElObjCss={};
        console.log('myElMouseUp',this.myElIsMoving,e);
      },
      myElMouseOut(e){
        this.myElMouseUp(e);
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
  font-family: "微软雅黑";
  font-weight: bold;
}
.contentBox *{
  font-family: "微软雅黑";
  font-weight: bold;
  box-sizing: border-box;
  position: absolute;
  outline: none;
  background: transparent;
  cursor: move;
}
.allowDrag .contentBox *:hover{
  outline: 1px #fa3737 dashed;
}
</style>