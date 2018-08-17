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
      <div style="height:10px;"></div>

      <el-upload
        class="upload-bt"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handlePageBgUploadSuccess"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="pageBgFileList">
        <el-button size="small" type="primary">上传底图</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>

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
            <div v-for="(item,index) in myElArrayCss" v-if="item.type!=1" :style="item.css" @mousedown="myElMouseDown($event,myElArray[index],index)" @mouseup="myElMouseUp" @mousemove="myElMouseMove" @mouseout="myElMouseOut">
              <img :src="item.img" style="display:none;" @error="myElImgError($event,myElArray[index])" @load="myElImgLoad($event,myElArray[index])" />
              <input type="text" style="width:100%;height:100%;opacity:0;" @keyup.up="myElKeyUp($event,myElArray[index])" @keyup.down="myElKeyDown($event,myElArray[index])" @keyup.left="myElKeyLeft($event,myElArray[index])" @keyup.right="myElKeyRight($event,myElArray[index])" />
            </div>
              
            <div v-for="(item,index) in myElArrayCss" v-if="item.type==1" :style="item.css" @mousedown="myElMouseDown($event,myElArray[index],index)" @mouseup="myElMouseUp" @mousemove="myElMouseMove" @mouseout="myElMouseOut">
              {{item.name}}<!-- 文字 -->
              <img :src="item.img" style="display:none;" @error="myElImgError($event,myElArray[index])" @load="myElImgLoad($event,myElArray[index])" />
              <input type="text" style="width:100%;height:100%;opacity:0;" @keyup.up="myElKeyUp($event,myElArray[index])" @keyup.down="myElKeyDown($event,myElArray[index])" @keyup.left="myElKeyLeft($event,myElArray[index])" @keyup.right="myElKeyRight($event,myElArray[index])" />
            </div>

            <div v-for="(item,index) in myElArrayCss" :style="item.focus.css" @mousedown="myElMouseDown($event,myElArray[index].focus,index)" @mouseup="myElMouseUp" @mousemove="myElMouseMove" @mouseout="myElMouseOut">
              <img :src="item.focus.img" style="display:none;" @error="myElImgError($event,myElArray[index].focus)" @load="myElImgLoad($event,myElArray[index].focus)" />
              <input type="text" style="width:100%;height:100%;opacity:0;" @keyup.up="myElKeyUp($event,myElArray[index].focus)" @keyup.down="myElKeyDown($event,myElArray[index].focus)" @keyup.left="myElKeyLeft($event,myElArray[index].focus)" @keyup.right="myElKeyRight($event,myElArray[index].focus)" />
            </div>
            
          </div>
        </div>
      </div>

    </el-main>
    <el-aside class="right-aside" width="300px">
      <el-tabs v-model="rightTabModel" type="card" @tab-click="handleClickRightTab">
        <el-tab-pane label="属性" name="property">

          <el-form label-width="50px" v-if="!!myElObj.width" style="padding:0px 10px;">
            <el-form-item label="宽度">
              <el-input-number v-model="myElObj.width"></el-input-number>
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number v-model="myElObj.height"></el-input-number>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" @click="myElImgResetWH(myElObj)">重置为图片原始高宽</el-button>
            </el-form-item>
            <el-form-item label="左距">
              <el-input-number v-model="myElObj.left"></el-input-number>
            </el-form-item>
            <el-form-item label="顶距">
              <el-input-number v-model="myElObj.top"></el-input-number>
            </el-form-item>
            <el-form-item label="层级">
              <el-input-number v-model="myElObj.zIndex"></el-input-number>
            </el-form-item>
            <el-form-item label="名称">
              <el-input type="textarea" autosize placeholder="请输入名称" v-model="myElObj.name"></el-input>
            </el-form-item>
            <el-form-item label="链接">
              <el-input type="textarea" autosize placeholder="请输入链接" v-model="myElObj.href"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <el-upload
                class="upload-bt"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleImgUploadSuccess"
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="myElImgFileList">
                <el-button size="small" type="success">上传</el-button> 

                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
             
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary">保存</el-button>
            </el-form-item>
            <el-form-item label="光标">
              <el-button type="danger" @click="myElEnterEditFocus">{{myElEnterEditFocusBtText}}</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="图层" name="layer">
          <div style="padding:0px;">
            <div class="rightTabLayerTreeItem" v-for="(item,index) in myElArray">
              <span class="rightTabLayerTreeItemText" @mousedown="rightTabLayerTreeItemMousedown($event,item)" @mouseup="rightTabLayerTreeItemMouseup($event,item)">{{item.name}}</span>
              <div class="focusLayer" @mousedown="rightTabLayerTreeItemMousedown($event,item.focus)" @mouseup="rightTabLayerTreeItemMouseup($event,item.focus)"><span class="rightTabLayerTreeItemText">focus layer</span></div>
            </div>
              
            
          </div>
        </el-tab-pane>
      </el-tabs>
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

        rightTabModel:'property',

        myElIsMoving:false,
        myElTopNew:0,
        myElLeftNew:0,
        myElInitTop:0,
        myElInitLeft:0,
        myElTop:0,
        myElLeft:0,
        myElZindex:0,

        pageBgFileList: [
          //{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
        ],
        myElImgFileList:[],

        contentBoxBgImg: 'http://172.16.146.19/images/bg.jpg',//'http://172.16.146.19/images/bg.jpg',

        isEditFocusMode:false,//是否进入光标编辑模式
        myElObjIndex:0,//当前编辑的组件的下标索引
        myElObj:{},
        myElEnterEditFocusBtText:'进入编辑',


        myElArray:[ //type:1文字 2按钮 3图像
          {
            id:0,
            name:'bt1',
            type:2,
            img:'http://172.16.146.19:81/lrts/uploadFile/image/2018/06/28/20180628100827464.jpg',
            imgW:0,//图片实际原始大小
            imgH:0,//图片实际原始大小
            borderWidth:0,
            href:'http://www.baidu.com',
            width:0,
            height:0,
            left:100,
            top:30,
            visibility:true,
            zIndex:1,
            backgroundColor:'#66b1ff2e',
            isFocus:false,
            focus:{
              name:'bt1-focus',
              img:'http://172.16.146.19/images/210x296.png',
              imgW:0,//图片实际原始大小
              imgH:0,//图片实际原始大小
              borderWidth:0,
              width:0,
              height:0,
              left:100,
              top:30,
              visibility:false,
              zIndex:2,
              backgroundColor:'#7202e92e',
              isFocus:true
            }
          },
          {
            id:1,
            name:'欢迎是东方大陆十分艰苦拉萨的发',
            type:1,
            img:'',
            imgW:0,//图片实际原始大小
            imgH:0,//图片实际原始大小
            borderWidth:0,
            href:'',
            width:0,
            height:0,
            left:100,
            top:30,
            visibility:true,
            zIndex:1,
            backgroundColor:'#66b1ff2e',
            isFocus:false,
            focus:{
              name:'bt2-focus',
              img:'',
              imgW:0,//图片实际原始大小
              imgH:0,//图片实际原始大小
              borderWidth:0,
              width:0,
              height:0,
              left:100,
              top:30,
              visibility:false,
              zIndex:2,
              backgroundColor:'#7202e92e',
              isFocus:true
            }
          }
        ]
      }
    },
    computed:{
      contentBoxCss:function(){
        return {width:this.contentBoxWidth+'px',height:this.contentBoxHeight+'px',boxShadow: '0px 0px 10px '+this.contentBoxShadowColor,position:'relative', boxSizing: 'border-box',background:'url('+this.contentBoxBgImg+') no-repeat'};
      },
      contentWrapperCss:function(){
        return {padding: '10px',position: 'relative',width:(this.contentBoxWidth+30)+'px',position:'absolute',left:this.contentWrapperLeft+'px',top:this.contentWrapperTop+'px', boxSizing: 'border-box',cursor: this.contentBoxIsAllowMove?'-webkit-grab':'default',transform: 'scale('+this.contentWrapperScale+','+this.contentWrapperScale+')'};
      },
      contentWrapperScaleText:function(){
        return Math.round(this.contentWrapperScale*100)+'%';
      },
      myElArrayCss:function(){
          var ary=[];
          this.myElArray.forEach(function(data){
            ary.push({
              type:data.type||2,
              img:data.img||'',
              css:{
                background:!!data.img?'url('+data.img+') no-repeat':'transparent',
                backgroundColor:data.backgroundColor||'#66b1ff2e',
                backgroundSize:'100% 100%',
                border:(data.borderWidth||0)+'px red dashed',
                width:data.width+'px',
                height:data.height+'px',
                top:data.top+'px',
                left:data.left+'px',
                visibility:!!data.visibility?'visible':'hidden',
                zIndex:data.zIndex
              },
              focus:{
                img:data.focus.img||'',
                css:{
                  background:!!data.focus.img?'url('+data.focus.img+') no-repeat':'transparent',
                  backgroundColor:data.focus.backgroundColor||'#7202e92e',
                  backgroundSize:'100% 100%',
                  border:(data.focus.borderWidth||0)+'px red dashed',
                  width:data.focus.width+'px',
                  height:data.focus.height+'px',
                  top:data.focus.top+'px',
                  left:data.focus.left+'px',
                  visibility:!!data.focus.visibility?'visible':'hidden',
                  display:!!data.focus.visibility?'block':'none',
                  zIndex:data.focus.zIndex
                }
              }
            });
          });
          return ary;
      },
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleImgUploadSuccess(res, file,fileList){
        console.log('页面组件元素图片上传成功',res,file,fileList);
        this.myElObj.img = file.response.data;
      },
      handlePageBgUploadSuccess(res, file,fileList){
        console.log('页面底图上传成功',res,file,fileList);
        this.contentBoxBgImg = file.response.data;
      },
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

        if(this.isEditFocusMode) return 0;
        if(this.myElIsMoving) return false;
        let typeStr=e.dataTransfer.getData("text");
        if(typeStr=='my-text'){
          this.newMyEl(1);
        }
        if(typeStr=='my-button'){
          this.newMyEl(2);
        }
        if(typeStr=='my-img'){
          this.newMyEl(3);
        }
      },

      resetContentBoxPosition(e){
        this.contentWrapperTop=0;
        this.contentWrapperLeft=0;
        this.contentWrapperTopNew=0;
        this.contentWrapperLeftNew=0;
        this.contentWrapperScale=1;
      },

      newMyEl(type){
        this.myElArray.push(
          {
            id:new Date().getTime(),
            name:new Date().getTime(),
            type:type,
            img:'',
            imgW:0,//图片实际原始大小
            imgH:0,//图片实际原始大小
            borderWidth:0,
            href:'',
            width:200,
            height:200,
            left:100,
            top:30,
            visibility:true,
            zIndex:1,
            backgroundColor:'#66b1ff2e',
            isFocus:false,
            focus:{
              name:new Date().getTime()+'-focus',
              img:'',
              imgW:0,//图片实际原始大小
              imgH:0,//图片实际原始大小
              borderWidth:0,
              width:200,
              height:200,
              left:150,
              top:30,
              visibility:false,
              zIndex:2,
              backgroundColor:'#7202e92e',
              isFocus:true
            }
          }
        );
      },

      myElImgLoad(e,obj){
        console.log('myElImgLoad:',e,obj,e.target.width,e.target.height);
        obj.imgW=e.target.width;
        obj.imgH=e.target.height;
        if(parseInt(obj.width,10)<=0){ //新加入的高宽重置为实际原始高宽
          obj.width=obj.imgW;
          obj.height=obj.imgH;
        }
        obj.backgroundColor='transparent';
      },
      myElImgResetWH(obj){
        obj.width=obj.imgW||200;
        obj.height=obj.imgH||200;
      },
      myElImgError(e,obj){
        console.log('myElImgError:',e,obj);
        obj.width=200;
        obj.height=200;
      },

      myElEnterEditFocus(e){
        if(this.isEditFocusMode){
          this.myElObj.visibility=false;
          this.myElObj=this.myElArray[this.myElObjIndex]
          this.isEditFocusMode=false;
          if(!!this.myElObj.img){
            this.myElImgFileList=[{name:this.myElObj.name,url:this.myElObj.img}];
          }else{
            this.myElImgFileList=[];
          }
          this.myElEnterEditFocusBtText="进入编辑";
          this.$notify.info({
            title: '消息',
            message: '您已退出光标编辑模式!'
          });
        }else{
          this.myElObj=this.myElArray[this.myElObjIndex].focus;
          this.myElObj.visibility=true;
          this.isEditFocusMode=true;
          if(!!this.myElObj.img){
            this.myElImgFileList=[{name:this.myElObj.name,url:this.myElObj.img}];
          }else{
            this.myElImgFileList=[];
          }
          this.myElEnterEditFocusBtText="退出编辑";
          this.$notify.info({
            title: '消息',
            message: '您已进入光标编辑模式!只能编辑光标，其他功能已禁用。'
          });

        }
      },

      myElMouseDown(e,obj,index){
        if(!!this.contentBoxIsAllowMove) return 0;
        if(this.isEditFocusMode&&!!!obj.isFocus) return 0;//在光标编辑模式下，不可以对非光标组件移动
        this.myElObjIndex=index||0;
        this.myElObj=obj;
        if(!!this.myElObj.img){
          this.myElImgFileList=[{name:this.myElObj.name,url:this.myElObj.img}];
        }else{
          this.myElImgFileList=[];
        }
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
          this.myElObj.top=this.myElTop;
          this.myElObj.left=this.myElLeft;
        }
        return 0;

      },
      myElMouseUp(e){
        if(!!!this.myElIsMoving) return 0;
        this.myElIsMoving=false;
        this.myElObj.zIndex=this.myElZindex;//还原之前暂存的值
        this.myElZindex=0;
        //this.myElObj={};
        console.log('myElMouseUp',this.myElIsMoving,e);
      },
      myElMouseOut(e){
        this.myElMouseUp(e);
      },
      myElKeyUp(e,obj){
        if(!!this.contentBoxIsAllowMove) return 0;
        console.log('myElKeyUp',e,obj);
        obj.top-=1;
      },
      myElKeyDown(e,obj){
        if(!!this.contentBoxIsAllowMove) return 0;
        console.log('myElKeyDown',e,obj);
        obj.top+=1;
      },
      myElKeyLeft(e,obj){
        if(!!this.contentBoxIsAllowMove) return 0;
        console.log('myElKeyLeft',e,obj);
        obj.left-=1;
      },
      myElKeyRight(e,obj){
        if(!!this.contentBoxIsAllowMove) return 0;
        console.log('myElKeyRight',e,obj);
        obj.left+=1;
      },


      handleClickRightTab(tab,e){
        console.log('handleClickRightTab',tab,e);
      },
      rightTabLayerTreeItemMousedown(e,data){
        console.log('rightTabLayerTreeItemMousedown',data);
        data.zIndexOld=data.zIndex;
        data.zIndex=99999;
        data.borderWidth=2;
      },
      rightTabLayerTreeItemMouseup(e,data){
        console.log('rightTabLayerTreeItemMouseup',data);
        data.zIndex=data.zIndexOld;
        data.borderWidth=0;
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
  padding: 20px 0px;
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
  border: none;
}
.allowDrag .contentBox *:hover{
  outline: 2px #fa3737 dashed;
}

.rightTabLayerTreeItem{
}
.rightTabLayerTreeItem.focusLayer{
 
}
.rightTabLayerTreeItemText{
  display: block;
  text-overflow:ellipsis;/*值为clip表示剪切，ellipsis时为显示省略号*/
  overflow:hidden; 
  white-space:nowrap;
  background-color: #e1e1e1; 
  padding: 5px 10px;
  cursor: pointer;
}
.rightTabLayerTreeItemText:hover,.focusLayer .rightTabLayerTreeItemText:hover{
  background-color: #4099f54a;
}
.focusLayer .rightTabLayerTreeItemText{
   background-color: #eee;
   padding-left: 30px;
}

</style>