
<template>
<div>

  <SingleCheckBase
    :types="types" :title="title"
    @onSubmit="onSubmit" :submitLoading="submitLoading"
  >
    <Row class="red" slot="result">
    
      <OneSingleCheckResult v-if="isShowResult"
        :data="resultData" :type="types[0]"
      />
    
    </Row>
  </SingleCheckBase>
  <br>
  
  <batch-check parenttype="car" title="批量查询" 
    :requestUrl="{
      import:'drivinginfo/import_validate/',
      exportUrl:'drivinginfo/export_model',
      result:'drivinginfo/export_batch_result'
    }" 
    type="drivingInfo"
  >
  </batch-check>

  




</div>
</template>

<script>
import {Button} from 'iview';
import axios from 'axios';
import { exportData,commonRequest } from 'utils'
import {SHOW_CHECK_RESULT,SET_RESULTTXT} from 'store/mutation-types'
import {mapState,mapMutations} from 'vuex';
// 沪C92V73
export default {
  data () {
    return {
      parenttype:'car',
      types:['drivingInfo'],
      params:{

      },
      showResult:false,
      submitLoading:false,
      isShowResult:false,
      inputSubmitDisabled:false,
      checkData:{
        
      },
      resultData:{
      },
    }
  },
  computed:{
    storeConfigData() {
      return this.$store.state.configData.data;
    },
    title(){
      return `${this.storeConfigData.checkItemInfo.businessType[this.types[0]]}查询`;
    }
  },
  created () {

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
    
    onSubmit(paramsV){
      // this.inputSubmitDisabled=true;
      let params={...paramsV};
      delete params.parentType;
      delete params.type;
      this.isShowResult=false;
      this.submitLoading=true;
      axios.post(`v1/vehiclelicense/single_validate/car/drivingInfo`,params)
        .then((res)=> {
          if(res.status === 200) {
            // this[SHOW_CHECK_RESULT]();
            // this.inputSubmitDisabled=false;
            this.isShowResult=true;
            if(res.data.respCode=='s00') {
              this.showResult=true;
              
              this.checkData = res.data;
              this.resultData=res.data;
            }else {
              this.showResult=false;
              this[SET_RESULTTXT](res.data.respDesc);
            }
          }
        })
        .finally(()=>{
          // this.inputSubmitDisabled=false;
          
          this.submitLoading=false;
        })
    },


  }
}
</script>
