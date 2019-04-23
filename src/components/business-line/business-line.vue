<template>
  <Card>
    <p slot="title">统计信息</p>
    <Row>
      起止日期
      <DatePicker style="width:200px;" :clearable="false" :options="statistics.dateOpt" v-model="statistics.statRange" type="daterange"></DatePicker>
      接口
      <Select v-model="statistics.type" style="width:200px">
        <Option v-for="(item,index) in checkItemInfoList"   :value="item.type" :key="index">{{item.name}}</Option>
      </Select>
      <Button @click="statisticsSearch">查询</Button>
      <Button @click="downLine">下载</Button>
    </Row>
    <br>
    <chart :options="statisticsLineOpt" ref="statisticsLine"  auto-resize></chart>
    
  </Card>
</template>

<script>
import axios from 'axios';
import {commonRequest,exportData } from 'utils';
import ECharts from 'vue-echarts';
import { msToDate } from 'filters'
import { monthMillisecond } from 'statics/mainData';
import {mapState,mapMutations} from 'vuex';

export default {
  props:{
    parentType:{
    },
    otpType:{
    }
  },
  components:{
    chart: ECharts
  },
  data () {
    return {
      statisticsLineOpt:{
        title: {
            text: '调用次数'
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
      checkItemInfoList:{},
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
  computed:{
    storeConfigData() {
      return this.$store.state.configData.data;
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
      // if(!this.statistics.type){
      //   this.$Notice.error({
      //     title: '请选择查询信息',
      //   });
      //   return 
      // }
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
    },
    
  },
  watch:{
    storeConfigData:function(newValue,oldValule){
      let checkItemInfoList=newValue.checkItemInfo.checkItemInfoListValid.filter((value)=>{
        return value.parentType==this.parentType
      });
      this.statistics.type=checkItemInfoList[0]['type'];
      this.checkItemInfoList=checkItemInfoList;
      this.statisticsSearch();
    },
  },
}
</script>
<style>

</style>
