<template>
<div>

  <Row>
    <div class="mainbtn-wrap">
      <Button  @click="refresh">刷新</Button> <Button @click="create">创建</Button>
    </div>  
    <br>
    <Table :loading="tableLoading" :columns="columns1" :data="data1"></Table>
  </Row>
  <br>
  <Modal v-model="modalEdit" width="360" :closable="false">
      <h2 slot="header" style="">
        选择权限
      </h2>
      <div style="">
        <p><span>Access Key</span><span>{{keyChoosed}}</span></p>
        <CheckboxGroup v-model="keyAuthCheck">
            <Checkbox v-for="(item,index) in checkItemInfoList" :key="index" :label="item.type">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
      <div slot="footer" class="editbottom">
          <Button   @click="modalEdit=false;" >取消</Button>
          <Button :loading="modal_loading" @click="saveHandler">确定</Button>
      </div>
  </Modal>
  <send-textmsg :modal-status="msgModalStatus" :otp-type="currentMsgType" @finished="msgSuccessHandler" @status-change="msgModalStatusChange"></send-textmsg>

</div>
</template>

<script>
  import { menus } from 'statics/menus';
  import myFilters from 'filters';
  import axios from 'axios';
  import {storageHelper,commonRequest } from 'utils';
import {SendTextmsg} from 'components';

import {Button} from 'iview';

  export default {
    props:{
      merchantId:{
          required:true
      }
    },
    data() {
      return {
        msgModalStatus:false,
        currentMsgType:'managerAccessKeyDisable',
        menus,
        columns1: [
            {
                title: 'Access Key ID',
                key: 'accessKey'
            },
            {
                title: 'Access Key Secret',
                key: 'secretKey',
                
                render:(h,{row})=>{
                    // if(row.showSecretKey){
                    //     return (
                    //         <span>{row.secretKey}</span>
                    //     )
                    // }else{
                    //     return (
                    //         <Button onClick={this.showSecretKey.bind(this,row)}>显示</Button>
                    //     )
                    // }
                    return (
                            <span>{row.secretKey}</span>
                        )
                }
                
            },
            {
                title: '权限',
                key: 'editauth',
                render:(h,params)=>{
                  return h('Button', {
                      props: {
                          type: 'text',
                          size: 'small'
                      },
                      style: {
                      },
                      on: {
                          click: () => {
                            this.modalEdit=true;
                            this.idChoosed=params.row.id;
                            this.keyChoosed=params.row.accessKey;
                            this.keyAuthCheck=params.row.authItems.split(',')||[];
                          }
                      }
                  }, '编辑')
                }
            },
            {
                title: '状态',
                key: 'state',
                render: (h, {row}) =>{
                  return  (
                    <div>
                      <Switch v-model={this.data1[row._index].activationStatus} onOn-change={this.changeItemStatus.bind(this,row)}></Switch>
                    </div>
                  )
                }
            },
            {
                title: '创建时间',
                key: 'createdAt',
                render:(h,params)=>{
                    return h('span',{},myFilters.msToDateTime(params.row.createdAt));

                }
            },
            {
                title: '操作',
                key: 'action',
                render: (h, params) => {
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'text',
                              size: 'small',
                          },
                          style: {
                              color:'#FF7C23'
                          },
                          on: {
                              click: () => {
                                  
                                    this.$Modal.confirm({
                                        title: '提示',
                                        content: '<p>确认删除?</p>',
                                        loading: true,
                                        onOk: () => {
                                            axios.post('v1/access/state',{id:params.row.id,state:'delete'})
                                                .then(res=>{
                                                    this.$Notice.success({
                                                        title: '删除成功'
                                                    });
                                                    this.refresh();
                                                }).finally(()=>{
                                                    this.$Modal.remove();
                                                })
                                                
                                            
                                        }
                                    });  
                              }
                          }
                      }, '删除')
                  ]);
              }
            }
        ],
        data1:[   ],
        modalEdit:false,
        modal_loading:false,
        keyAuthCheck:[],
        tableLoading:false,
        keyChoosed:null,
        checkItemInfoList:[],
        idChoosed:null,
        currentData:{},
        msgModalType:''
      }
    },
    mounted(){
        commonRequest.getCheckItemInfo().then((res)=>{
            this.checkItemInfoList=res;
        });
        this.refresh();
        
    },
    
    methods: {
        showSecretKey(row){
            this.msgModalType='secretKey';
            this.msgModalStatus=true;
            this.currentData=row;

        },
        msgSuccessHandler(){
          if(this.msgModalType=='secretKey'){
            this.data1[this.currentData._index].showSecretKey=true;

          }else{
            axios.post('v1/access/state',{id:this.currentData.id,state:this.currentData.activationStatus?'disable':'enable'})
                .then(res=>{
                    let title;
                    
                    title=this.currentData.activationStatus?'已禁用':'已启用';
                    
                    this.$Notice.success({
                        title: title,
                    });
                    this.data1[this.currentData._index].activationStatus=!this.currentData.activationStatus;

                })
                .finally(()=>{
                });
          }  
          
          
          
        },
        changeItemStatus(row,status){
          this.currentData=row;
          this.data1[row._index].activationStatus=row.activationStatus;
          this.msgModalStatus=true;
          
        },
        msgModalStatusChange(status){
          this.msgModalStatus=status;
        },
        refresh(){
            this.tableLoading=true;
            axios.get('v1/access/list',{params:{merchantId:this.merchantId}})
                .then(res=>{
                    let data=res.data;
                    
                    data.forEach((value,index) => {
                        value.showSecretKey='';
                        value.activationStatus=value.state=='enable'?true:false;
                        value.stateDiabled=false;
                    });                    
                    this.data1=data;
                })
                .finally(()=>{
                    
                    this.tableLoading=false;
                })

        },
        create(){
            this.keyAuthCheck=[];
            this.idChoosed=null;
            this.modalEdit=true;
        },
        saveHandler(){
            
            if(this.keyAuthCheck.length==0){
                this.$Notice.error({
                    title: '请选择权限'
                });
                return ;
            }
            this.modal_loading=true;
            if(this.idChoosed){
                axios.put('v1/access/edit',
                  {
                  authItems:this.keyAuthCheck.join(','),
                  id:this.idChoosed                  
                  })
                    .then(res=>{
                        this.modalEdit=false;

                        this.$Notice.success({
                            title: '保存成功'
                        });
                        this.refresh();
                    }).finally(()=>{
                        this.modal_loading=false;
                    });
            }else{
                axios.post('v1/access/create',{authItems:this.keyAuthCheck.join(','),merchantId:this.merchantId})
                    .then(res=>{
                        this.modalEdit=false;

                        this.$Notice.success({
                            title: '添加成功'
                        });
                        this.refresh();
                    }).finally(()=>{
                        this.modal_loading=false;
                    });
            }
            
            
    
        }
    }
  }
</script>

<style scoped lang="less">
.mainbtn-wrap{
  text-align: right;
}
.mainbtn-wrap button{
  margin-left: 10px;
  padding-left: 30px;
  padding-right: 30px;
}


.ivu-checkbox-group-item{
  display: block;
  margin: 15px auto;
}


.editbottom {
  text-align: center;
  button{
  }
}

</style>
