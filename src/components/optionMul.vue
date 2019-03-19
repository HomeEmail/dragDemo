<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>element ui</h2>
    <hr/>
    <div class="block">
      <span class="demonstration">默认 click 触发子菜单</span>
      <el-cascader
        :options="options"
        v-model="selectedOptions"
        @change="handleChange">
      </el-cascader>
    </div>
    <hr />
    <h2>测试数组里的对象属性</h2>
    <!--v-dom 自定义的全局指令 -->
    <div class="item" v-dom="item" v-for="(item,index) in options" @click="itemClick(index)" :key="item.value+'-'+1">
      {{item.label}}
      <div class="item" v-for="item2 in item.children" :key="item2.value+'-'+2">
        {{item2.label}}
        <div class="item" v-for="item3 in item2.children" :key="item3.value+'-'+3">
          {{item3.label}}
          <div class="item" v-for="item4 in item3.children" :key="item4.value+'-'+4">
            {{item4.label}}
          </div>
        </div>
      </div>
    </div>
    <el-button type="primary" @click="btClick">改变数组里的第一个对象的label属性</el-button>
    <el-button type="primary" @click="btClickAdd">向数组里添加一个对象</el-button>
    <el-button type="primary" @click="btClickChange">对添加的对象改变其label属性</el-button>

  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '4级联选择',
      options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航',
              children:[
                {
                  value:'four',
                  label:'第四级侧向导航'
                }
              ]
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
        selectedOptions: [],
    }
  },
  mounted(){
    console.log('mounted');
    setTimeout(()=>{
      this.options[0].children[0].children[0].label='auto二致';
    },3000);
  },
  methods: {
    handleChange(value) {
      console.log('handleChange',value);
      console.log('selectedOptions:',this.selectedOptions);
    },
    btClick(e){
      console.log('btClick',e);
      this.options[0].children[0].children[0].label='二致';
      console.log('btClick result',this.options);
    },
    btClickAdd(e){
      this.options.push({label:'添加1',value:'tianjia1'+(+new Date()),children:[{label:'添加1-1'+(+new Date()),value:'tianjia1-1'}]});
    },
    btClickChange(e){
      this.options[this.options.length-1].children[0].label='对添加的对象改变其label属性=二致';
    },
    itemClick(i){
      alert(i);
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.item{
  padding-left: 20px;
}
</style>
