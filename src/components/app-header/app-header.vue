<template>
  <div class="app-header">
    <router-link class="app-brand" :to="{ name: 'home' }">
      <div class="app-name"><span style="font-size:1.2rem;" @click="fnToWebHome">天冕大数据风控实验室</span><span style="font-size:0.7rem;"></span></div>
      
    </router-link>
    <!-- <a class="app-expand-ctrl" @click="toogleSidebar" href="javascript:;">
      <Icon class="ctrl-handle midle" type="navicon"></Icon>
    </a> -->
    <div class="app-header-info">
      <slot>
        <!-- <app-breadcrumb></app-breadcrumb> -->
      </slot>
    </div>
    <Menu class="app-menu-right" mode="horizontal" :theme="'primary'" @on-select="select">
      <MenuItem name="cost" >
        <Icon type="ios-paper"></Icon>
        费用
      </MenuItem>
      
      <MenuItem name="accesskey" >
        <Icon type="ios-paper"></Icon>
        AccessKey
      </MenuItem>
      <Submenu name="user-menu">
        <template slot="title">
          <Icon type="person"></Icon>
          {{username}}
        </template>
        <MenuItem name=""><div @click="modalStatusUserSet=true">个人设置</div></MenuItem>
        <MenuItem name=""><div @click="logout($router)">退出</div></MenuItem>
      </Submenu>
    </Menu>
    
    <user-setting @togglemodal="modalhide" :modalStatus="modalStatusUserSet"></user-setting>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { appName, authMobile } from 'configs';
  import { logout, storageHelper,toWebHome } from 'utils';
  import AppMenu from '../app-menu'; // can not import as menber from 'components';
  import AppBreadcrumb from '../app-breadcrumb';
  // import ChangePassword from '../change-password'
  import UserSetting from '../user-setting'

export default {
    data () {
      return {
        appName: appName,
        username: storageHelper.getItem(authMobile),
        modalStatusUserSet:false
      }
    },
    mounted () {

    },
    components: {
      AppMenu,
      AppBreadcrumb,
      // ChangePassword
      UserSetting
    },
    methods: {
      fnToWebHome(){
        toWebHome();
      },
      modalhide: function() {
        this.modalStatusUserSet = false;
      },
      logout: logout,
      ...mapGetters([
        'sidebarOpened'
      ]),
      ...mapActions([
        'toogleSidebar'
      ]),
      select (name) {
        console.log(name);
        this.$router.push({name:name})
      }
    }
  }
</script>
