<template>
<div>
  <Collapse v-model="currentCollapse">
    <Panel>
      基本信息
      <Form slot="content" ref="basicInfoForm" :rules="basicInfoRules" :model="basicInfo" :label-width="80">
        <FormItem label="商户ID">
          {{basicInfo.merchantId}}    
        </FormItem>
        <FormItem label="商户账号" prop="mobile">
          <Input v-model="basicInfo.mobile"></Input>
        </FormItem>
        <FormItem label="商户邮箱" prop="email">
          <Input v-model="basicInfo.email"></Input>
        </FormItem>
        <FormItem label="商户名称">
          <Input v-model="basicInfo.name"></Input>
        </FormItem>
        <FormItem label="注册时间">
          {{basicInfo.registeredAt | msToDateTime}}
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input placeholder="如需修改，请输入" v-model="basicInfo.password"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="basicInfo.comment"></Input>
        </FormItem>
        <FormItem label="类型">
          <CheckboxGroup v-model="basicInfo.merchantAuth">
            <Checkbox label="0">页面权限</Checkbox>
            <Checkbox label="1">API权限</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="产品">
          {{basicInfo.types}}              
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveBasicInfo">保存</Button>
        </FormItem>
      </Form>
    </Panel>
    <template v-if="merchantId!='new'">
    <Panel>
      收费规则
      <div slot="content">
        <Row>
          <Select @on-change="searchChargeRulesList"  v-model="paramsCharge.params.type" style="width:200px">
            <Option :value="' '">全部</Option>
            <Option v-for="(item,index) in checkItemInfoList" :value="item.type" :key="index">{{item.name}}</Option>
          </Select>
          <Button @click="openEditCharge">创建</Button>
        </Row>
        <br>
        <Table  :loading="paramsCharge.tableLoading" :columns="columns1" :data="data1"></Table>
        <Page :total="paramsCharge.pageTotal" :current="paramsCharge.params.pageNum" :page-size="paramsCharge.params.pageSize" @on-change="searchChargeRulesList"></Page>
      </div>
    </Panel>
    <Panel>
      测试信息
      <div slot="content" v-if="basicInfo.merchantAuth.includes('0')">
        <Row>
          <Button @click="openEditTest">创建</Button>
        </Row>
        <br>
        <Table  :loading="paramsTest.tableLoading" :columns="paramsTest.tableColumns" :data="paramsTest.tableData"></Table>
        <Page :total="paramsTest.pageTotal" :current="paramsTest.params.pageNum" :page-size="paramsTest.params.pageSize" @on-change="testList"></Page>
      </div>
    </Panel>
    <Panel>
      Accesskey管理
      <div slot="content">
        <accesskey :merchant-id="merchantId"></accesskey>
      </div>
    </Panel>
    <Panel>
      调用信息
      <div slot="content">
        <Row>
          产品
          <Select v-model="usedSearch.params.type" style="width:200px">
            <Option v-for="(item,index) in checkItemInfoList" :value="item.type" :key="index">{{item.name}}</Option>
          </Select>
          开始日期
          <DatePicker v-model="usedSearch.params.statTimeBegin" type="date"></DatePicker>
          结束日期
          <DatePicker v-model="usedSearch.params.statTimeEnd" type="date"></DatePicker>
          <Button @click="usedSearchHandle">查询</Button>
        </Row>
        <br>
        <Table :loading="usedCount.tableLoading" :columns="usedCount.tableColumns" :data="usedCount.tableData"></Table>
        <br>
        <Table :loading="usedDetails.tableLoading" :columns="usedDetails.tableColumns" :data="usedDetails.tableData"></Table>
        <Page :total="usedDetails.pageTotal" :current="usedDetails.params.pageNum" :page-size="usedDetails.params.pageSize" @on-change="usedDetailsList"></Page>
      </div>
    </Panel>
    <Panel>
      收支明细
      <div slot="content">
        <Row>
          起止日期
          <DatePicker style="width:200px;" v-model="balance.dateRange" type="daterange"></DatePicker>
          
          <Button @click="balanceSearchHandler">搜索</Button>
          <Button @click="balanceCreate">创建</Button>
        </Row>
        <br>
        <Table :loading="balance.tableLoading" :columns="balance.tableColumns" :data="balance.tableData"></Table>
        <Page :total="balance.pageTotal" :current="balance.params.pageNum" :page-size="balance.params.pageSize" @on-change="balanceSearchHandler"></Page>
      
      </div>
    </Panel>
    </template>
  </Collapse>
  <Modal :mask-closable="false" v-model="modalEditCharge" title="收费规则">
    <Form :model="editCharge" ref="editChargeForm" :rules="editChargeRules" :label-width="80">
      <FormItem label="产品" prop="type">
        <Select :disabled="editChargeDisable" v-model="editCharge.type" style="width:200px">
          <Option v-for="(item,index) in checkItemInfoList" :value="item.type" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="收费模式" prop="chargeMode">
        <Select :disabled="editChargeDisable" v-model="editCharge.chargeMode" style="width:200px">
          <Option v-for="(item,index) in chargeMode" :value="index" :key="index">{{item}}</Option>
        </Select>
      </FormItem>
      <FormItem label="单价(¥)" prop="unitCostAmount">
        <Input placeholder="四舍五入小数点后两位" :disabled="editChargeDisable" v-model="editCharge.unitCostAmount"></Input>
      </FormItem>
      <FormItem label="开始日期" prop="beginTime">
        <DatePicker :disabled="editChargeDisable" v-model="editCharge.beginTime" type="date"></DatePicker>
      </FormItem>
      
      <FormItem label="结束日期" prop="endTime">
        <DatePicker v-model="editCharge.endTime" type="date"></DatePicker>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="paramsCharge.loadingEdit" @click="saveCharge">保存</Button>              
    </div>
  </Modal>
  <Modal :mask-closable="false" v-model="paramsTest.modalEdit" title="测试信息">
    <Form ref="paramsTest" :rules="paramsTest.rules" :model="paramsTest.edit" :label-width="80">
      <FormItem label="产品" prop="type">
        <Select v-model="paramsTest.edit.type" style="width:200px">
          <Option v-for="(item,index) in checkItemInfoList" :value="item.type" :key="index">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="总条数" prop="totalCount">
        <Input v-model="paramsTest.edit.totalCount"></Input>
      </FormItem>
      <FormItem label="起止日期" prop="rangeTime">
        <DatePicker v-model="paramsTest.rangeTime" style="width: 200px" type="daterange"></DatePicker>
      </FormItem>
      
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="paramsTest.loadingEdit" @click="saveTest">保存</Button>              
    </div>
  </Modal>
  <Modal :mask-closable="false" v-model="balance.modalEdit" title="收支">
    <Form ref="balanceEdit" :rules="balance.editRules" :model="balance.edit" :label-width="80">
      <FormItem label="类型" prop="feeType">
        <Select v-model="balance.edit.feeType" style="width:200px">
          <Option :value="1">充值</Option>
          <Option :value="2">赠送</Option>
        </Select>
      </FormItem>
      <FormItem label="收入(¥)" prop="income">
        <Input v-model="balance.edit.income"></Input>
      </FormItem>
      <FormItem label="备注" prop="comment">
        <Input v-model="balance.edit.comment"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="balance.loadingEdit" @click="saveBalance">保存</Button>              
    </div>
  </Modal>
  <send-textmsg :modal-status="msgModalStatus" :otp-type="currentMsgType" @finished="msgSuccessHandler" @status-change="msgModalStatusChange"></send-textmsg>

</div>
</template>

<script>
import {Button} from 'iview';
import axios from 'axios';
import {commonRequest,exportData,paramsFormat } from 'utils';
import myFilters from 'filters';
import {chargeMode} from 'statics/dataConfig';
import {SendTextmsg,Accesskey} from 'components';

export default {
  components:{
    SendTextmsg,
    Accesskey
  },
  computed:{
    editChargeDisable:function(){
      return this.editCharge.id&&new Date(this.editCharge.beginTime).getTime()<new Date().getTime();
    },

  },
  data () {
    const initDate=[new Date(new Date()-2592000000),new Date()];
    return {
      msgModalStatus:false,
      chargeMode,
      currentCollapse:["0","1","2","3","4","5"],
      basicInfo:{
        "comment": "",
        "email": "",
        "merchantAuth": [],
        "mobile": '',
        "name": "",
        "password": "123456",
      },
      basicInfoRules:{
        mobile:[
          {required:true,message:'账号不可为空',trigger:'blur'},
          {validator(rule, value, callback, source, options) {
            var errors = [];
            if(!/^[0-9]{11}$/.test(value)) {
              errors.push(new Error('商户账户为手机号'));
            }
            callback(errors);
          }}
        ],
        email:[
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ]
      },
      columns1: [
        {
            type: 'index' 
        },
        {
            title: '产品',
            key: 'typeName'
        },
        {
            title: '收费模式',
            key: 'chargeModeName'
        },
        {
            title: '单价(¥)',
            key: 'unitCostAmount'
        },
        {
            title: '开始日期',
            key: 'beginTime',
            render:(h,{row})=>{
              
              return (
                <span>{myFilters.msToDate(row.beginTime)}</span>
              )
            }
        },
        {
            title: '结束日期',
            key: 'endTime',
            render:(h,{row})=>{
              return (
                <span>{myFilters.msToDate(row.endTime)}</span>
              )
            }
        },
        {
            title: '创建时间',
            key: 'createdAt',
            render:(h,{row})=>{
              return (
                <span>{myFilters.msToDate(row.createdAt)}</span>
              )
            }
        },
        {
            title: '操作',
            render:(h,{row})=>{
              return (
                <div>
                  <Button size="small" onClick={this.openEditCharge.bind(this,row.id)}>编辑</Button>
                  <Button size="small" onClick={this.deleteEditCharge.bind(this,row.id)}>删除</Button>
                </div>
                
              )
            }
        }
      ],
      data1: [],
      modalEditCharge:false,
      editCharge:{
        chargeMode:'',
      },
      editTest:{},
      editChargeRules:{
        type:[
          {required:true,message:'不可为空',trigger:'blur'}
        ],
        chargeMode:[
          {required:true,message:'不可为空',trigger:'blur'}
        ],
        unitCostAmount:[
          {required:true,pattern:/^(0|([1-9]\d*))(\.\d+)?$/,message:'输入错误',trigger:'blur'}
        ],
        beginTime:[
          {validator:(rule, value, callback, source, options)=> {
            var errors = [];
            if(!value) {
              errors.push(new Error('不可为空'));
            }
            if(!this.editCharge.id&&value<new Date()-86400000) {
              errors.push(new Error('创建时间不能小于当天'));
            }
            callback(errors);
          }}          
        ],
        endTime:[          
          {validator:(rule, value, callback, source, options)=> {
            var errors = [];
            if(!this.editCharge.beginTime||!value||new Date(value).getTime()<new Date(this.editCharge.beginTime).getTime()) {
              errors.push(new Error('结束日期应该大于开始日期'));
            }
            callback(errors);
          }}
        ]
      },
      checkItemInfoList:[],
      paramsCharge:{
        pageTotal:0,
        params:{
          pageNum:1,
          pageSize:10,
          type:' '
        },
        tableLoading:false,
        loadingEdit:false
        
      },
      paramsTest:{
        pageTotal:0,
        params:{
          pageNum:1,
          pageSize:10
        },
        tableLoading:false,
        loadingEdit:false,
        tableData:[],
        tableColumns: [
          {
              title: '产品',
              key: 'typeName'
          },
          {
              title: '总条数',
              key: 'totalCount'
          },
          {
              title: '使用条数',
              key: 'usedCount'
          },
          {
              title: '成功条数',
              key: 'successCount'
          },
          {
              title: '查得条数',
              key: 'hasresultCount'
          },
          {
              title: '开始日期',
              key: 'beginTime',
              render:(h,{row})=>{
                return (
                  <span>{myFilters.msToDate(row.beginTime)}</span>
                )
              }
          },
          {
              title: '结束日期',
              key: 'endTime',
              render:(h,{row})=>{
                return (
                  <span>{myFilters.msToDate(row.endTime)}</span>
                )
              }
          },
          {
              title: '操作',
              render:(h,{row})=>{
                return (
                  <div>
                    <Button size="small" onClick={this.openEditTest.bind(this,row.id)}>编辑</Button>
                  </div>
                  
                )
              }
          }
        ],
        edit:{
          
        },
        rangeTime:[],
        modalEdit:false,
        rules:{
          type:[
            {required:true,message:'不可为空',trigger:'blur'}
          ],
          totalCount:[
            {required:true,pattern:/^[0-9]+$/,message:'输入错误',trigger:'blur'}
          ],
          rangeTime:[
            {validator:(rule, value, callback, source, options)=> {
              var errors = [];
              let v=this.paramsTest.rangeTime;
              if(!v[0]||!v[1]) {
                errors.push(new Error('不可为空'));
              }
              callback(errors);
            }}
          ]
        }
      },
      
      usedCount:{
        tableLoading:false,
        tableData:[],
        tableColumns: [
          {
              title: '产品',
              key: 'typeName'
          },
          {
              title: '提交',
              key: 'submitCount'
          },
          {
              title: '成功',
              key: 'successCount'
          },
          {
              title: '查得',
              key: 'hasResultCount'
          },
          {
              title: '计费次数',
              key: 'chargeCount'
          },
          {
              title: '费用(¥)',
              key: 'amount',
              render:(h,{row})=>{
                return (
                    <span>
                     {row.amount&&row.amount.toFixed(2)}
                    </span>
                  )
              }
          },
          {
              title: '第三方调用',
              key: 'thirdCount'
          }
        ],
        
      },
      usedSearch:{
        params:{
          statTimeBegin:initDate[0],
          statTimeEnd:initDate[1],
          type:'threeItems'
        }
      },
      usedDetails:{
        pageTotal:0,
        params:{
          pageNum:1,
          pageSize:10
        },
        tableLoading:false,
        tableData:[],
        tableColumns: [
          {
              title: '日期',
              key: 'statTime',
              render:(h,{row})=>{
                
                return (
                  <span>{myFilters.msToDate(row.statTime)}</span>
                )
              }
          },
          {
              title: '产品',
              key: 'typeName'
          },
          {
              title: '提交',
              key: 'submitCount'
          },
          {
              title: '成功',
              key: 'successCount'
          },
          {
              title: '查得',
              key: 'hasResultCount'
          },
          {
              title: '收费模式',
              key: 'chargeModeName'
          },
          {
              title: '单价(¥)',
              key: 'amount',
              render:(h,{row})=>{
                return (
                    <span>{row.amount&&row.amount.toFixed(2)}</span>
                  )
              }
          },
          {
              title: '操作',
              render:(h,{row})=>{
                return (
                  <div>
                    <Button size="small" onClick={this.downloadUsed.bind(this,row)}>下载</Button>
                  </div>
                  
                )
              }
          }
        ],
      },
      

      balance:{
        pageTotal:0,
        params:{
          pageNum:1,
          pageSize:10
        },

        dateRange:[initDate[0],initDate[1]],
        tableLoading:false,
        tableData:[],
        tableColumns:[
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
              key: 'feeTypeName'
          },
          {
              title: '收入(¥)',
              key: 'income'
              
          },
          {
              title: '支出(¥)',
              key: 'expenditure',
              render:(h,{row})=>{
                return (
                    <span>{row.expenditure&&row.expenditure.toFixed(2)}</span>
                  )
              }
          },
          // {
          //     title: '金额(¥)',
          //     key: 'balance'
          // },
          {
              title: '备注',
              key: 'comment'
          }
        ],
        modalEdit:false,
        edit:{
          
        },
        loadingEdit:false,
        editRules:{
          feeType:[
            {required:true,pattern:/\S+/,message:'不可为空',trigger:'blur'}
          ],
          income:[
            {required:true,pattern:/^(0|([1-9]\d*))(\.\d+)?$/,message:'输入错误',trigger:'blur'}
          ]
        }
      },
      merchantId:this.$route.params.id,
      currentMsgType:'managerCharge',
      

    }
  },
  mounted () {
    commonRequest.getCheckItemInfo().then((res)=>{
      this.checkItemInfoList=res;
    });
    if(this.$route.params.id!="new"){
      if(this.$route.params.id==undefined){
        console.log('页面已刷新');
      }else{
        this.usedSearchHandle();
        this.balanceSearchHandler();
        this.getDetails(this.merchantId);
      }
    }
    
  },
  watch:{
    
  },
  methods: {
    msgModalStatusChange(status){
      this.msgModalStatus=status;
    },
    msgSuccessHandler(){
      
      this.openEditBalance();
      
      
    },
    
    openEditCharge(id){
      this.modalEditCharge=true;
      this.editCharge={
        chargeMode:''
      };
      if(typeof(id)=='string'){

        axios.get('v1/consumeTypeConfigs/getConsumeTypeConfigsInfo',{params:{
          id:id
        }})
          .then(res=>{
            
            this.editCharge=res.data;
            this.editCharge.beginTime=new Date(this.editCharge.beginTime);
            this.editCharge.endTime=new Date(this.editCharge.endTime);
          })

      }
    },
    deleteEditCharge(id){
      if(typeof(id)=='string'){
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认删除?</p>',
          loading: true,
          onOk:()=>{
            axios.delete('v1/consumeTypeConfigs/deleteConsumeTypeConfigsInfo',{params:{
              id:id
            }})
              .then(res=>{

                this.$Notice.success({
                    title: '删除成功',
                });
                this.searchChargeRulesList();
              })
              .finally(()=>{
                this.$Modal.remove();
              })
          }

        })
      }
    },
    openEditTest(id){

      this.paramsTest.modalEdit=true;
      this.paramsTest.edit={
        
      };
      if(typeof(id)=='string'){
        // this.paramsTest.edit.id=id;
        this.basicInfo.password='';
        axios.get('v1/pageAuth/getPageAuthInfo',{params:{
          id:id
        }})
          .then(res=>{
            this.paramsTest.edit=res.data;
            this.paramsTest.rangeTime=[new Date(res.data.beginTime),new Date(res.data.endTime)];
            
          })

      }
    },
    openEditBalance(){
      //收支明细
        this.balance.modalEdit=true;
        this.balance.edit={
        };
      
    },
    saveBasicInfo(){
      this.$refs['basicInfoForm'].validate((valid)=>{
        if(valid){
          let params={...this.basicInfo};
          params.merchantAuth=params.merchantAuth.join(',');

          axios.post('v1/merchant/saveOrUpdateMerchant',params)
            .then(res=>{
              if(res['message']=='success'){
                this.$Notice.success({
                    title: '商户编辑成功',
                });
                this.$router.push({name:'merchant.list'});
              }

            })
        } 
      });  
    },
    getDetails(id){
      axios.get('v1/merchant/getMerchantInfo',{params:{
        merchantId:id
      }})
        .then(res=>{
          this.basicInfo=res.data;
          this.basicInfo.merchantAuth= res.data.merchantAuth.split(','); 
        })

      
      this.searchChargeRulesList();
      this.testList();
      
    },
    searchChargeRulesList(pageNum){
      
      let paramsCharge=this.paramsCharge;
      paramsCharge.tableLoading=true;
      if(typeof(pageNum)=='number'){
        paramsCharge.params.pageNum=pageNum;
      }else{
        paramsCharge.params.pageNum=1;
      }
      paramsCharge.params.merchantId=this.merchantId;
      let params={...paramsCharge.params};
      paramsFormat.deleteEmpty(params);
      axios.get('v1/consumeTypeConfigs/selectConsumeTypeConfigsList',{
        params:params
      })
        .then(res=>{
          this.paramsCharge.pageTotal=parseInt(res.data.total);
          this.data1=res.data.list;
        })
        .finally(()=>{
            this.paramsCharge.tableLoading=false;
        })
    },
    saveCharge(){
      this.$refs['editChargeForm'].validate((valid)=>{
        if(valid){
          let editCharge={...this.editCharge};
          editCharge.beginTime=`${myFilters.msToDate(editCharge.beginTime)} 00:00:00`;
          editCharge.endTime=`${myFilters.msToDate(editCharge.endTime)} 23:59:59`;
          editCharge.merchantId=this.merchantId;
          editCharge.unitCostAmount=parseFloat(editCharge.unitCostAmount).toFixed(2);
          this.paramsCharge.loadingEdit=true;
          axios.post('v1/consumeTypeConfigs/createOrUpdateConfigs',editCharge)
            .then(res=>{
              if(res['message']=='success'){
                this.$Notice.success({
                    title: '保存成功',
                });
                this.modalEditCharge=false;
                this.searchChargeRulesList();
              }
              
            })
            .finally(()=>{
              this.paramsCharge.loadingEdit=false;
            })
        }
      });
      
    },
    testList(pageNum){
      this.paramsTest.tableLoading=true;
      let paramsTest=this.paramsTest;
      if(typeof(pageNum)=='number'){
        paramsTest.params.pageNum=pageNum;
      }else{
        paramsTest.params.pageNum=1;
      }
      paramsTest.params.merchantId=this.merchantId;
      axios.get('v1/pageAuth/selectPageAuthList',{
        params:paramsTest.params
      })
        .then(res=>{
          this.paramsTest.pageTotal=parseInt(res.data.total);
          this.paramsTest.tableData=res.data.list;
        })
        .finally(()=>{
            this.paramsTest.tableLoading=false;
        })
    },
    saveTest(){
      this.$refs['paramsTest'].validate((valid)=>{

        if(valid){
          let edit={...this.paramsTest.edit};
          edit.beginTime=`${myFilters.msToDate(this.paramsTest.rangeTime[0])}  00:00:00`;
          edit.endTime=`${myFilters.msToDate(this.paramsTest.rangeTime[1])} 23:59:59`;
          edit.merchantId=this.merchantId;
          this.paramsTest.loadingEdit=true;
          axios.post('v1/pageAuth/saveOrUpdatePageAuth',edit)
            .then(res=>{
              if(res['message']=='success'){
                this.$Notice.success({
                    title: '保存成功',
                });
                this.testList();
                this.paramsTest.modalEdit=false;
              }
              
            })
            .finally(()=>{
              this.paramsTest.loadingEdit=false;
            })
        }
      });
      
    },
    
    usedSearchHandle(){
      if(new Date(this.usedSearch.params.statTimeBegin)>new Date(this.usedSearch.params.statTimeEnd)){
        this.$Notice.warning({
          title:'开始日期不可大于结束日期'
        });
      }else{
        this.userdCountList();
        this.usedDetailsList();
      }
      
      
    },
    userdCountList(){
      this.usedCount.tableLoading=true;
      let params=this.usedSearchParams();
      
      paramsFormat.deleteEmpty(params);
      axios.get('v1/callInfomation/selectAllCallInfoCount',{
          params:params
        })
        .then(res=>{
          this.usedCount.tableData=res.data;
        })
        .finally(()=>{
            this.usedCount.tableLoading=false;
        })
    },
    usedSearchParams(){
      let params={...this.usedSearch.params};
      params.statTimeBegin=myFilters.msToDate(params.statTimeBegin);
      params.statTimeEnd=myFilters.msToDate(params.statTimeEnd);
      params.merchantId=this.merchantId;
      return params;
    },
    usedDetailsList(pageNum){
      this.usedDetails.tableLoading=true;
      let params=this.usedSearchParams();
      params={...this.usedDetails.params,...params};
      if(typeof(pageNum)=='number'){
        params.pageNum=pageNum;
      }else{
        params.pageNum=1;
      }
      paramsFormat.deleteEmpty(params);
      axios.get('v1/callInfomation/selectCallInfoCountByDays',{
          params:params
        })
        .then(res=>{
          this.usedDetails.pageTotal=parseInt(res.data.total);
          this.usedDetails.tableData=res.data.list;
        })
        .finally(()=>{
            this.usedDetails.tableLoading=false;
        })
    },
    balanceSearchHandler(pageNum){
      this.balance.tableLoading=true;
      let params={...this.balance.params};
      if(typeof(pageNum)=='number'){
        params.pageNum=pageNum;
      }else{
        params.pageNum=1;
      }
      params.statTimeBegin=myFilters.msToDate(this.balance.dateRange[0]);
      params.statTimeEnd=myFilters.msToDate(this.balance.dateRange[1]);
      params.merchantId=this.merchantId;
      axios.get('v1/merchant/queryFeeRecordList',{
          params:{...params}
        })
        .then(res=>{
          this.balance.pageTotal=parseInt(res.data.total);
          this.balance.tableData=res.data.list;
        })
        .finally(()=>{
            this.balance.tableLoading=false;
        })
    },
    saveBalance(){
      this.$refs['balanceEdit'].validate((valid)=>{
        if(valid){
          let edit=this.balance.edit;
          edit.merchantId=this.merchantId;
          edit.income=parseFloat(edit.income).toFixed(2);

          this.balance.loadingEdit=true;

          axios.post('v1/merchant/createFeeRecord',edit)
            .then(res=>{
              if(res['message']=='success'){
                this.$Notice.success({
                    title: '保存成功',
                });
                this.balance.modalEdit=false;
                this.balanceSearchHandler();
              }
              
            })
            .finally(()=>{
              this.balance.loadingEdit=false;
            })
        }
      });
      
    },
    downloadUsed({statTime,type}){
      statTime=myFilters.msToDate(statTime);
      let params={
        statTime,
        type,
        merchantId:this.merchantId
      };
      exportData(params, 'v1/callInfomation/exportAllDataByDay')
    },
    balanceCreate(){
      this.currentMsgType='managerCharge';    
      this.msgModalStatus=true;
    }
  },
  
}
</script>
