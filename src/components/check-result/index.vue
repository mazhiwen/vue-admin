<template>
<div>
  <table class="report-table"
     v-if="data.failReason"
  >
    <caption>{{storeConfigData.checkItemInfo.businessType[type]}}</caption>
    <tbody>
      <tr>
        <th>{{data.failReason}}</th>
      </tr>
    </tbody>
  </table>
  <CheckresultLiaisoncheck
    v-else-if="type=='liaisonCheck'"
    :data="data"
  />
  <CheckresultVehiclelicensecheck
    v-else-if="type=='vehicleLicenseCheck'"
    :data="data"
  />
  <CheckresultDrivinginfo
    v-else-if="type=='drivingInfo'"
    :data="data"
  />
  <table class="report-table"
    v-else
  >
    <caption>{{storeConfigData.checkItemInfo.businessType[type]}}</caption>
    <tbody>
      <tr>
        <th>评估分</th><td>{{data.score}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>


<script>
import {Icon,Button,Poptip} from 'iview';
import axios from 'axios';
import myFilters from 'filters';
import CheckresultVehiclelicensecheck from 'components/check-result/CheckresultVehiclelicensecheck/CheckresultVehiclelicensecheck.vue';
import CheckresultDrivinginfo from 'components/check-result/CheckresultDrivinginfo/CheckresultDrivinginfo.vue';
import CheckresultLiaisoncheck from 'components/check-result/CheckresultLiaisoncheck/CheckresultLiaisoncheck.vue';

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
  components:{
    CheckresultVehiclelicensecheck,
    CheckresultDrivinginfo,
    CheckresultLiaisoncheck
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