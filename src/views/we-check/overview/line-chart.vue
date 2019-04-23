<template>
  <div class="statistic">
    <h1>统计信息</h1>
    <div class="select-group">
      <ul>
        <li>
          <i></i><span>开始</span>
          <DatePicker type="date" v-model="params.statBeginTm" placeholder="Select date" style="width: 110px;margin-left:12px;"></DatePicker>
          <div></div>
        </li>
        <li>
          <i></i><span>结束</span>
          <DatePicker type="date" v-model="params.statEndTm" placeholder="Select date" style="width: 110px;margin-left:12px;"></DatePicker>
        </li>
        <li>
          <span>接口</span>
          <Select v-model="params.type" style="width:133px;margin-left:12px;">
            <Option  v-if="item.parentType=='validate'" v-for="item in storeConfigData.checkItemInfo.checkItemInfoList" :value="item.type" :key="item.id">{{ item.name }}</Option>
          </Select>
        </li>
      </ul>
      <button class="orange-btn" @click="getStatData">确认</button>
    </div>
    <p class="chart-title">调用次数</p>
    <div class="line-chart" v-show="this.option.series[0].data.length !== 0">
      <!-- <div id="lineChart" style="width: 1200px;height:400px;" ></div> -->
      <chart :options="option" ref="probablypie" auto-resize></chart>
      
      <Button type="ghost" @click="exportLineData" size="large"><Icon type="arrow-down-c"></Icon>下载</Button>
    </div>
    <div v-show="this.option.series[0].data.length === 0" class="tip">暂无数据</div>
  </div>
</template>

<script>
// import echarts from 'echarts'
import ECharts from 'vue-echarts';
import axios from 'axios'
import { msToDate } from 'filters'
import { commonRequest,exportData } from 'utils'
import {mapState,mapMutations} from 'vuex';

/*
const option = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: '#999'
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#999'
      }
    }
  },
  series: [{
    data: [],
    type: 'line',
    itemStyle: {
      normal: {
        color: '#637AFF',
        lineStyle: {
          color: '#637AFF'
        }
      }
    },
    areaStyle: {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#7EB7FF' // 0% 处的颜色
          }, {
            offset: 1, color: '#9ACFFF' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    },
    smooth: true
  }]
};
*/
export default {
  data () {
    return {
      params: {
        statBeginTm:'',
        statEndTm:'',
        type:'threeItems',
      },
      option: {
        title : {
            text : '总计',
            subtext : ' '
        },
        tooltip : {
            trigger: 'item',
            formatter : function (params) {
                
                var data;
                var date = new Date(params.data[0]);
                data = date.getFullYear() + '-'
                      + (date.getMonth() + 1) + '-'
                      + date.getDate() + ' '
                      // + date.getHours() + ':'
                      // + date.getMinutes()
                      ;
                return '日期: '+date + '<br/>'
                      +'计数: '+params.data[1] ;
            }
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        dataZoom: {
            show: true,
            start : 70
        },
        legend : {
            data : ['银行','联系人']
        },
        grid: {
            y2: 80
        },
        xAxis : 
        // {
        //   type: 'category',
        //   boundaryGap: false,
        //   data: [],
        //   axisLine: {
        //     lineStyle: {
        //       color: '#999'
        //     }
        //   }
        // },
        
        [
            {   
                type : 'time',
                splitNumber:10,
                minInterval:1000*60*60*24
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: 'series1',
                type: 'line',
                showAllSymbol: true,
                symbolSize: function (value){
                    return Math.round(value[2]/10) + 2;
                },
                data: [[]]
                // (function () {
                //     var d = [];
                //     var len = 0;
                //     var now = new Date();
                //     var value;
                //     while (len++ < 200) {
                //         d.push([
                //             new Date(2014, 9, 1, 0, len * 10000),
                //             (Math.random()*30).toFixed(2) - 0,
                //             (Math.random()*100).toFixed(2) - 0
                //         ]);
                //     }
                //     return d;
                // })()
                
            }
        ]
      },
    }
  },
  computed:{
    ...mapState({
      storeConfigData:state=>state.configData.data,
    }),
  },
  created () {
    
  },
  mounted() {

    let date = new Date();
    this.params.statBeginTm = new Date(date)
    this.params.statBeginTm.setDate(date.getDate() - 30)
    this.params.statEndTm = new Date()
    this.getStatData()
  },
  components: {
    chart: ECharts,
  },
  methods: {
    getStatData() {
      let probablypie=this.$refs.probablypie;
      let params = Object.assign({},this.params)
      params.statBeginTm = msToDate(params.statBeginTm.getTime())
      params.statEndTm = msToDate(params.statEndTm.getTime())
      if(params.statBeginTm > params.statEndTm) {
        this.$Message.warning({
          content:'开始时间不能大于结束时间'
        })
        return
      }
      axios.post('v1/loan_applications/statDataInfo?type='+params.type+'&statBeginTm='+params.statBeginTm+'&statEndTm='+params.statEndTm).then((res) => {
        let data = res.data
        let x = []
        let y = []
        let sdata=[];
        for(let item of data) {
          
          sdata.push([
            item.statDate,
            item.count
          ]);
        }
        
        probablypie.mergeOptions({      
          series:[
            {
              data:sdata
            }
          ]
        });
        
      })
    },
    exportLineData () {
      let params = Object.assign({},this.params)
      params.statBeginTm = msToDate(params.statBeginTm.getTime())
      params.statEndTm = msToDate(params.statEndTm.getTime())
      exportData(params, 'v1/loan_applications/exportStatDataInfo')
    },
  },
  filters: {

  }
}
</script>
<style lang="less" scoped>
.statistic{
  background-color:#fff;
  h1{
    font-size:16px;
    padding:19px 38px;
    background-color:#FCFCFC;
  }
  .select-group{
    ul{
      display:flex;
      justify-content:flex-start;
      border:1px solid #DEDEDE;
      li{
        padding: 13px 30px;
        display:flex;
        justify-content:center;
        align-items:center;
        border-right: 1px solid #DEDEDE;
        i{
          width:27px;
          height:24px;
          display:inline-block;
          background:url('../../../images/date.png') no-repeat;
        }
        span{
          font-size: 16px;
          color: #666666;
          padding:0 12px;
          border-right:1px solid #DEDEDE;
        }
      }
      li:last-child{
        border:none;
      }
    }
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    padding: 0 44px 0 0;
  }
  .line-chart{
    display:flex;
    padding:0 80px 20px 0;
    justify-content:space-between;
    align-items:baseline;
  }
  .chart-title{
    text-align:center;
    font-size: 16px;
    color: #999999;
    padding:19px 0 0 0;
  }
  .tip{
    padding:20px;
    font-size:16px;
  }
  .line-chart{
    width:100%;
  }
  .echarts{
    width:64rem;
  }
}
</style>