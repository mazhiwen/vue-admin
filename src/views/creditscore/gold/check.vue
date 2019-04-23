<template>
<div>

  <div >
    <OneSingleCheck
      parenttype="creditscore" :types="['smallLimitScore']"
    />
  </div> 
  <br>
  
  <batch-check parenttype="creditscore" title="批量查询" type="smallLimitScore"></batch-check>

  




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


  }
}
</script>
