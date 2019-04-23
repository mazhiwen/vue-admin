<template>
<div>
  <Row :gutter="14">
    <Col span="12" style="margin-bottom:14px">
      <count-card 
        id="test1"  title="今日费用概览" :isSwitch="true" 
        @refresh="refreshProbably" :fillData="probablyTime"
      >
        <chart :options="probablyPieOpt" ref="probablypie" auto-resize></chart>
      </count-card>
    </Col>
    <Col span="12" style="margin-bottom:14px">
      <count-card id="test2" title="卫验分" :txtverb="weiyanCard.txt" :isSwitch="true" @refresh="refreshWeiyan" :fillData="weiyanCard.data" ></count-card>
    </Col>
  </Row>  
  <Row :gutter="14">  
    <Col span="12" style="margin-bottom:14px">
      <count-card id="test3" title="风险核查" :txtverb="riskCheckCard.txt" :isSwitch="true" @refresh="refreshRiskCheck" :fillData="riskCheckCard.data" ></count-card>
    </Col>
    <Col span="12" style="margin-bottom:14px">
      <count-card id="test4" title="信用评分" :txtverb="creditScoreCard.txt" :isSwitch="true" @refresh="refreshCreditScore" :fillData="creditScoreCard.data" ></count-card>
    </Col>
  </Row>
  <Row :gutter="14">  
    <Col span="12" style="margin-bottom:14px">
      <count-card title="风控报告" :txtverb="riskReport.txt" :isSwitch="true" @refresh="refreshReport" :fillData="riskReport.data" ></count-card>
    </Col>
    <Col span="12" style="margin-bottom:14px">
      <count-card title="车辆信息" :txtverb="car.txt" :isSwitch="true" @refresh="refreshCar" :fillData="car.data" ></count-card>
    </Col>
  </Row>
  <Row :gutter="14">  
    <Col span="12" style="margin-bottom:14px">
      <count-card title="人工智能" :txtverb="ai.txt" :isSwitch="true" @refresh="refreshAI" :fillData="ai.data" ></count-card>
    </Col>
  </Row>
</div>      

</template>

<script>
import ECharts from 'vue-echarts';
import axios from 'axios';
import {commonRequest } from 'utils';
import {mapState,mapMutations} from 'vuex';

export default {
  data() {
    return {
      probablyPieOpt:{
        title: {
          text: ' ',
          x: 'center'
        },
        tooltip: {
          // show:false,
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          
          orient: 'vertical',
          left: 'left',
          data: ['身份信息评估', '学历评估', '银行卡评估', '联系人评估']
        },
        series: [
          {
            name: '项目',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '身份信息评估'},
              {value: 310, name: '学历评估'},
              {value: 234, name: '银行卡评估'},
              {value: 135, name: '联系人评估'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      
      
      
      probablyTime:{

      },
      weiyanCard:{
        txt:'',
        data:{

        }
      },
      riskCheckCard:{
        txt:'',
        data:{

        }
      },
      riskReport:{
        txt:'',
        data:{

        }
      },
      car:{
        txt:'',
        data:{

        }
      },
      ai:{
        txt:'',
        data:{

        }
      },
      creditScoreCard:{
        txt:'',
        data:{

        }
      },
      
      

    }
  },
  computed:{
    ...mapState({
      storeConfigData:state=>state.configData.data,
    }),
  },
  components: {
    chart: ECharts
  },
  mounted:function(){
    
    
    
    
  },
  methods:{

    refreshProbably(type){
      let probablyPie=this.$refs.probablypie;
      probablyPie.showLoading({});
      let urlTail='';
      let getKey='';
      if(type=='cost'){
        urlTail='consume_transaction/probably_spend';
        getKey='amount';
      }else{
        urlTail='loan_applications/probably_num?parentType=';
        getKey='dayCount';
      }
      axios.get('v1/'+urlTail,{})
        .then(res=>{
          let businessTypeColor=this.storeConfigData.checkItemInfo.businessTypeColor;
          let businessType=this.storeConfigData.checkItemInfo.businessType;
          let data=res['data'];
          this.probablyTime={
            getDataTime:data.getDataTime
          };
          let pieData={};
          let seriesData=[];
          let legendData=[];
          let colorData=[];
          data.statNumVOList.forEach((value,index)=>{
            seriesData.push({
              value:value[getKey],
              name:businessType[value.type]
            });
            legendData.push(businessType[value.type]);
            
            colorData.push(businessTypeColor[value.type]);
          });
          pieData={
            color:colorData,
            series:[{
              data:seriesData
            }],
            legend:{
              data:legendData
            }
          }            
          probablyPie.hideLoading();
          probablyPie.mergeOptions(pieData);

        })
    },
    refreshWeiyan(type){
      let urlTail='';
      if(type=='cost'){
        urlTail=`consume_transaction/spend_total_business?parentType=validate`;
      }else{
        urlTail=`loan_applications/all_num?parentType=validate`;
      }
      axios.get('v1/'+urlTail,{})
        .then(res=>{
          let data=res['data'];
          if(type=='cost'){
            this.weiyanCard.txt='费用';
            this.weiyanCard.data={
              dayCount:`¥ ${(data.totalSpendDay?data.totalSpendDay:0)}`,
              monthCount:` ¥ ${data.totalSpendMonth||0}`
            }            
          }else{
            this.weiyanCard.txt='次数';
            this.weiyanCard.data={
              dayCount:`${data.dayCount} 次`,
              monthCount:`${data.monthCount} 次`
            }             
          }
          this.weiyanCard.data.getDataTime=data.getDataTime;

        })
    },
    refreshRiskCheck(type){
      let urlTail='';
      if(type=='cost'){
        urlTail=`consume_transaction/spend_total_business?parentType=risk`;
      }else{
        urlTail=`loan_applications/all_num?parentType=risk`;
      }
      axios.get('v1/'+urlTail,{})
        .then(res=>{
          let data=res['data'];
          if(type=='cost'){
            this.riskCheckCard.txt='费用';
            this.riskCheckCard.data={
              dayCount:`¥ ${(data.totalSpendDay?data.totalSpendDay:0)}`,
              monthCount:` ¥ ${data.totalSpendMonth||0}`
            }            
          }else{
            this.riskCheckCard.txt='次数';
            this.riskCheckCard.data={
              dayCount:`${data.dayCount} 次`,
              monthCount:`${data.monthCount} 次`
            }             
          }
          this.riskCheckCard.data.getDataTime=data.getDataTime;

        })
    },
    refreshReport(type){
      let urlTail='';
      if(type=='cost'){
        urlTail=`consume_transaction/spend_total_business?parentType=riskReport`;
      }else{
        urlTail=`loan_applications/all_num?parentType=riskReport`;
      }
      axios.get('v1/'+urlTail,{})
        .then(res=>{
          let data=res['data'];
          if(type=='cost'){
            this.riskReport.txt='费用';
            this.riskReport.data={
              dayCount:`¥ ${(data.totalSpendDay?data.totalSpendDay:0)}`,
              monthCount:` ¥ ${data.totalSpendMonth||0}`
            }            
          }else{
            this.riskReport.txt='次数';
            this.riskReport.data={
              dayCount:`${data.dayCount} 次`,
              monthCount:`${data.monthCount} 次`
            }             
          }
          this.riskReport.data.getDataTime=data.getDataTime;

        })
    },
    refreshCar(type){
      let urlTail='';
      if(type=='cost'){
        urlTail=`consume_transaction/spend_total_business?parentType=car`;
      }else{
        urlTail=`loan_applications/all_num?parentType=car`;
      }
      axios.get('v1/'+urlTail,{})
        .then(res=>{
          let data=res['data'];
          if(type=='cost'){
            this.car.txt='费用';
            this.car.data={
              dayCount:`¥ ${(data.totalSpendDay?data.totalSpendDay:0)}`,
              monthCount:` ¥ ${data.totalSpendMonth||0}`
            }            
          }else{
            this.car.txt='次数';
            this.car.data={
              dayCount:`${data.dayCount} 次`,
              monthCount:`${data.monthCount} 次`
            }             
          }
          this.car.data.getDataTime=data.getDataTime;

        })
    },
    refreshAI(type){
      let urlTail='';
      if(type=='cost'){
        urlTail=`consume_transaction/spend_total_business?parentType=ai`;
      }else{
        urlTail=`loan_applications/all_num?parentType=ai`;
      }
      axios.get('v1/'+urlTail,{})
        .then(res=>{
          let data=res['data'];
          if(type=='cost'){
            this.ai.txt='费用';
            this.ai.data={
              dayCount:`¥ ${(data.totalSpendDay?data.totalSpendDay:0)}`,
              monthCount:` ¥ ${data.totalSpendMonth||0}`
            }            
          }else{
            this.ai.txt='次数';
            this.ai.data={
              dayCount:`${data.dayCount} 次`,
              monthCount:`${data.monthCount} 次`
            }             
          }
          this.ai.data.getDataTime=data.getDataTime;

        })
    },
    refreshCreditScore(type){
      let urlTail='';
      if(type=='cost'){
        urlTail=`consume_transaction/spend_total_business?parentType=creditscore`;
      }else{
        urlTail=`loan_applications/all_num?parentType=creditscore`;
      }
      axios.get('v1/'+urlTail,{})
        .then(res=>{
          let data=res['data'];
          if(type=='cost'){
            this.creditScoreCard.txt='费用';
            this.creditScoreCard.data={
              dayCount:`¥ ${(data.totalSpendDay?data.totalSpendDay:0)}`,
              monthCount:` ¥ ${data.totalSpendMonth||0}`
            }            
          }else{
            this.creditScoreCard.txt='次数';
            this.creditScoreCard.data={
              dayCount:`${data.dayCount} 次`,
              monthCount:`${data.monthCount} 次`
            }             
          }
          this.creditScoreCard.data.getDataTime=data.getDataTime;

        })
    }
    

  }
}
</script>