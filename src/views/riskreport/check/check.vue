<template>
<div class="page-riskpeport">

  <div  style="margin-bottom:20px;" class="no_print">

    <SingleCheckBase
      :types="types" :title="title"
      @onSubmit="onSubmit" :submitLoading="submitLoading"
      :showRetry="showRetry" @onRetry="retry" @onClear="clear"
      :submitDisabled="showRetry" 
    >
      <div slot="result">
        <div class="red">
          {{resultTxt}}
        </div>
        <Progress v-if="progressShow"  
          :percent="queryPercent" status="active"
        >
          <span v-if="submitDisabled"></span>
          <!--<span v-else><Icon type="checkmark-circled"></Icon>查询结束</span>-->
        </Progress>
      
      </div>
      
      
    </SingleCheckBase>
  </div> 
  <!--测试用按钮-->
  <!-- <Button @click="retry">测试用获取风控报告</Button> -->
  
  <Card v-if="reportShow" class="report-card" :bordered="false" padding="20" dis-hover :padding="0">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div slot="title" class="report-head">
      <p class="title">风控报告结果</p>
    </div>
    <div  class="report-box">
      <table class="report-table" style="width:300px;margin:2rem auto;">
        <thead>
          <tr><th>客户评级</th><td>{{riskTips.scoreClass2}}</td></tr>
        </thead>
      </table>
      <table class="report-table">
        <caption>输入信息</caption>
        <tbody>
          <tr>
            <th>姓名</th><td>{{queryParams.name }}</td>
            <th>手机号码</th><td>{{queryParams.mobile }}</td>
            <th>证件号</th><td>{{ queryParams.cnid }}</td>
          </tr>
        </tbody>
      </table>
      <table v-if="basicInfo" class="report-table">
        <caption>基本信息</caption>
        <tbody>
          <tr><th>姓名</th><td>{{ basicInfo.name }}</td><th>性别</th><td>{{ basicInfo.gender }}</td></tr>
          <tr><th>出生日期</th><td>{{basicInfo.birth}}</td><th>证件号</th><td>{{ basicInfo.cnid }}</td></tr>
          <tr><th>手机号码</th><td>{{ basicInfo.account }}</td><th>手机在网时长(月)</th><td>{{basicInfo.mobileInNetTime}}</td></tr>
          <tr><th>年龄</th><td>{{basicInfo.age}}</td><th>申请日期</th><td>{{basicInfo.applied_at}}</td></tr>
        </tbody>
      </table>
      <table v-if="riskInfo" class="report-table">
        <caption>风险排查</caption>
        <tbody>
          <tr><th>类别</th><th>结果</th><th>特别标示/核查结果</th></tr>
          <tr><th>手机号码实名登记</th><td>{{riskInfo.mobileRealName}}</td><td></td></tr>
          <tr><th>手机号风险识别</th><td>{{ riskInfo.phoneRiskResult}}</td><td>{{ riskInfo.phoneRiskRemark }}</td></tr>
          <tr><th>不良征信历史（近半年逾期）</th><td>{{riskInfo.badCreditHistoryResult}}</td><td>{{riskInfo.badCreditHistoryRemark }}</td></tr>
          <tr>
            <th>信用卡逾期评分</th><td>{{ riskInfo.creditCardInfoOverdueCnt>0?'是':'否' }}</td>
            <td>{{ riskInfo.creditCardInfoOverdueCnt }}</td>
          </tr>
          <tr>
            <th>信用卡风险评级</th>
            <td>{{ riskInfo.creditCardInfoCreditCash>0? '是':'否' }}</td>
            <td>{{ riskInfo.creditCardInfoCreditCash }}</td>
            </tr>
        </tbody>
      </table>
      <table v-if="blackList" class="report-table">
        <caption>黑名单</caption>
        <tbody>
          <tr>
            <th>内部黑名单</th>
            <th>结果</th>
            <th>特别标示/核查结果</th>
          </tr>
          <tr>
            <th>身份证命中黑名单</th>
            <td>{{ blackList.isCnidInBlackListResult }}</td>
            <td>{{ blackList.isMobileInBlackListRemark}}</td>
          </tr>
          <tr>
            <th>手机号码命中黑名单</th>
            <td>{{ blackList.isMobileInBlackListResult }}</td>
            <td>{{ blackList.isCnidInBlackListRemark }}</td>
          </tr>
          <tr>
            <th>外部黑名单</th>
            <th>结果</th>
            <th>特别标示/核查结果</th>
          </tr>
          <tr>
            <th>司法类</th>
            <td>{{ blackList.isInExternalBlackListJudicialResult }}</td>
            <td>{{ blackList.isInExternalBlackListJudicialRemark }}</td>
          </tr>
          <tr>
            <th>信贷逾期类</th>
            <td>{{ blackList.isInExternalBlackListCreditOverdueResult }}</td>
            <td>{{ blackList.isInExternalBlackListCreditOverdueRemark }}</td>
          </tr>
          <tr>
            <th>其他黑名单</th>
            <td>{{ blackList.isInExternalBlackListOtherResult }}</td>
            <td>{{ blackList.isInExternalBlackListOtherRemark }}</td>
          </tr>
        </tbody>
      </table>
      <table v-if="externalPlatformLoans" class="report-table">
        <caption>多机构借贷</caption>
        <tbody>
          <tr>
            <th></th>
            <th>结果</th>
            <th>风险等级</th>
          </tr>
          <tr>
            <th>七天内多机构借贷申请（手机号/身份证）</th>
            <td>
              {{ externalPlatformLoans.fmD7CellLoanCnt }}/{{ externalPlatformLoans.fmD7CnidLoanCnt }}
            </td>
            <td>{{ externalPlatformLoans.fmD7RiskLevel }}</td>
          </tr>
          <tr>
            <th>一个月内多机构借贷申请（手机号/身份证）</th>
            <td>
              {{ externalPlatformLoans.fmM1CellLoanCnt }}/{{ externalPlatformLoans.fmM1CnidLoanCnt }}
            </td>
            <td>{{ externalPlatformLoans.fmM1RiskLevel }}</td>
          </tr>
          <tr>
            <th>三个月内多机构借贷申请（手机号/身份证）</th>
            <td>
              {{ externalPlatformLoans.fmM3CellLoanCnt }}/{{ externalPlatformLoans.fmM3CnidLoanCnt }}
            </td>
            <td>{{ externalPlatformLoans.fmM3RiskLevel  }}</td>
          </tr>
        </tbody>  
      </table>
      <table v-if="nfcsReport" class="report-table">
        <caption>贷款信息概要</caption>
        <tbody>
          <tr>
            <th>多贷评级</th>
            <td>{{nfcsReport.loanDealInfoLoanCount }}</td>
            <th>授信上限评分</th>
            <td>{{nfcsReport.loanDealInfoMaxCreditQuota }}</td>
          </tr>
          <tr>
            <th>总负债评分</th>
            <td>{{nfcsReport.loanDealInfoLoanTotalMoney }}</td>
            <th>当前负债评分</th>
            <td>{{ nfcsReport.loanDealInfoLoanBalance  }}</td>
          </tr>
          <tr>
            <th>月度负债评分</th>
            <td>{{ nfcsReport.loanDealInfoTreatyMonthRepayment  }}</td>
            <th>逾期严重度评分</th>
            <td>{{nfcsReport.loanDealInfoCurrentOverdueTotalMoney }}</td>
          </tr>
          <tr>
            <th>逾期额峰值评估</th>
            <td>{{nfcsReport.loanDealInfoHighestOverdueMoney}}</td>
            <th>逾期时长峰值评估</th>
            <td>{{nfcsReport.loanDealInfoHighestOverdueCount}}</td>
          </tr>
        </tbody>  
      </table>
      <template v-if="antiFraud">
        <table class="report-table">
          <caption>欺诈风险</caption>
          <tbody>
            <tr>
              <th>欺诈风险评级（0-100）</th>
              <td>{{antiFraud.fraudScore}}</td>
              <th>欺诈风险等级</th>
              <td>{{antiFraud.fraudClass}}</td>
            </tr>
          </tbody>  
        </table>
        <table class="report-table">
          <caption>欺诈提示</caption>
          <tbody>
            <tr v-for="item in antiFraud.fraudReasons">
              <td>{{ item }}</td>
            </tr>
          </tbody>  
        </table>
      </template>
      <table v-if="riskTips.reasons" class="report-table">
        <caption>风险提示</caption>
        <tbody>
          <tr v-for="item in riskTips.reasons">
            <td>{{ item }}</td>
          </tr>
        </tbody>  
      </table>
    </div>
  </Card>
  <div v-if="reportShow" style="text-align: center;margin: 30px 0 50px;">
    <Button type="info" @click="exportOut" size="large">导出</Button>
    <!--<Button type="info" @click="print" size="large">打印</Button>-->
  </div>
  
  




</div>
</template>

<script>
import {Button} from 'iview';
import axios from 'axios';
import { exportData,commonRequest } from 'utils';
import  domtoimage  from 'dom-to-image';
import { saveAs } from 'file-saver/FileSaver';
import {SHOW_CHECK_RESULT,SET_RESULTTXT} from '../../../store/mutation-types'
import {mapState,mapMutations} from 'vuex';
export default {
  data () {
    return {
      submitLoading:false,
      isShowResult:false,
      resultTxt:'',
      types:['riskReport'],
      parenttype:'riskReport',
      showRetry:false,
      progressShow:false,
      queryTotalCount:0,
      querySingleCount:1,
      queryInteval:null,
      queryGap:60,
      spinShow:true,
      reportShow:false,
      submitDisabled:false,
      getReportInterval:'',
      basicInfo:null,
      nfcsReport:null,
      antiFraud:null,
      riskTips:{},
      riskInfo:null,
      blackList:null,
      riskNum:20,
      externalPlatformLoans:null,
      applicationId:'',
      queryParams:{}
    }
  },
  computed:{
    queryPercent:function () {
      return Number((this.querySingleCount*100/this.queryGap).toFixed(0));
    },
    storeConfigData() {
      return this.$store.state.configData.data;
    },
    title(){
      return `${this.storeConfigData.checkItemInfo.businessType[this.types[0]]}查询`;
    }
  },
  created(){

  },
  mounted () {


  },
  components:{
    
  },
  methods: {
    ...mapMutations([
      SHOW_CHECK_RESULT,
      SET_RESULTTXT
    ]),
    print(){
      window.print();
    },
    onSubmit(params) {
      params.type= this.types[0];
      params.parentType= this.parenttype;
      console.log(params);
      this.queryParams=params;
      this.submitHandler(params);
    },
     submitHandler(params){
      
      // this.inputSubmitDisabled=true;
      // this.isShowSubmit=false;
      // this.progressShow=false;
      this.submitLoading=true;
      axios.post('v1/riskReportApplication/single_validate',params)
        .then((res) =>{
          if(res.status == 200) {
            // this[SET_RESULTTXT]('正在查询，查询已计次，请耐心等待查询结果...');
            this.resultTxt='正在查询，查询已计次，请耐心等待查询结果...';
            this.reportShow=true;
            this.spinShow=true;
            // this.queryGap=10;
            this.queryGap=60;
            this.queryTotalCount=0;
            this.progressShow=true;
            if(res.data) {
              this.applicationId=res.data;
              this.queryTotalCount++;
              this.querySingleCount=1;
              this.queryInteval=setInterval(()=>{
                if(this.querySingleCount<this.queryGap-1){
                  this.querySingleCount++;
                }else{
                  clearInterval(this.queryInteval);
                }
              },1000);
              setTimeout(()=>{this.getReport(res.data)}, this.queryGap*1000);
              
            }else {

            }   
          }
        })
        .catch( (error)=> {
          this.submitLoading=false;
          this.reportShow=false;
          this.spinShow=true;
          this.progressShow=false;
          this.resultTxt='';
        });
    },
    exportOut(){
      // domtoimage.toJpeg(document.getElementById('report'), { quality: 0.95 })
      //   .then(function (dataUrl) {
      //     var link = document.createElement('a');
      //     link.download = 'Report.jpeg';
      //     link.href = dataUrl;
      //     link.click();
      //   });
      domtoimage.toBlob(document.getElementsByClassName('ivu-card-body')[1],{
          height:1850
        })
        .then( (blob)=> {
            saveAs(blob, 'report.png');
        });

    },
    retry(){
      this.showRetry=false;
      this.getReport(this.applicationId);
    },
    clear(){
      this.applicationId='';
      this.reportShow=false;
      this.spinShow=true;
      this.showRetry=false;
      clearInterval(this.queryInteval);

    },
    getReport(applicationId){
      this.reportShow=true;
      this.progressShow=true;
      this.spinShow=true;
      this[SHOW_CHECK_RESULT]();
      axios.post(`v1/riskReportApplication/getRiskReport?applicationId=${applicationId}`)
        .then((res) =>{
          if(res.data!='noReport'){
            clearInterval(this.queryInteval);
            this.querySingleCount=this.queryGap;
            this.spinShow=false;
            this.inputSubmitDisabled=false;
            this.submitLoading=false;
            this.resultTxt='查询成功';
            let data=JSON.parse(res.data);
            if(data.basicInfo){
              this.basicInfo=data.basicInfo.vals;
            }else{
              this.basicInfo=null;
            }
            if(data.riskInfo){
              this.riskInfo=data.riskInfo.vals;
            }else{
              this.riskInfo=null;
            }
            if(data.blackList){
              this.blackList=data.blackList.vals;
            }else{
              this.blackList=null;
            }
            if(data.externalPlatformLoans){
              this.externalPlatformLoans=data.externalPlatformLoans.vals;
            }else{
              this.externalPlatformLoans=null;
            }
            if(data.nfcsReport){
              this.nfcsReport=data.nfcsReport.vals;
            }else{
              this.nfcsReport=null;
            }
            if(data.riskTips){
              this.riskTips=data.riskTips.vals;
            }else{
              // this.riskTips=null;
            }
            if(data.antiFraud){
              this.antiFraud=data.antiFraud.vals;
            }else{
              this.antiFraud=null;
            }
            
          }else{
            this.queryTotalCount++;
            this.querySingleCount=1;
            this.queryGap=30;
            this.queryInteval=setInterval(()=>{
              if(this.querySingleCount<this.queryGap-1){
                this.querySingleCount++;
              }else{
                clearInterval(this.queryInteval);
                
              }
            },1000);
            setTimeout(()=>{this.getReport(applicationId)},30000);
          }
          
        })
        .catch( (error)=> {
          console.log(error);
          clearInterval(this.queryInteval);
          this.submitLoading=false;
          this.showRetry=true;
          this.spinShow=false;
          this.reportShow=false;
          this.progressShow=false;
          this.resultTxt='查询失败,稍后重试或联系客服';
        })
        .finally(()=>{
          
        });
    },
   
    
    
    
    
  }
}
</script>
