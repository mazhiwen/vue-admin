<template>
<div class="page_consoles_summary">
  
  <draggable
    animation="350"
    ghost-class="ghost"
    draggable=".draggable_item"
    @end="dragModalEnd()"
    v-model="activeList"
    class="draggablewrap"
  >

      <div  
        v-for="(value,indexModal) in activeList"
        :key="indexModal"
        class="list-group-item draggable_item "
      >
        <Card 
          class="dragbox_wrap"
        >
          <div class="dragbox_title" slot="title">
            <Input 
              style="width:170px"
              v-model="value.name" :readonly="value.dragboxtitleOnlyRead"
              :class="{'dragbox_title_read':value.dragboxtitleOnlyRead}"
              @on-change="dragboxtitleChange(indexModal)"
              :maxlength="8"
            >
              <div class="title_okcancelwrap" slot="suffix">
                <Icon type="md-checkmark" size="20" color="green" 
                  @click="dragboxtitleSave(indexModal)" 
                  v-if="value.dragboxtitleStatus=='changed'"
                />
                <Icon type="md-close" size="20" color="red"
                  @click="dragboxtitleCancel(indexModal)"
                   v-if="value.dragboxtitleStatus=='changed'||value.dragboxtitleStatus=='editing'"
                />
              </div>
              <template v-if="value.dragboxtitleStatus=='default'" slot="suffix">
                <Icon type="md-create"   @click="dragboxtitleActive(indexModal)"/>
              </template>
              <template v-if="value.dragboxtitleStatus=='saving'" slot="suffix">
                <Button loading shape="circle" type="text"></Button>
              </template>
            </input>
          </div>
          <Icon 
            slot="extra" type="ios-information-circle-outline" 
            size="27" @click="openModalInfo({indexModal,isRemove:false})"
          />
          <draggable
            :list="value.modelItems"
            animation="350"
            ghost-class="ghost"
            @end="dragProductEnd(indexModal)"
            class="dragtag_wrap"
          >
            <Tag 
              v-for="(valuet,indexProduct) in value.modelItems" 
              :key="indexProduct"  
              v-bind="{color:productIsBoughtMap[valuet.checkItemId]?'success':'default'}"
              :name="indexProduct" closable 
              @on-close="deleteProduct(indexModal,indexProduct)"
            >
              {{ productMap[valuet.checkItemId]}}
            </Tag>
            <Button icon="ios-add" type="dashed" 
                @click="handleAddProduct(indexModal)"
            >
              编辑产品
            </Button>
          </draggable>
          
          <div 
            style="display:flex;justify-content: space-between;margin-top: 30px;"
          >
            <div><span>今日次数 {{value.modelCallNumInfo&&value.modelCallNumInfo.dayNum}} 次</span></div>
            <div><span>本月次数 {{value.modelCallNumInfo&&value.modelCallNumInfo.monthNum}} 次</span></div>
          </div>
        </Card>
      </div>
    
    <div span="12" key="add"
      slot="footer"
      
    >
      <Card
        style="
          margin:10px 5px;text-align: center;
          padding: 50px 0;border-style: dashed;border-width:3px;
        "
      >
        <Icon
          @click="addModalHandler" 
          type="md-add" size="52" style="color: #3399ff"
        >
        </Icon>
        <p>点击添加模块</p>
      </Card>
    </div>
  </draggable>
  
  <Divider orientation="left">回收站</Divider>
  <Row 
    :gutter="16"
  >
    <Col span="12" class="list-group-item"
      v-for="(value,indexModal) in hideList"
      :key="indexModal"
    >
      <Card
        class="dragbox_wrap" :title="value.name"
      >
        <Icon slot="extra" type="ios-information-circle-outline" size="27"
          @click="openModalInfo({indexModal,isRemove:true})"
        />
        <div class="dragtag_wrap">
        <Tag 
          v-for="(valuet,indexProduct) in value.modelItems" 
          :key="indexProduct" 
        >
          {{ productMap[valuet.checkItemId]}}
        </Tag>
        </div>
        <div 
          style="display:flex;justify-content: space-between;margin-top: 30px;"
        >
          <div><span>今日次数 {{value.modelCallNumInfo&&value.modelCallNumInfo.dayNum}} 次</span></div>
          <div><span>本月次数 {{value.modelCallNumInfo&&value.modelCallNumInfo.monthNum}} 次</span></div>
        </div>
      </Card>
    </Col>
  </Row>
  <ModalProductEdit
    :visible="modalProductEdit"
    @closeModal="modalProductEdit=false;"
    :modalID="currentModalID"
    :initCheckArr="productCheck"
    @onOkCallBack="updateProductCall"
  />
  <Modal v-model="isModalInfoShow" width="360" 
    title="详细信息"
  >
    <div class="infomodal_wrap">
      <p><strong>ID:</strong><span>{{modalInfoData.id}}</span></p>
      <p><strong>名称:</strong><span>{{modalInfoData.name}}</span></p>
      <p><strong>创建时间:</strong><span>{{modalInfoData.createAt}}</span></p>
      <p><strong>最后更新:</strong><span>{{modalInfoData.updateAt}}</span></p>
      <p v-if="modalInfoData.hideFlag"><strong>废弃时间:</strong><span>{{modalInfoData.hideAt}}</span></p>
      <p><strong>单价:</strong><span>{{modalInfoData.maxUnitCostAmount}}</span></p>
      <p><strong>今日费用:</strong><span>{{modalInfoData.modelCallAmountInfo&&modalInfoData.modelCallAmountInfo.dayAmount}}</span></p>
      <p><strong>本月费用:</strong><span>{{modalInfoData.modelCallAmountInfo&&modalInfoData.modelCallAmountInfo.monthAmont}}</span></p>
    </div>
    <div slot="footer" class="editbottom">
      
      <template v-if="modalInfoData.hideFlag">
        <Button 
          :loading="modal_loading" @click="activeModalHandler(modalInfoData)"
        >
          启用
        </Button>
        <Button 
          :loading="modal_loading" @click="deleteModalHandler(modalInfoData)"
        >
          删除
        </Button>
      </template>
      <Button v-else
        :loading="modal_loading" @click="removeModalHandler(modalInfoData)"
      >
        废弃
      </Button>
    </div>
  </Modal>
</div>
</template>

<script>
          
import draggable from "vuedraggable";
import {
  commonRequest ,copy,updateConsoleMenus
} from 'utils';
import {
  SetMenus
} from 'store/mutation-types.js'
import {mapState,mapMutations} from 'vuex';

import axios from 'axios';
import { menusOrigin } from 'statics/menus';

 

export default {
  components:{
    draggable
  },
  data () {
    return{
      currentModalID:'',
      originModalName:'',
      modalProductEdit:false,
      isModalInfoShow:false,
      productTree:{},
      productMap:{},
      productIsBoughtMap:{},
      keyAuthCheckAll:false,
      productCheck:[],
      modalEdit:false,
      modal_loading:false,
      // modalInfoDataIndex:null,
      productBoughtListLen:0,
      productBoughtList:[],
      activeList: [],
      hideList:[],
      tagList: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ],
      enabled: true,
      dragging: false,
      title:'基本评估',
      currentModalIndex:null,
      modalInfoData:{
        modelCallAmountInfo:{}
      }
    }
  },
  computed:{
    ...mapState({
      storeConfigData:state=>state.configData.data,
    }),
  },
  watch:{
    productCheck:function(newV,old){
      if(newV.length!=this.productBoughtListLen){
        this.keyAuthCheckAll=false;
      }else{
        this.keyAuthCheckAll=true;
      }
    }
  },
  mounted () {

    commonRequest.getProductTree().then((res)=>{
      this.productTree=res.productTree;
      this.productIsBoughtMap=res.productIsBoughtMap;
      this.productMap=res.productMap;
      let productBoughtList=[];
      Object.entries(this.productIsBoughtMap).map(([index,value])=>{
        value&&productBoughtList.push(index);
      });
      this.productBoughtList=productBoughtList;
      this.productBoughtListLen=productBoughtList.length;
    });
    this.getModelList();

  },
  methods: {
    ...mapMutations([
      SetMenus 
    ]),
    openModalInfo({indexModal,isRemove}){
      this.currentModalIndex=indexModal;
      let id;
      if(isRemove){
        id=this.hideList[indexModal].id;
      }else{id
        id=this.activeList[indexModal].id;
      }
      axios.get(`v1/model/getModelDetail/${id}`,{})
        .then((res)=>{
          this.modalInfoData=res.data;
          this.isModalInfoShow=true;
        })
    },
    getModelList(){
      axios.get('v1/model/listModel',{})
        .then((res)=>{
          let data=res.data;
          let activeList=[];
          let hideList=[];
          // data=[
          //   { 
          //     name: "模块1", 
          //     id: 0 ,
          //     orderNo:1,
          //     hideFlag:false,
          //     modelItems:[
          //       {
          //         itemId:'1111',
          //         checkItemId:'1',
          //         orderNo:'1'
          //       },
          //       {
          //         itemId:'22',
          //         checkItemId:'2',
          //         orderNo:'2'
          //       },
          //       {
          //         itemId:'33',
          //         checkItemId:'3',
          //         orderNo:'3'
          //       }
          //     ],
          //     modelCallNumInfo:{},
          //     modelCallAmountInfo:{},
          //     dragboxtitleOnlyRead:true,
          //     dragboxtitleStatus:'default',  
          //   },
          // ];
          data.sort((va,vb)=>{
            return va.orderNo-vb.orderNo;
          })
          .map((value,index)=>{
            if(value.hideFlag){
              hideList.push(value);
            }else{
              activeList.push({
                ...value,
                dragboxtitleOnlyRead:true,
                dragboxtitleStatus:'default',
              });
            }
          })
          this.hideList=hideList;
          this.activeList=activeList;
        })
    },
    activeModalHandler(modalData){
      axios.post('v1/model/updateModel',{
        id:modalData.id,
        hideFlag:false,
        orderNo:this.activeList.length
      })
        .then((res)=>{
          this.isModalInfoShow=false; 
          modalData=this.hideList.splice(this.currentModalIndex,1)[0];
          // modalData=res.data;
          modalData.dragboxtitleOnlyRead=true;
          modalData.dragboxtitleStatus='default';
          console.log(modalData);
          this.activeList.push(modalData);
          this.refreshAll(this.activeList);
           
        })
    },
    removeModalHandler(modalData){
      axios.post('v1/model/updateModel',{
        id:modalData.id,
        hideFlag:true
      })
        .then((res)=>{
          this.isModalInfoShow=false; 
          modalData=this.activeList.splice(this.currentModalIndex,1)[0];
          modalData.hideFlag=true;
          this.hideList.push(modalData); 
          this.sortRequest(this.currentModalIndex);
        })
    },
    deleteModalHandler(modalData){
      axios.post('v1/model/updateModel',{
        id:modalData.id,
        delFlag:true
      })
        .then((res)=>{
          this.isModalInfoShow=false; 
          this.hideList.splice(this.currentModalIndex,1);
          
        })
    },
    // 更新全部模块，并渲染菜单
    refreshAll(modelMenu){
      this.renderNewMenu(updateConsoleMenus(modelMenu));
    },
    // 渲染菜单
    renderNewMenu(newMenus){
      this[SetMenus](newMenus);
    },
    dragModalEnd(){
      
      this.sortRequest(0);
      
    },
    sortRequest(indexModal){
      let data=[];
      let dataList=this.activeList.slice(indexModal);
      // 拖动后的新排序为 activeList
      dataList.map((value,indexd)=>{
        data.push({
          id:value.id,
          orderNo:indexModal++,
          name:value.name
        })
      })
      axios.post('v1/model/sortModels',data)
        .then((res)=>{
          // 如果后端更新成功
          // this.refreshAll(data);
          this.refreshAll(this.activeList);
        })
    },
    addModalHandler(){
      let orderNo = this.activeList.length;
      let newModalData = {
        name: `模块${orderNo+1}`, 
        orderNo,
        modelItems:[
          {
            orderNo:0,
            checkItemId:'1'
          },
          {
            orderNo:1,
            checkItemId:'10'
          },
          {
            orderNo:2,
            checkItemId:'9'
          }
        ]
      }
      axios.post('v1/model/addModel',newModalData)
        .then((res)=>{
          newModalData=res.data;
          newModalData.dragboxtitleOnlyRead=true;
          newModalData.dragboxtitleStatus='default';
          this.activeList.push(newModalData);
          this.refreshAll(this.activeList);
          this.$Notice.success({
            title: '提示',
            desc:'操作成功'
          });
        })
      
    },
    updateProductCall(data){
      data.map((value,index)=>{
        value.itemId=value.id;
      })
      console.log(data);
      this.activeList[this.currentModalIndex].modelItems = data||[];
      this.modalProductEdit=false;
    },
    dragProductEnd(indexModal){
      let resArr=[];
      this.activeList[indexModal].modelItems.map((value,index)=>{
        resArr.push(value.checkItemId);
      })
      commonRequest.updateModelProduct({
          modalID:this.activeList[indexModal].id,
          resArr
        }).then((res)=>{
          let modelItems=this.activeList[indexModal].modelItems;
          res.map((value,index)=>{
            modelItems[value.orderNo].itemId=value.id;
          })
          this.$Notice.success({
            title: '提示',
            desc:'产品编辑成功'
          });
        })
    },
    saveHandler(){

    },
    keyAuthCheckAllHandler(){      
      this.keyAuthCheckAll=!this.keyAuthCheckAll;
      if(this.keyAuthCheckAll){
          this.productCheck= this.productBoughtList;     
      }else{
          this.productCheck=[];
      }
    },
    dragboxtitleActive(indexModal){
      console.log(indexModal);
      this.activeList[indexModal]
      this.originModalName = this.activeList[indexModal].name;
      this.activeList[indexModal].dragboxtitleOnlyRead=false;
      this.activeList[indexModal].dragboxtitleStatus='editing';
    },
    dragboxtitleChange(index){
      this.currentModalIndex=index;
      this.activeList[this.currentModalIndex].dragboxtitleStatus='changed';
    },
    dragboxtitleSave(indexModal){
      if(this.activeList[indexModal].name){
        this.activeList[indexModal].dragboxtitleStatus='saving';
        axios.post('v1/model/updateModel',{
          id:this.activeList[indexModal].id,
          name:this.activeList[indexModal].name
        })
          .then((res)=>{
            this.$Notice.success({
              title: '提示',
              desc:'操作成功'
            });
            this.activeList[indexModal].dragboxtitleStatus='default';
            this.activeList[indexModal].dragboxtitleOnlyRead=true;
            this.refreshAll(this.activeList);
          })
      }else{
        this.$Notice.warning({
          title: '提示',
          desc:'请输入名称'
        });
      }
      
      
    },
    dragboxtitleCancel(indexModal){
      this.activeList[indexModal].name = this.originModalName ;
      this.activeList[indexModal].dragboxtitleStatus='default';
      this.activeList[indexModal].dragboxtitleOnlyRead=true;
    },
    handleAddProduct (indexModal) {
      this.currentModalIndex=indexModal;
      this.currentModalID=this.activeList[indexModal].id;
      console.log(indexModal);
      let productCheck=[];
      console.log(this.activeList[indexModal]);
      this.activeList[indexModal].modelItems.map((value,index)=>{
        // if(this.productIsBoughtMap[value.checkItemId]){
          productCheck.push(value.checkItemId);
        // };
    
      });
      console.log(this.productCheck);
      this.productCheck=productCheck;
      this.modalProductEdit=true;
    },
    deleteProduct (indexModal,indexProduct) {
      let itemId=this.activeList[indexModal].modelItems[indexProduct].itemId;
      axios.post(`v1/model/deleteModelItem/${itemId}`,{
        
      })
        .then((res)=>{
          this.$Notice.success({
            title: '提示',
            desc:'操作成功'
          });
          this.activeList[indexModal].modelItems.splice(indexProduct, 1);
        })
    }
  }
}
</script>
<style type="less">


</style>
