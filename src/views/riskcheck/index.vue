<template>
  
  <router-view v-if="$route.name!=='riskcheck'"></router-view>
  <div v-else>todo...</div>
  
</template>
<script>
  export default {
    data() {
      return {
      }
    },
    methods: {

    }
  }
</script>

