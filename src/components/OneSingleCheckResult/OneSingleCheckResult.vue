<template>
<div>
  
  <table v-if="type=='liaisonCheck'" class="report-table">
    <caption>联系人评估</caption>
    <tbody>
      <tr>
        <th>联系人1</th><td>{{data.liaison1}}</td>
        <th>联系人2</th><td>{{ data.liaison2}}</td>
      </tr>
      <tr>
        <th>联系人3</th><td>{{data.liaison3}}</td>
      </tr>
    </tbody>
  </table>
  <table v-else-if="type=='vehicleLicenseCheck'" class="report-table">
    <caption>查询结果</caption>
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
  <table  v-else-if="type=='drivingInfo'" class="report-table">
    <caption>查询结果</caption>
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
  <div 
    v-else
    
    class="report-table"
  >
      <h2 class="red_font">
        {{data.score}}
      </h2>
  </div>
</div>
</template>


<script>
import {Icon,Button,Poptip} from 'iview';
import axios from 'axios';
import myFilters from 'filters';

import {commonRequest ,paramsFormat} from 'utils';


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
  created(){

  }
}
</script>