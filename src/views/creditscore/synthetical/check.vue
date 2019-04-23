<template>
<div>

  <div >
    <OneSingleCheck
      parenttype="creditscore" :types="['colligateScore']"
    />
  </div> 
  <br>
  
  <batch-check parenttype="creditscore" title="批量查询" type="colligateScore"></batch-check>

  




</div>
</template>

<script>
import {Button} from 'iview';
import axios from 'axios';
import { exportData } from 'utils'

export default {
  data () {
    return {
      search:{
        params:{
          parentType:"risk",
          type:'riskCheckPerson'
        },
        message:''
      },
      batch:{
        files:[]
      }
    }
  },
  mounted () {

  },
  components:{
  },
  methods: {
    openEditCharge(){
    },
    beforeUpload(file){
      // this.batch.files.push(file);
      this.batch.files=file;
      console.log(file);
      return false;
    },
    upload(){
      console.log(this.batch.files);
      let fFormDate=new FormData();
      fFormDate.append('file',this.batch.files);
      axios.post('v1/loan_applications/upload_validate/risk/riskCheckPerson',
        fFormDate,
        {
          headers:{'Content-Type':'multipart/form-data'},
          onUploadProgress: function (progressEvent) {
            // 对原生进度事件的处理
            console.log(progressEvent)
          },
        })

    },
    searchHandler(){
      axios.post('v1/loan_applications/single_validate',this.search.params)
        .then(res=>{
          this.search.message=res['message'];
        })
        
    },
    downTemple(){
      exportData({ type: 'riskCheckPerson' }, 'v1/loan_applications/exportVerifyTemplate')
    }
  }
}
</script>
