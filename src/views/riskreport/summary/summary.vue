<template>
  <div>
    <count-card-usual parentType="riskReport"></count-card-usual>

  
    <br>
    <business-line parent-type="riskReport"></business-line>
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
      statisticsLineOpt:{
        title: {
            text: ' '
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            // type: 'time',
            // boundaryGap: false,
            data:[]
            // data: ['2012-3-1','2012-3-2','2012-3-3','2012-3-4','2012-3-5']
        },
        yAxis: {
            type: 'value'
        },
        
        series: [{
            name: ' ',
            type: 'line',
            smooth: true,
            data: []
        }
        
        ]
      },
      riskCount:{

      },
      statistics:{
        params:{

        },
        type:'',
        statRange:[new Date(new Date()-monthMillisecond),new Date()],
        dateOpt:{
          disabledDate(date){
            return date>new Date();
          }
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    
    downLine(){
      let params=this.getParamsStatistics();
      exportData(params, 'v1/loan_applications/exportStatDataInfo');
    },
    getParamsStatistics(){
      let originParams=this.statistics.statRange;
      if(!this.statistics.type){
        this.$Notice.warning({
          title: '请选择查询信息',
        });
        return
      }
      let params={
        type:this.statistics.type
      };
      params.statBeginTm=msToDate(originParams[0]);
      params.statEndTm=msToDate(originParams[1]);
      return params;
    },
    statisticsSearch(){
      let params=this.getParamsStatistics();
      let statisticsLine=this.$refs.statisticsLine;
      statisticsLine.showLoading({});
      
      axios.post('v1/loan_applications/statDataInfo',{},{
        params:params
      })
        .then(res=>{
          let data=res['data'];
          let pieData=[];
          let timeData=[];

          data.forEach((value,key)=>{
            pieData.push(value.count);
            timeData.push(value.statDate);
          });
          statisticsLine.hideLoading();
          statisticsLine.mergeOptions(
            {
              xAxis:{
                data:timeData
              },
              series:[
                {
                  name:'',
                  type: 'line',
                  smooth: true,
                  data: pieData
                }
              ]
            }
          );

        })
    }
  }
}
</script>
<style>
.echarts{
  width:100% !important;
}

</style>
