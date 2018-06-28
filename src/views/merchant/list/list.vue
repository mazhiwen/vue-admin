<template>
  <div>
    <Card>
      <Form ref="merchantSearchForm" inline :rules="merchantSearchRules" :label-width="80" :model="params">
        <FormItem label="商户ID" prop="merchantId">
          <Input v-model="params.merchantId"></Input>
        </FormItem>
        <FormItem label="商户账号">
          <Input v-model="params.mobile"></Input>
        </FormItem>
        <FormItem label="商户名称">
          <Input v-model="params.name"></Input>
        </FormItem>
        <FormItem label="商户类型">
          <Select v-model="params.merchantAuth">
            <Option value=" ">全部</Option>
            <Option v-for="(item,index) in merchantAuth"  :value="index" :key="index">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem label="开通服务">
          <Select multiple v-model="params.type" style="width:150px;">
            <Option v-for="(item,index) in checkItemInfoList" :value="item.type" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="起止日期">
          <DatePicker type="daterange" v-model="registeredAt" style="width: 200px"></DatePicker>
        </FormItem>
        <!--<FormItem label="结束日期">
          <DatePicker type="date" v-model="params.registeredAtEnd"></DatePicker>
        </FormItem>-->
        <FormItem label="状态">
          <Select v-model="params.activation">
            <Option value=" ">全部</Option>          
            <Option value="0">关闭</Option>
            <Option value="1">激活</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">查询</Button>
          <Button type="primary" @click="toEdit('new')">添加</Button>
        </FormItem>
      </Form>
      <br>
      <Table :loading="tableLoading" :columns="columns1" :data="data1"></Table>
      <Page :total="pageTotal" :current="params.pageNum" :page-size="params.pageSize" @on-change="search"></Page>
      <send-textmsg :modal-status="msgModalStatus" :otp-type="currentMsgType" @finished="msgSuccessHandler" @status-change="msgModalStatusChange"></send-textmsg>
    </Card>
  </div>
</template>

<script>
import {Icon} from 'iview';
import axios from 'axios';
import myFilters from 'filters';
import {merchantAuth} from 'statics/dataConfig';
import {commonRequest ,paramsFormat} from 'utils';
import {SendTextmsg} from 'components';

export default {
  data () {
    return {
      merchantAuth,
      columns1: [
          {
              type: 'index',
              width: 60,
              align: 'center'
          },
          {
              title: '商户ID',
              key: 'merchantId'
          },
          {
              title: '商户账号',
              key: 'mobile'
          },
          {
              title: '商户名称',
              key: 'name'
          },
          {
              title: '开通服务',
              key: 'types'
          },
          {
              title: '类型',
              key: 'merchantAuth'
          },
          {
              title: '注册日期',
              key: 'registeredAt',
              render:(h,{row})=>{
                return (
                  <span>{myFilters.msToDate(row.registeredAt)}</span>
                )
              }
          },
          {
              title: '状态',
              render: (h, {row}) =>{
                return  (
                  <div>
                    <Switch v-model={this.data1[row._index].activationStatus} onOn-change={this.changeItemStatus.bind(this,row)}></Switch>
                  </div>
                )
              }  
          },
          {
              title: '编辑',
              render:(h,{row})=>{
                return (
                  <a onClick={this.toEdit.bind(this,row.merchantId)}>
                    <Icon size="20" type="compose"/>
                  </a>
                )
              }
          }
      ],
      merchantSearchRules:{
        merchantId:[
        ]
      },
      data1: [],
      tableLoading:false,
      pageTotal:0,
      params:{
        pageNum:1,
        pageSize:20,
        type:[],
        activation:'',
        registeredAtBegin:'',
        registeredAtEnd:''
      },
      registeredAt:['',''],
      
      checkItemInfoList:[],
      msgModalStatus:false,
      currentData:{},
      currentMerchantId:'',
      currentMsgType:''
      
    }
  },
  components:{
    SendTextmsg
  },
  computed:{
    
  },
  mounted () {
    commonRequest.getCheckItemInfo().then((res)=>{
      this.checkItemInfoList=res;
    });
    this.search();
    
  },
  methods: {

    msgModalStatusChange(status){
      this.msgModalStatus=status;
    },
    toEdit(id){
      // if(id=='new'){
      //   this.$router.push({name:'merchant.edit',params:{id}});
      // }else{
      //   this.currentMsgType='businessEdit';
      //   this.currentMerchantId=id;
      //   this.msgModalStatus=true;

      // }
      this.$router.push({name:'merchant.edit',params:{id}});
      
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
      this.$refs['merchantSearchForm'].validate((valid)=>{
        if(valid){
          this.tableLoading=true;     
          let params={...this.params};
          if(typeof(pageNum)=='number'){
            params.pageNum=pageNum;
          }else{
            params.pageNum=1;
          }
          
          if(this.registeredAt[0]){
            params.registeredAtBegin=myFilters.msToDate(this.registeredAt[0]);
            params.registeredAtEnd=myFilters.msToDate(this.registeredAt[1]);
          
          }

          params.type=params.type.join(',');
          paramsFormat.deleteEmpty(params);
          axios.get('v1/merchant/list',{params:params})
            .then(res=>{
                this.pageTotal=parseInt(res.data.total);
                let data=res.data.list;
                data.forEach((value,index) => {
                    value.activationStatus=value.activation=='1'?true:false;
                });                    
                this.data1=data;
            })
            .finally(()=>{
                this.tableLoading=false;
            })
        }else{

        }
      })
      
    }

  }
}
</script>
