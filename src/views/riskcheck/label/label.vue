<template>
<div>

  <div>
    <OneSingleCheck
      parenttype="risk" :types="['riskCheckLabel']"
    />
  </div> 
  <br>
  <batch-check parenttype="risk" title="批量查询" type="riskCheckLabel"></batch-check>

  




</div>
</template>

<script>

export default {
  data () {
    return {
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
