<template>
<div>
  <CustomRsult
     :data="customResultData" :types="types" 
     @onRefresh="onRefresh"
  />
</div>
</template>

<script>
import axios from "axios"

export default {
  props:{
    id:{
      type:String
    },
  },
  data () {
    return {
      customResultData:{
        inputInfo:{},
        baseInfo:{}
      },
      types:[],
    }
  },
  computed:{


  },
  created(){
    axios.get(`v1/model/getApplication/${this.id}`,{
    })
      .then((res)=> {
        // this.types=
        let data= res.data;
        let types=[];
        Object.entries(data.resultMaps).map(([index,value])=>{
          types.push(index);
        })
        this.types=types;
        this.customResultData=res.data;
      })
      .finally(()=>{
        
      })
  },
  mounted () {
  },
  components:{
  },
  methods: {
    onRefresh(data){
      this.$emit('onRefresh',{
        modelId:this.customResultData.modelId,
        verifyParams:this.customResultData.inputInfo,
        conditionList:this.customResultData.conditionList
      });
    }

  }
}
</script>