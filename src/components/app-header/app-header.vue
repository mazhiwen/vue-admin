<template>
  <div class="app-header">
    <router-link class="app-brand" :to="{ name: 'home' }">
      <div class="app-name"><span style="font-size:1.2rem;">管理后台</span><span style="font-size:0.7rem;"></span></div>
      
    </router-link>
    
    <div class="app-header-info">
      <slot>
      </slot>
    </div>
    <Menu class="app-menu-right" mode="horizontal" :theme="'primary'" @on-select="select">
      
      <!-- <MenuItem name="accesskey" >
        <Icon type="ios-paper"></Icon>
        AccessKey
      </MenuItem> -->
      <Submenu name="user-menu">
        <template slot="title">
          <Icon type="person"></Icon>
          {{username}}
        </template>
        <!-- <MenuItem name=""><div @click="modalStatusUserSet=true">个人设置</div></MenuItem> -->
        <MenuItem name=""><div @click="logout($router)">退出</div></MenuItem>
      </Submenu>
    </Menu>
    
    <user-setting @togglemodal="modalhide" :modalStatus="modalStatusUserSet"></user-setting>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { appName, authMobile } from 'configs';
  import { logout, storageHelper } from 'utils';
  import { menus } from 'statics/menus';
  import AppMenu from '../app-menu'; // can not import as menber from 'components';
  import AppBreadcrumb from '../app-breadcrumb';
  // import ChangePassword from '../change-password'
  import UserSetting from '../user-setting'

export default {
    data () {
      return {
        menus: menus,
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
