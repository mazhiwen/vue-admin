<template>

  <router-view v-if="$route.name!=='cost'"></router-view>
  <div v-else>
    <Card id="test0">
      <h3>可用余额</h3>
      <p style="text-align:center;margin:20px 0 40px;">¥{{remaining.costTotal.toFixed(2)}}</p>
      <p class=" line-wrap"><span>现金余额:{{remaining.rechargeMoney.toFixed(2)}}</span><span>赠送余额:{{(remaining.giveawayMoney&&remaining.giveawayMoney.toFixed(2))||0}}</span></p>
    </Card>
    <br>
    <Card>
      <Tabs value="name1">
        <TabPane id="test2" label="消费记录" name="name1">
          <Row>
            起止日期
            <DatePicker style="width:200px;" :clearable="false" :options="dateOpt" v-model="record.statRange" type="daterange"></DatePicker>
            
            <Button type="primary" @click="queryRecord(couCarTotType)">查询</Button>
          </Row>
          <br>
          <Row class="chartwrap" :gutter="16">
            <Col span="12">
              <count-card @switchType="setCouCarTotType" :fillData="probablyTime" :title="`消费总计：¥${this.record.costCountNum}`" :isSwitch="true" @refresh="queryRecord">
                <chart 
                  :options="probablyPieOpt" ref="probablypie" 
                  auto-resize
                >
                </chart>
              </count-card>

            </Col>
            <Col span="12">
              
            </Col>
          </Row>    
        </TabPane>
        <TabPane label="收支明细" name="name2">
          <Row>
            起止日期
            <DatePicker style="width:200px;" :clearable="false" :options="dateOpt" v-model="detail.statRange" type="daterange"></DatePicker>
            
            <Button @click="queryDetails">查询</Button>
          </Row>
          <br>
          <Table :loading="detail.tableLoading" :columns="detail.tableColumns" :data="detail.tableData"></Table>
          
        </TabPane>
      </Tabs>
    </Card>


  </div>
</template>
<script>
  import ECharts from 'vue-echarts';
  import axios from 'axios';
import myFilters from 'filters';
import { monthMillisecond } from 'statics/mainData';
import Big from 'big.js';

  export default {
    components:{
      chart: ECharts,

    },
    data() {
      return {
        probablyTime:new Date(),
        dateOpt:{
          disabledDate(date){
            return date>new Date();
          }
        },
        
        remaining:{
          rechargeMoney:0,
          costTotal:0,
          giveawayMoney:0
        },
        record:{
          params:{
            starTime:new Date(new Date()-monthMillisecond),
            endTime:new Date()
          },
          pieType:'totalTimes',
          //totalSpend
          data:[],
          costCountNum:'',
          statRange:[new Date(new Date()-monthMillisecond),new Date()],

        },
        detail:{
          params:{
            starTime:new Date(new Date()-monthMillisecond),
            endTime:new Date()
          },
          tableLoading:false,
          statRange:[new Date(new Date()-monthMillisecond),new Date()],          
          tableData:[],
          feeTypeArr:['','充值','赠送','消费'],
          tableColumns: [
            {
                title: '流水号',
                key: 'serialno'
            },
            {
                title: '时间',
                key: 'createdAt',
                render:(h,{row})=>{
                  return (
                    <span>{myFilters.msToDate(row.createdAt)}</span>
                  )
                }
            },
            {
                title: '类型',
                key: 'feeType',
                render:(h,{row})=>{
                  return (
                    <span>{this.detail.feeTypeArr[row.feeType]}</span>
                  )
                }
            },
            {
                title: '收入',
                key: 'income'
            },
            {
                title: '支出',
                key: 'expenditure'
            },
            // {
            //     title: '余额',
            //     key: 'beginTime',
                
            // },
            {
                title: '备注',
                key: 'comment'
            }
          ]
        },
        probablyPieOpt:{
          title: {
            text: ' ',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: [' ', ' ', ' ', ' ', ' ']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                
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
        
        recordTypeTrans:{
          count:'totalTimes',
          cost:'totalSpend'
        }
        
      }
    },
    mounted:function(){
      this.queryRemaining();
      this.queryDetails();
      // this.queryRecord();
    },
    methods: {
      setCouCarTotType(type){
        this.couCarTotType=type;
      },
      queryRemaining(){
        axios.post('v1/consume_transaction/consumption_summary',
          {})
          .then(res=>{
      
            res.data?(this.remaining=res.data):'';
          })
          .finally(()=>{

          });
      },
      
      queryRecord(type){
        let probablyPie=this.$refs.probablypie;
        probablyPie.showLoading({});
        let dateRange=this.record.statRange;
        let params={};
        params.starTime=myFilters.msToDate(dateRange[0]);
        params.endTime=myFilters.msToDate(dateRange[1]);
        axios.post('v1/consume_transaction/spend_record_circle',
            params
          )
          .then(res=>{
            this.record.data=res.data;
            this.probablyTime={getDataTime: res.timestamp};
            this.getRecordData(type);
            let costCountNum=new Big(0);
            res.data.forEach((value,key)=>{
              
              costCountNum=costCountNum.plus(value['totalSpend'])
            });
            
            this.record.costCountNum=costCountNum.toString();
            probablyPie.hideLoading();
          })
          .finally(()=>{

          });
      },
      getRecordData(type){
        let probablyPie=this.$refs.probablypie;
        let pieData=[];
        let data=this.record.data;
        let legendData=[];
        type=this.recordTypeTrans[type];
        data.forEach((value,key)=>{
          if(value[type]){
            legendData.push(value.typeName);
            pieData.push({
              value:value[type],
              name:value.typeName
            });
          }
          
        });
        probablyPie.mergeOptions({
          series:[{
            data:pieData
          }],
          legend:{
            data:legendData
          }
        });
      },
      queryDetails(){
        this.detail.tableLoading=true;
        let dateRange=this.detail.statRange;        
        let params={};
        params.starTime=myFilters.msToDate(dateRange[0]);
        params.endTime=myFilters.msToDate(dateRange[1]);      
        axios.post('v1/merchant_fee_record/income_pay_list',
          params
        )
          .then(res=>{
            this.detail.tableData=res.data;
          })
          .finally(()=>{
              this.detail.tableLoading=false;
          })
      }
    },
    
  }
</script>
<style scoped>

.line-wrap span{
  display: inline-block;
  width: 50%;
  text-align: center;
}
.echarts{
  height: 300px;
}
.left-wrap span{
  text-align: left;
}
.chartwrap .firstline{
  margin-bottom: 20px;
}


</style>

