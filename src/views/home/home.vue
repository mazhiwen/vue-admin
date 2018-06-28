<template>
  <div class="app home-page">
    <app-header></app-header>
    <app-view>
      <app-sidebar>
        <app-menu class="app-menu" mode="vertical" theme="light" :menus="menus"></app-menu>
      </app-sidebar>
      <app-content>
        <Card>
          <Row>
            选择日期 
            <DatePicker :clearable="false" v-model="dateRange" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> <Button type="primary" @click="search">查询</Button>
          </Row>
          <br>
          <Row>
            <Col span="10">
              <chart :options="probablyPieOpt" ref="probablypie" auto-resize></chart>
            </Col>
            <Col span="14">
              <chart :options="callCountLineOpt" ref="callCountLine" auto-resize></chart>

            </Col>
          </Row>
          <br>
          <Table :loading="tableLoading" :columns="columns1" :data="data1"></Table>
        </Card>
      </app-content>
    </app-view>
  </div>
</template>

<script>
import { menus } from 'statics/menus';
import ECharts from 'vue-echarts';
import axios from 'axios';
import { msToDate } from 'filters'
import {commonRequest } from 'utils';

  export default {
    data() {
      return {
        menus,
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
            
            data: ['风险人员', '学历', '银行卡', '联系人','三要素']
            
          },
          gird:{
            // left:1
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
        
        callCountLineOpt :{
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
                    return '项目: '+params.seriesName+' <br/>'
                          +'日期: '+data + '<br/>'
                          +'计数: '+params.data[1] ;
                }
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            dataZoom: {
                show: true,
                start : 0
            },
            legend : {
                data : ['银行','联系人']
            },
            grid: {
                y2: 80
            },
            xAxis : [
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
                    
        testaaa:'dsada',
        probablyTime:new Date().getTime(),
        allTime:new Date().getTime(),
        allNumToday:null,
        allNumMonth:null,
        columns1: [
            {
                type: 'index' 
            },
            {
                title: '服务名称',
                key: 'typeName'
            },
            {
                title: '调用次数',
                key: 'invokCcount'
            },
            {
                title: '成功次数',
                key: 'successCont'
            },
            {
                title: '查得次数',
                key: 'getCount'
            },
            {
                title: '调用第三方次数',
                key: 'thirdCount'
            }
        ],
        data1: [],
        dateRange:[new Date(new Date()-1000*60*60*24*30), new Date()],
        tableLoading:false,
        businessType:{
          // 'bankcardCheck':'银行',
          // 'liaisonCheck':'联系人',
          // 'riskCheckPerson':'风险',
          // 'threeItems':'三要素',
          // 'degreeCheck':'学历'
        },
        checkItemInfoList:[],
        // businessTypeArr:[]
        businessValue:[]
     
      }
    },
    components: {
      chart: ECharts,
    },
    mounted:function(){
      commonRequest.getCheckItemObj().then(({businessType,checkItemInfoList,businessValue})=>{
        console.log(businessType);
        this.businessValue=businessValue;
        this.businessType=businessType;
        this.checkItemInfoList=checkItemInfoList;
      })
      // commonRequest.getCheckItemInfo().then((res)=>{
      //   let businessType={};
      //   res.forEach((v,k)=>{
      //     businessType[v.type]=v.name;
      //   });
      //   this.businessType=businessType;
      //   this.checkItemInfoList=res;
      // });
      this.search();
    },
    methods:{
      search(){
        let params={
          starTime:msToDate(this.dateRange[0]),
          endTime:msToDate(this.dateRange[1])
        }
        let probablyPie=this.$refs.probablypie;
        probablyPie.showLoading({});
        axios.post('v1/consume_transaction/probably_spend_admin',params)
          .then(res=>{
            let data=res['data'];
            const businessType=this.businessType;
            let pieData={
              series:[
                {data:[
                  {value:  data.riskPersonCount, name: businessType['riskCheckPerson']},
                  {value: data.degreeCount, name: businessType['degreeCheck']},
                  {value: data.bankCardCount, name: businessType['bankcardCheck']},
                  {value: data.liaisonsCount, name: businessType['liaisonCheck']},
                  {value: data.threeItemCount, name: businessType['threeItems']}
                ]}
              ],
              legend:{
                data:this.businessValue
              }

            }
            probablyPie.hideLoading();
            probablyPie.mergeOptions(pieData);

          })
        this.tableLoading=true;  
        axios.post('v1/consume_transaction/invoke_list',params)
          .then(res=>{
            this.data1=res.data;
          }) 
          .finally(()=>{
            this.tableLoading=false;
          }) 

        let callCountLine=this.$refs.callCountLine;
        callCountLine.showLoading({});
        axios.post('v1/consume_transaction/probably_times',params)
          .then(res=>{
            
            let seriesData=[];
            let legendData=[];
            let emptyRes={};
            Object.entries(this.businessType).forEach(([key,value])=>{
              emptyRes[key]='';
              legendData.push(value);
            })
            
            let data={...emptyRes,...res['data']};
            
            let endDay=new Date(params.endTime).setHours(0,0,0,0);
            
            Object.entries(data).forEach(([key,value])=>{
              let indexDay=new Date(params.starTime).setHours(0,0,0,0);
              let sdata=[
                [
                  indexDay,
                  0
                ]
              ];
              value&&value.forEach((v,k)=>{
                let currentDay=new Date(v['createdAt']).setHours(0,0,0,0);
                if(indexDay < currentDay){
                  while(indexDay < currentDay){                                        
                    if(sdata[sdata.length-1][0]!=indexDay){
                      sdata.push([
                        indexDay,
                        0
                      ]);
                    }                    
                    indexDay+=86400000;                                        
                  } 
                  sdata.push([
                    indexDay,
                    v['typeCount']
                  ]);
                }else{
                  sdata[sdata.length-1][1]+=v['typeCount']; 
                }

              });
              while(indexDay < endDay){
                indexDay+=86400000;
                sdata.push([
                  indexDay,
                  0
                ]);
              }
              seriesData.push({
                name:this.businessType[key],
                type:'line',
                showAllSymbol: true,
                smooth:false,
                symbolSize: function (value){
                    return Math.round(value[2]/10) + 2;
                },
                connectNulls:true,
                data:sdata
              });
            });
            callCountLine.hideLoading();
            this.callCountLineOpt.series=seriesData;
            this.callCountLineOpt.legend.data=legendData;

          })
      },

      

    }
  }
</script>