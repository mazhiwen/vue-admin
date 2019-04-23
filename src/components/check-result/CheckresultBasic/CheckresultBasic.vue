<template>
<div>
  
  <table class="report-table"
  ><!--="type=='colligateScore'"--> 
    <caption>{{storeConfigData.checkItemInfo.businessType[type]}}</caption>
    <tbody>
      <tr>
        <th>评估分</th><td>{{data.score}}</td>
        <th>建议</th><td>{{data.failReason}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>


<script>
import {Icon,Button,Poptip} from 'iview';
import axios from 'axios';
import myFilters from 'filters';

import {commonRequest ,paramsFormat} from 'utils';

import {mapState,mapMutations} from 'vuex';

export default {
  props:{
    data:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    type:{
      type:String,
      default:''
    },
  },
  data () {
    return {
      productMap:{},
    }
  },
  computed:{
    ...mapState({
      storeConfigData:state=>state.configData.data,
    }),
  },
  created(){
   
  }
}
</script>