
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
      parenttype:'ai',
      types:['handheldImage'],
      params:{

      },
      submitLoading:false,
      isShowResult:false,
      inputSubmitDisabled:false,

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
      axios.post(`v1/applicationImage/single_validate/ai/handheldImage`,params)
        .then((res)=> {
          if(res.status === 200) {

            this.isShowResult=true;
            console.log(res.data);
            this.resultData={
              score:res.data
            };
            // if(res.data.respCode=='s00') {
              
              
            //   this.resultData=res.data;
            // }else {
            //   this.resultData=res.data.respDesc;
            // }
          }
        })
        .finally(()=>{
          
          this.submitLoading=false;
        })
    },
  }
}
</script>
