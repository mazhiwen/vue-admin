<template>
<div>

  <Tabs type="card" v-model="activeTabpane"
    closable @on-tab-remove="handleTabRemove"
  >
    <TabPane :closable="false" label="查询记录" >
      <RecordsList @onIdClick="onIdClick">
      </RecordsList>
    </TabPane>
    <TabPane 
      v-for="(value,index) in customResultList" :key="index"
      :label="value.toString()" 
    >
      <RecordDetail :id="value"
        @onRefresh="onRefresh"
      />
    </TabPane>
  </Tabs>
  


</div>
</template>

<script>
import RecordsList from './recordsList.vue';
import RecordDetail from './RecordDetail.vue';
import {commonRequest ,paramsFormat,exportData} from 'utils';

export default {
  data () {
    return {
      tabs: 2,
      customResultList:[],
      activeTabpane:0
    }
  },
  computed:{


  },
  mounted () {
    this.type=[1,2];
  },
  components:{
    RecordsList,
    RecordDetail
  },
  methods: {
    onRefresh(params){
      this.$Modal.confirm({
        title: '提示',
        content: '确定再次提交请求?',
        onOk: () => {
          commonRequest.verifyModelToGenerateReport(params)
            .then((res)=> {
              this.$Notice.success({
                title:'提示',
                desc:"操作成功"
              })
              this.onIdClick(res.data.callId);
              
            })
            .finally(()=>{
              
            })
        },
        onCancel: () => {}
      })
    },
    onIdClick(id){
      let index=this.customResultList.indexOf(id);
      if(index<0){
        this.customResultList.push(id);
        this.activeTabpane=this.customResultList.length;
      }else{
        this.activeTabpane=index+1;
      }
      
    },
    handleTabRemove (name) {
      let index=this.customResultList.indexOf(name);
      this.customResultList.splice(index,1);
    }
  }
}
</script>
