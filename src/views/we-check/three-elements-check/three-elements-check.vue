<template>
  <div>
    <div >
      <OneSingleCheck
        parenttype="validate" :types="['threeItems']"
      />
    </div>
    <br/> 
    <batch-check parenttype="validate" title="批量查询" type="threeItems"></batch-check>
  </div>
</template>

<script>
export default {
 data () {
   return {

   }
 },
 created () {

 },
 components: {
   
 },
 directives: {

 },
 filters: {

 }
}
</script>
