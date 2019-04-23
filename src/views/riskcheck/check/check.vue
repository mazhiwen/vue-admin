<template>
<div>

  <div>
    <OneSingleCheck
      parenttype="risk" :types="types"
    />
    
  </div> 
  <br>
  
  <batch-check parenttype="risk" title="批量查询" type="riskCheckPerson"></batch-check>

  




</div>
</template>

<script>

export default {
  data () {
    return {
      types:['riskCheckPerson']
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
