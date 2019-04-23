<template>
  <Menu class="app-menu" 
    :open-names="opened" :mode="mode" :theme="theme" 
    
    @on-select="select"
  >
    <template  v-for="(item,index) in menus" >
      
      <Submenu v-if="item.children && item.children.length" :name="item.name" :key="index">
        <template slot="title">
          <Icon v-if="item.icon"  :type="item.icon"></Icon>
          <Icon v-else  type="ios-albums-outline"></Icon>
          {{item.label}}
        </template>
        <MenuItem v-for="(child,indexc) in item.children" :key="indexc" :name="child.name">
            <Icon type="ios-circle-outline"></Icon>
            {{child.label}}
        </MenuItem>
      </Submenu>
      <MenuItem v-if="!item.children" :name="item.name" :key="index">
        <Icon v-if="item.icon"  :type="item.icon"></Icon>
        <Icon v-else  type="ios-albums-outline"></Icon>
        {{item.label}}
      </MenuItem>

    </template>
  </Menu>
</template>

<script>

import { Menu } from 'iview';
import axios from 'axios';
import { 
  storageHelper ,copy,updateConsoleMenus,commonRequest
} from 'utils';
import {mapState,mapMutations} from 'vuex';
import {
  SetMenus,SetConfigData
} from 'store/mutation-types.js';
import { menusOrigin } from 'statics/menus';

export default {
  data () {
    return {
      opened:[]
    }
  },
  computed:{
    ...mapState({
      menus:state=>state.menus.menus,
    }),

  },
  created () {
    this.getCustomMenu();
  },
  mounted(){
    Promise.all([
      commonRequest.getCheckItemObj(), 


    ])
    .then((values)=> {
      console.log(values);
      this[SetConfigData]({
        checkItemInfo:values[0],
        
      });
    });
  },
  props: {
    mode: String,
    theme: String,
  },
  methods: {
    ...mapMutations([
      SetMenus,
      SetConfigData 
    ]),
    getCustomMenu(){
      axios.get('v1/model/hashApiAuth')
        .then((res)=>{
          
          if(res.data){
            axios.get('v1/model/listModelMenu')
              .then((resm)=>{
                let modelMenu=resm.data;
                this[SetMenus](updateConsoleMenus(modelMenu));
              })
            
          }else{
            this[SetMenus](menusOrigin);
          }

        })
    },
    select (name) {
      
      if(name.includes('_')){
        let arr=name.split('_');
        this.$router.push({
          name:arr[0],
          params:{
            id:arr[1]
          }
        })
      }else{
        this.$router.push({name:name})
      }
      
    },
    initOpened () {
      
    }
  }
}
</script>
