<template>
  <div>
    <count-card-usual parentType="ai"></count-card-usual>

  
    <br>
    <business-line parent-type="ai"></business-line>
  </div>
</template>

<script>
import axios from 'axios';
import ECharts from 'vue-echarts';
import {commonRequest,exportData } from 'utils';
import { msToDate } from 'filters'
import { monthMillisecond } from 'statics/mainData';

export default {
  components:{
    chart: ECharts
  },
  data () {
    return {
      
      

    }
  },
  mounted () {
    
    
  },
  methods: {
    
    
    

    
 
  }
}
</script>
<style>


</style>
