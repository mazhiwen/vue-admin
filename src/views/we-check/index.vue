<template>
  
  <router-view v-if="$route.name!=='we-check'"></router-view>
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

