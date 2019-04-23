<template>
  
  <router-view 
    :key="$route.name + ($route.params.id || '')" v-if="$route.name!=='consoles'">
  </router-view>
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
