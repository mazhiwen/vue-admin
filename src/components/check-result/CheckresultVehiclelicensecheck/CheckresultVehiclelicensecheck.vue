<template>

  
  <table class="report-table">
    <caption>{{storeConfigData.checkItemInfo.businessType['vehicleLicenseCheck']}}</caption>
    <tbody>
      <tr>
        <th>使用性质</th><td>{{data.useType}}</td>
        <th>出厂时长</th><td>{{data.ppsDate}}</td>
        <th>车架号</th><td>{{data.vin}}</td>
      </tr>
      <tr>
        <th>车辆类型</th><td>{{data.vehicleType}}</td>
        <th>机动车所有人核验</th><td>{{data.ownerValid}}</td>
        <th>品牌名称</th><td>{{data.brandName}}</td>
      </tr>
      <tr>
        <th>强制报废剩余</th><td>{{data.retirementDate}}</td>
        <th>检验有效剩余</th><td>{{data.validityDayEnd}}</td>
        <th>发动机号</th><td>{{data.engineNumber}}</td>
      </tr>
      <tr>
        <th>初次登记时长</th><td>{{data.firstIssueDate}}</td>
        <th>车辆状态</th><td>{{data.vehicleStatus}}</td>
        <th></th><td></td>
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