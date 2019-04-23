<template>

  
  <table class="report-table">
    <caption>{{storeConfigData.checkItemInfo.businessType['liaisonCheck']}}</caption>
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