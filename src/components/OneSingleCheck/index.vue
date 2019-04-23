<template>
  <div>
    <SingleCheckBase
      :types="types" :title="title"
      @onSubmit="onSubmit" :submitLoading="submitLoading"
    >
      <Row class="red" slot="result">
      
        <OneSingleCheckResult v-if="isShowResult"
          :data="resultData"
        />
      
      </Row>
    </SingleCheckBase>
  </div>
</template>

<script>
import axios from "axios"
import {commonRequest } from 'utils';
import SingleCheckBase from '../SingleCheckBase';
// import OneSingleCheckResult from '../OneSingleCheckResult';
import {mapState,mapMutations} from 'vuex';


export default {
  components:{
    SingleCheckBase,
    // OneSingleCheckResult
  },
  props: {
    types:{
      default:()=>{
        return [];
      }
    },
    parenttype:String,
  },
  computed:{
    storeConfigData() {
      return this.$store.state.configData.data;
    },
    title(){
      return `${this.storeConfigData.checkItemInfo.businessType[this.types[0]]}查询`;
    }
  },
  data () {
    return {
      isShowResult:false,
      submitLoading:false,
      resultData:{
      },
    }
  },
  created () {
    
  },
  updated(){
  },
  mounted () {
  },
  methods: {
    onSubmit(params) {
      params.type= this.types[0];
      //可以添加父级数据结构
      params.parentType= this.parenttype;
      this.isShowResult=false;
      this.submitLoading=true;
      axios.post('v1/loan_applications/single_validate',params)
        .then((res)=> {
          if(res.status === 200) {

            this.resultData={
              score:res.data
            };
            
          }
        })
        .finally(()=>{
          this.isShowResult=true;
          this.submitLoading=false;
        })
    },
  },
  watch:{

  },
}
</script>
<style lang="less" scoped>

</style>
