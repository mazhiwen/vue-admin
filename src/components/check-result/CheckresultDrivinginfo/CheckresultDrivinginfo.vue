<template>

<table class="report-table">
  <caption>{{storeConfigData.checkItemInfo.businessType['drivingInfo']}}</caption>
  <tbody>
    <tr>
      <th>姓名核验</th><td>{{data.nameValid}}</td>
      <th>累计计分</th><td>{{data.scoring}}</td>
      <th>驾驶证状态</th><td>{{data.driverStatus}}</td>          
    </tr>
    <tr>
      <th>初次领证时长</th><td>{{data.firstIssueDate}}</td>
      <th>有效剩余</th><td>{{data.termoFvalidity}}</td>
      <th>准驾车型</th><td>{{data.quasiDrivingType}}</td>
    </tr>
  </tbody>
</table>

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