<template>
<div class="component_customresult">
  <Card
    title="查询结果"
    class="card_wrap"
  >
    <div slot="extra" >
      <Icon type="md-refresh"  size="25"
        v-if="$route.name=='consoles.records'"
        @click="reRequestReport"
      />
      <Icon v-if="fillData.callId" 
        type="ios-download-outline" size="25"
        @click="downLoad"
      />
    </div>
    <div class="result_wrap">
      <div class="result_title">
        <h2>{{fillData.modelName}}</h2>
        <p>查询ID：{{fillData.callId}}</p>
      </div>
      <table class="report-table">
        <caption>输入信息</caption>
        <tbody >
          <tr v-for="(value,index) in parseInputData">
            <template v-for="(valuet,indext) in value">
              <th >{{searchKeyNameMap[indext]}}</th><td>{{valuet}}</td>
            </template>
          </tr>
        </tbody>
      </table>
      <table class="report-table">
        <caption>基本信息</caption>
        <tbody>
          <tr>
            <th>性别</th><td>{{fillData.baseInfo.gender}}</td>
            <th>出生日期</th><td>{{fillData.baseInfo.birthday}}</td>
          </tr>
          <tr>  
            <th>年龄</th><td>{{fillData.baseInfo.age}}</td>
            <th>申请日期</th><td>{{fillData.baseInfo.queryDate}}</td>
          </tr>
        </tbody>
      </table>

      <CheckResult v-for="(value,index) in typesData"
        :type="value.type" :data="value.data" :key="index"
      />
    
    </div>
  </Card>
</div>
</template>

<script>
import {Icon,Button,Poptip} from 'iview';
import axios from 'axios';
import myFilters from 'filters';
import {searchKeyNameMap,identificationTypeMap} from 'configs';
import {commonRequest ,paramsFormat,exportData,copy} from 'utils';
import qs from 'qs';
import {plateTypeMap} from 'statics/plateTypeList';

const FlagOperateButton={
  data:function () {
    return {
      visible:false
    }
  },
  template:`
    <Poptip v-model="visible" placement="top">
      <Icon type="md-flag" size="25"/>
      <div slot="content">
        <Icon type="md-flag" @click="close" color="green" size="25"/>
        <Icon type="md-flag" color="red" size="25"/>  
      </div>
    </Poptip>
  `,
  methods: {
    close () {
      this.visible = false;
    }
  }
};

export default {
  props:{
    data:{
      type:Object,
      default:()=>{
        return {
          
        };
      }
    },
    types:{
      type:Array
    },

  },
  data () {
    return {
      searchKeyNameMap:searchKeyNameMap,
      color1:'#123456',
      flagsArray:{
        'red':'红',
        'blue':'蓝',
        'yellow':'黄'
      },
      merchantAuth:[2,3],
      columns1: [
          {
              type: 'index',
              width: 60,
              align: 'center'
          },
          {
              title: '模版ID',
              key: 'id'
          },
          {
              title: '名称',
              key: 'name'
          },
          {
              title: '帐号',
              key: 'account'
          },
          {
              title: '联系电话',
              key: 'mobile'
          },
          {
              title: '联系邮箱',
              key: 'email'
          },
          
          // {
          //     title: '创建时间',
          //     key: 'createdAt',
          //     render:(h,{row})=>{
          //       return (
          //         <span>{myFilters.msToDateTime(row.createdAt)}</span>
          //       )
          //     }
          // },
          {
              title: '操作',
              render:(h,{row})=>{
                return (
                  <div>
                    
                    <FlagOperateButton/>
                    <Button size="small" type="info" onClick={this.toEdit.bind(this,row.id)}>编辑</Button>
                    <Button size="small" type="error" onClick={this.deleteHandler.bind(this,row.id)}>删除</Button>
                  </div>
                )
              }
          }
      ],
      merchantSearchRules:{
        
      },
      data1: [
        {
          id:232
        }
      ],
      tableLoading:false,
      pageTotal:0,
      params:{
        pageNum:1,
        pageSize:20,
        state:' ',
        result:' '
      },
      registeredAt:['',''],
      
      msgModalStatus:false,
      currentData:{},
      currentMerchantId:'',
      currentMsgType:'',
      isGetPropData:true,
      customResultData:{}
    }
  },
  components:{
    FlagOperateButton,
  },
  computed:{
    parseInputData:function(){
      let res=[];
      let inputInfo=copy.deepCopy(this.data.inputInfo);
      delete inputInfo.base64Str;

      let conditionList=this.data.conditionList;
      conditionList&&conditionList.split(',').map((value,index)=>{
        let fillValue=inputInfo[value];
        if(value=='plateType'){
          fillValue=plateTypeMap[fillValue];
        }else if(value=='identificationType'){
          fillValue=identificationTypeMap[fillValue];
        }
        if(index%2==0){
          res.push({
            [value]:fillValue
          })
        }else{
          res[(index+1)/2-1][value]=fillValue;
        }
      })
      // Object.entries(inputInfo).map(([key,value],index)=>{
      //     if(key=='plateType'){
      //       value=plateTypeMap[value];
      //     }else if(key=='identificationType'){
      //       value=identificationTypeMap[value];
      //     }
      //     if(index%2==0){
      //       res.push({
      //         [key]:value
      //       })
      //     }else{
      //       res[(index+1)/2-1][key]=value;
      //     }
      // })
      console.log(res);
      return res;
    },
    fillData:function(){
      if(this.isGetPropData){
        return this.data;
      }else{
        return this.customResultData;
      }
    },
    typesData:function(){
      let res=[];
      this.types.map((value,index)=>{
        res.push({  
          type:value,
          data:this.fillData.resultMaps[value]
        })
      })
      return res;
    }
  },
  watch:{

  },
  mounted () {
    // this.search();
    
  },
  methods: {
    downLoad(){
      exportData({callId:this.fillData.callId},`v1/model/exportVerifyReport`);
    },
    reRequestReport(){
      this.$emit('onRefresh');
      
      
    },
    msgModalStatusChange(status){
      this.msgModalStatus=status;
    },
    deleteHandler(id){
      this.$Modal.confirm({
        title: '',
        content: '确定删除?',
        onOk: () => {
          axios.post(`v1/busiDeveloper/deleteSoftBusiDeveloper?id=${id}`)
            .then(() =>{
              this.$Message.success({
                content:"删除成功"
              })
              this.search()
            })
        },
        onCancel: () => { 
        }
      })  
    },
    toEdit(id){

      this.$router.push({name:'bd.edit',params:{id}});
      
    },
    changeItemStatus(row,status){
      this.currentMsgType='business';
      this.currentData=row;
      this.data1[row._index].activationStatus=row.activationStatus;
      this.msgModalStatus=true;
      
    },
    msgSuccessHandler(){
      if(this.currentMsgType=='businessEdit'){
        this.$router.push({name:'merchant.edit',params:{id:this.currentMerchantId}});
      }else{
        axios.post('v1/merchant/activateOrCloseMerchant?merchantId='+this.currentData.merchantId)
          .then(res=>{
            this.data1[this.currentData._index].activationStatus=!this.currentData.activationStatus;
          });
      }
      
    },
    search(pageNum){
      this.tableLoading=true;     
      let params=this.params;
      if(typeof(pageNum)=='number'){
        params.pageNum=pageNum;
      }else{
        params.pageNum=1;
      }
      params={...this.params};
      // params.createdAt=myFilters.msToDate(params.createdAt);
      paramsFormat.deleteEmpty(params);
      axios.get('v1/busiDeveloper/list',{params:params})
        .then(res=>{
            this.pageTotal=parseInt(res.data.total);
            let data=res.data.list;                   
            this.data1=data;
        })
        .finally(()=>{
            this.tableLoading=false;
        })
    }

  }
}
</script>