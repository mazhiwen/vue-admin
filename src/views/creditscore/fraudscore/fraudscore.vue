<template>
<div>

  <div >
    <OneSingleCheck
      parenttype="creditscore" :types="['fraudScore']"
    />
  </div> 
  <br/>
  <batch-check parenttype="creditscore" title="批量查询" type="fraudScore"></batch-check>

  




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
