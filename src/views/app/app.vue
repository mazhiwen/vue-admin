<template>
  
  <Login v-if="$route.name=='login'"/>
  
  <MainLayout v-else-if="$route.name&&$route.name!='login'">
    <router-view></router-view>
  </MainLayout>

  <!--<component :is="$route.name=='login'?login:mainLayout"></component>-->
</template>
<script>
// import Login from 'views/login';


const mainLayout={
  template:`
    <MainLayout>
      <router-view></router-view>
    </MainLayout>
  `
}
const login={
  template:`
    <Login/>
  `
}
export default {
  data () {
    return {
      mainLayout,
      login
    };
  },
  components:{
    // Login,
    // MainLayoutRouter
  },
  beforeCreate(){
  
  },
  mounted () {
  },
  beforeDestroy () {

  },
  methods: {

  }
}
</script>
