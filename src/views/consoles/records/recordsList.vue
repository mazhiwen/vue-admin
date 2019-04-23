<template>
  <div>
    <Card>
      <Form ref="merchantSearchForm" 
        inline :rules="merchantSearchRules"  :model="params"
        label-position="left" 
      > 
        <FormItem label="模版名称">
          <Input v-model="params.modelName"></Input>
        </FormItem>
        <FormItem label="模版ID">
          <Input v-model="params.modelId"></Input>
        </FormItem>
        <FormItem label="开始时间">
          <DatePicker type="date" v-model="params.startDate"></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker type="date" v-model="params.endDate"></DatePicker>
        </FormItem>
        <FormItem label="查询方式">
          <Select v-model="params.submitType" style="width:100px;"
            placeholder="全部" :clearable="true"
          >
            <Option v-for="(item,index) in submitTypeList"  
              :value="index" :key="index"
            >
              {{item}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="手机">
          <Input v-model="params.mobile"></Input>
        </FormItem>
        <FormItem label="姓名">
          <Input v-model="params.name"></Input>
        </FormItem>
        <FormItem label="身份证">
          <Input v-model="params.cnid"></Input>
        </FormItem>
        <FormItem label="查询ID">
          <Input v-model="params.callId"></Input>
        </FormItem>
        <FormItem label="标识">
          <Select v-model="params.mark" style="width:100px;"
            placeholder="全部" :clearable="true"
          >
            <Option v-for="(value,index) in flagsArray"  :value="index" :key="index">
              <Icon :type="value.type" 
                :color="index" :size="20"
              />{{value.label}}
            </Option>
            
          </Select>
        </FormItem>
        <FormItem >
          <Button type="primary" @click="search">查询</Button>
        </FormItem>
      </Form>
      <br>
      
      <Table :loading="tableLoading" :columns="columns1" :data="data1"
        ref="selection" border
      >
      </Table>
      <Page :total="pageTotal" :current="params.pageNum" :page-size="params.pageSize" @on-change="search"></Page>
      <br/>
      <div>
        
        <template v-if="isShowColumnSelect">
          <Button @click="batchDownload">导出</Button>
          <Button @click="isShowColumnSelect=false;">取消</Button>
        </template>
        <Button v-else @click="cancelBatch">批量操作</Button>
      </div>
      
    </Card>
  </div>
</template>

<script>
import {Icon,Button,Poptip} from 'iview';
import axios from 'axios';
import myFilters from 'filters';

import {commonRequest ,dataFormat,exportData} from 'utils';
import {flagsArray} from 'configs';



const FlagOperateButton={
  props:{
    data:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      
      visible:false,
      flagsArray:flagsArray,
      currentMark:this.data.mark||'gray'
    }
  },
  template:`
    <Poptip v-model="visible" placement="top">
      <Icon :type="flagsArray[currentMark]&&flagsArray[currentMark].type||'ios-flag'" :color="currentMark" size="25"/>
      <div slot="content">
        <Icon 
          v-for="(value,index) in flagsArray"
          @click="close(index)" :color="index" size="25"
          :key="index" :type="value.type" 
        />
        
      </div>
    </Poptip>
  `,
  mounted(){
    // console.log(this.data);
  },
  methods: {
    
    close (mark) {
      axios.post('v1/model/markApplicaiton',{
        callId:this.data.callId,
        mark
      })
        .then(res=>{
          this.currentMark=mark;
        })
        .finally(()=>{
            
        })
      this.visible = false;
    }
  }
};

export default {
  data () {
    return {
      isShowColumnSelect:false,
      submitTypeList:{
        singleLoad:'单个',
        batchLoad:'批量'
      },
      color1:'#123456',
      flagsArray:flagsArray,
      merchantAuth:[2,3],
      merchantSearchRules:{
        
      },
      data1: [],
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
      currentMsgType:''
      
    }
  },
  components:{
    FlagOperateButton
  },
  computed:{
    columns1:function(){
      let columns=[];
      if(this.isShowColumnSelect){
        columns.push({
          type: 'selection',
          width: 60,
          align: 'center'
        })
      }else{

      }
      columns=columns.concat([
        {
            type: 'index',
            width: 60,
            align: 'center'
        },
        {
            title: '模版ID',
            key: 'modelId',
            
        },
        {
            title: '模版名称',
            key: 'modelName'
        },
        {
            title: '查询ID',
            // key: 'callId',
            render:(h,{row})=>{
              return (
                <a 
                  onClick={this.toDetails.bind(this,row.callId)}
                >
                  {row.callId}
                </a>
              )
            }
        },
        {
            title: '姓名',
            key: 'name'
        },
        {
            title: '手机',
            key: 'mobile'
        },
        {
            title: '身份证',
            key: 'cnid'
        },
        {
            title: '查询时间',
            key: 'queryAt',
        },
        {
          title: '操作',
          render:(h,{row})=>{
            return (
              <div>
                
                <FlagOperateButton data={row}/>
                
                <Icon type="ios-download-outline" size="25"
                  style="margin-left:15px;"
                  
                  onClick={this.downLoad.bind(this,row.callId)}
                />
              </div>
            )
          }
        }
      ])
      
      return columns;
    }
  },
  mounted () {
    this.search();
    
  },
  methods: {
    cancelBatch(){
      this.isShowColumnSelect=true;
      this.handleSelectAll(false);
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status);
    },
    batchDownload(){
      let callIds=[];
      this.$refs.selection.getSelection().map((value,idnex)=>{
        callIds.push(value.callId);
      })
      if(callIds.length>0){
        exportData({callIds:JSON.stringify(callIds)},`v1/model/batchExportVerifyReport`);
      }else{
        this.$Notice.info({
          title: '提示',
          desc:'至少选择一个'
        });
      }
      
    },
    downLoad(callId){
      exportData({callId},`v1/model/exportVerifyReport`);
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
    toDetails(id){
      
      this.$emit('onIdClick',id);
      // this.$router.push({name:'bd.edit',params:{id}});
      
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
      params.startDate=myFilters.msToDate(params.startDate);
      params.endDate=myFilters.msToDate(params.endDate);
      dataFormat.deleteEmpty(params);
      console.log(params);
      axios.post('v1/model/listApplication',params)
        .then(res=>{
            this.pageTotal=parseInt(res.data.total);
            let data=res.data.list; 
            // this.temData=data;                  
            this.data1=data;
        })
        .finally(()=>{
            this.tableLoading=false;
        })
    }

  }
}
</script>
