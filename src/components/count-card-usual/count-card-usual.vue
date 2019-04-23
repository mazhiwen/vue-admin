<template>
  
  <div class="count-card-usual">
    <count-card 
      v-for="(item,index) in storeConfigData.checkItemInfo.checkItemInfoList" 
      :key="index" :id="`test${item.type}`" 
      v-if="item.parentType==parentType&&item.validFlag==1"  
      :title="item.name" :isSwitch="false" 
      @refresh="getData(item.type)" 
      :fillData="resData[item.type]" 
      txtverb="查询次数">
    </count-card>

  </div>
</template>

<script>
//:id 给测试加自动化索引
import CountCard from '../count-card';

import axios from 'axios';
import {commonRequest } from 'utils';
import {mapState,mapMutations} from 'vuex';

export default {
  components:{
    CountCard
  },
  props:[
    'parentType'
  ],
  computed:{
    ...mapState({
      storeConfigData:state=>state.configData.data,
    }),
  },
  data () {
    return {
      resData:{},
    }
  },
  mounted () {

  },
  methods: {
    getData(type) {
      
      axios.get('v1/loan_applications/one_num',{
        params:{
          type:type
        }
      }).
        then((res) => {
          let data = res.data;
          // this.resData = {...this.resData ,...data}
          this.resData[type]=data;
          
          this.resData = {...this.resData};
        })
    }
  }
}
</script>
<style tyle="less">
.count-card-usual{
  display:flex;
  justify-content:space-between;
  flex-wrap:wrap;
  &>*{
    width:49%;
    margin-bottom:15px;
  }
}


</style>
