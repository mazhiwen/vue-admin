<template>
  <Card class="graphwrap" >
    <p slot="title">{{title}}</p>
    <div  slot="extra">
      <div v-if="isSwitch" class="change-btn-wrap"><Button :type="switchStyle['cost']" @click="switchType('cost')" size="small">费用</Button> | <Button @click="switchType('count')" size="small" :type="switchStyle['count']">次数</Button></div>
      <span @click="refresh()" class="graphtitle-right"><span>数据获取时间:<span class="main-num-color">{{fillData.getDataTime|msToTime}}</span></span> <a><Icon size="22" type="ios-loop-strong"></Icon></a></span>
    </div>
    <slot>
      <!--content-->
      <div class="graphcontent-wrap">
        <p style="height:20%;">今日{{txtverb}}</p>
        <p style="height:60%;text-align:center;padding-top:20px;"><strong class="graphwrap_mainnum" >{{fillData.dayCount}}</strong></p>
        <p style="height:20%;">本月{{txtverb}}  <span class="main-num-color">{{fillData.monthCount}}</span> </p>
      </div>
    </slot>
    

  </Card>
</template>

<script>
let switchList=['cost','count'];
export default {
  props:{
    title:{
      default:' '
    },
    isSwitch:{
      default:false
    },
    fillData:{
      default:()=>{
        return {
          getDataTime:'',
          dayCount:'',
          monthCount:''
        }
      }
    },
    txtverb:{
      default:''
    }
  },
  computed:{
    switchStyle:function () {
      let obj={};
      switchList.forEach((v,k)=>{
        
        this.type==v?obj[v]='default':obj[v]='text';
      });
      return obj;

    }
  },
  data () {
    return {
      type:'count'
    }
  },
  mounted () {
    // console.log(document.getElementById('1'));
    
    
    this.switchType(this.type);
    
    
  },
  methods: {
    switchType(type){
      this.type=type;
      this.$emit('switchType',type);
      // this.switchStyle[type]='ghost';
      this.refresh();
    },
    refresh(){
        
        this.$emit('refresh',this.type);
        
    }
  }
}
</script>
<style>


</style>
