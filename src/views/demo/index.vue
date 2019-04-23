<template>
  <div class="app">
    <app-header></app-header>
    <app-view>
      <app-sidebar>
        <app-menu class="app-menu" mode="vertical" theme="light" ></app-menu>
      </app-sidebar>
      <app-content>
        <router-view v-if="$route.name!=='demo'"></router-view>
        <div v-else>todo...</div>
      </app-content>
    </app-view>
  </div>
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
