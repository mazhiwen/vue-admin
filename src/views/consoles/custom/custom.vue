<template>
<div class="page_custom">
  
  <SingleCheckBase :title="title"
    :types="types" @onSubmit="onSubmit" :isEmpty="true"
    :submitLoading="submitLoading"
    @onConditionlistUpdated="onConditionlistUpdated"
  >
    <a href="#" slot="cardextra" 
      @click.prevent="modifiyProductHandler"
    >
      修改产品
    </a>
  </SingleCheckBase>
  
  <br/>
  <CustomRsult 
    :data="customResultData" :types="types" 
  />
  <br>
  <BatchCheckBasic title="批量查询"
    :requestData="requestUrl" v-if="showBatch"
  >
  </BatchCheckBasic>
  
  <Spin fix 
    v-if="!isValid"
  >
    <h3>{{inValidmsg}}</h3>
  </Spin>
  <ModalProductEdit
    :visible="modalProductEdit"
    @closeModal="modalProductEdit=false;"
    :modalID="modalID"
    :initCheckArr="productCheck"
    @onOkCallBack="updateProductCall"
  />




</div>
</template>

<script>
import axios from 'axios';
import {commonRequest } from 'utils';
import {mapState,mapMutations} from 'vuex';

export default {
  data () {
    return {
      title:'',
      showBatch:true,
      isValid:false,
      inValidmsg:'',
      modalProductEdit:false,
      modalID:this.$route.params.id,
      productCheck:[],
      initData:{},
      submitLoading:false,
      name:'',
      modelItems:[],
      types:[],
      requestUrl:{
        import:{
          url:'v1/model/productVerifies/batchVerify/verifyModelToGenerateReport',
        },
        exportUrl:{
          url:'v1/model/productVerifies/batchVerify/downloadTemplate',
        },
        getBatchAll:{
          url:`v1/model/application/batch/listBatchApplication/${this.modalID}`,
        },
        result:{
          url:'v1/model/application/batch/downloadBatchReport',
          params:{
            'batchModelId':'batchId'
          }
        },
        delete:{
          url:`v1/model/application/batch/deleteBatch`,
          params:{
            'batchId':'batchId'
          }
        },
      },
      customResultData:{
        inputInfo:{},
        baseInfo:{},
        resultMaps:{},
        conditionList:''
      },
      conditionList:''
    }
  },
  computed:{
    storeConfigData() {
      return this.$store.state.configData.data;
    }
  },
  created(){
    this.modalID=this.$route.params.id;
    axios.get(`v1/model/productVerifies/singleVerify/getModelCheckItems/${this.modalID}`)
      .then((res)=>{
        let data=res.data;
        //  如果有效
        if(data.validate){
          
          this.title=`${data.name}查询`;
          let types=[];
          let modelItemVos=data.modelItemVos;
          modelItemVos.map((value,index)=>{
            types.push(value.type);
          })
          if(types.length==1&&types[0]=='handheldImage')
          {
            this.showBatch=false;
          }
          this.isValid=true;
          // this.modalID=modalID;
          this.modelItems=modelItemVos;
          this.types=types;
          let modalID=this.modalID;
          let requestUrl = this.requestUrl;
          requestUrl.exportUrl.params={
            modelId:modalID,
          };
          requestUrl.import.params={
            modelId:modalID,
            modelName:data.name
          };
          requestUrl.getBatchAll.url=`v1/model/application/batch/listBatchApplication/${modalID}`;

          // let conditionList = [];
          // types.map((value,index)=>{
          //   conditionList=conditionList.concat(checkItems[value]);  
          // })
          // conditionList=Array.from(new Set(conditionList));
          // this.conditionList=conditionList;
        }else{
          this.isValid=false;
          this.inValidmsg=data.message;
        }
        
      })
      
  },
  mounted () {

  },
  components:{
    
  },
  methods: {
    onSubmit(paramsV){
      this.submitLoading=true;
      commonRequest.verifyModelToGenerateReport({
        modelId:this.modalID,
        verifyParams:paramsV,
        conditionList:this.conditionList
      })
        .then((res)=> {
          this.$Notice.success({
            title: '提示',
            desc:'查询成功'
          });
          this.customResultData=res.data;
        })
        .finally(()=>{
          this.submitLoading=false;
        })
    },
    onConditionlistUpdated(list){
      let requestUrl = this.requestUrl;
      this.conditionList=list.join();
      requestUrl.exportUrl.params={
        modelId:this.modalID,
        conditionList:this.conditionList

      }
    },
    modifiyProductHandler (indexModal) {
      let productCheck=[];
      this.modelItems.map((value,index)=>{
          productCheck.push(value.checkItemId);
      });
      this.productCheck=productCheck;
      this.modalProductEdit=true;
    },
    updateProductCall(data){
      let types=[];
      let modelItems=[];
      data.map((value,index)=>{
        types.push(this.storeConfigData.checkItemInfo.productIdTypeMap[value.checkItemId]);
        modelItems.push({checkItemId:value.checkItemId});
      });
      this.modelItems=modelItems;
      this.types=types;
      this.modalProductEdit=false;
    }
  }
}
</script>
