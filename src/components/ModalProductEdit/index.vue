<template>
  <Modal :value="modalVisible" width="360" :closable="false"
    @on-visible-change="modalChange"
  >
    <h2 slot="header" style="">
      选择产品
    </h2>
    <div style="">
      <Checkbox :value="keyAuthCheckAll" 
        @click.prevent.native="keyAuthCheckAllHandler"
      >
        全选
      </Checkbox>
      <CheckboxGroup v-model="productCheck">
        <template 
          v-for="(value,index) in productTree" 
        >
          <label style="display:block;margin-top:10px;">{{value.name}}:</label>
          <Checkbox 
            v-for="(valuec,indexc) in value.children" :key="indexc" 
            :label="valuec.id" :disabled="!valuec.isBought"
          >
            {{valuec.name}}
          </Checkbox>
        </template>
        
      </CheckboxGroup>
    </div>
    <div slot="footer" class="editbottom">
      <Button  
        @click="$emit('closeModal')" 
      >
        取消
      </Button>
      <Button
        :loading="loading" @click="updateProductRequest"
      >
        确定
      </Button>
    </div>
  </Modal>
</template>
<script>
import {commonRequest ,copy} from 'utils';
import axios from 'axios';

export default {
  props:{
    visible:{
      type:Boolean,
      default:false
    },
    modalID:String,
    initCheckArr:{
      type:Array,
      default:()=>{
        return [];
      }
    }

  },
  data() {
    return {
      keyAuthCheckAll:false,
      productTree:{},
      productBoughtListLen:0,
      productBoughtList:[],
      productCheck:[],
      loading:false,
    }
  },
  computed:{
    modalVisible:{
      get:function(){
        return this.visible;
      },
      set:function(){
      }
    },
  },
  watch:{
    initCheckArr:function(newValue,oldValule){
      let res=newValue.filter((value,index)=>{
        return this.productBoughtList.includes(value)
      })
      this.productCheck=res;
    },
    productCheck:function(newV,old){
      if(newV.length!=this.productBoughtListLen){
        this.keyAuthCheckAll=false;
      }else{
        this.keyAuthCheckAll=true;
      }
    }
  },
  mounted(){
    commonRequest.getProductTree().then((res)=>{
      this.productTree=res.productTree;
      let productIsBoughtMap=res.productIsBoughtMap;
      let productBoughtList=[];
      Object.entries(productIsBoughtMap).map(([index,value])=>{
        value&&productBoughtList.push(index);
      });
      this.productBoughtList=productBoughtList;
      this.productBoughtListLen=productBoughtList.length;
    });
  },
  methods: {
    modalChange(status){
      if(!status){
        this.cancelEdit();
        this.$emit('closeModal');

      }

    },
    cancelEdit(){
      this.initData();
    },
    initData(){
      // this.userEditForm={
      //   name:this.name,
      //   mobile:this.phone,
      //   oldPassword: '',
      //   newPasswordConfirm:'',
      //   newPassword:'',
      //   mail:'',
      //   otp:'',
      //   newPhone:''

      // };
    },
    keyAuthCheckAllHandler(){      
      this.keyAuthCheckAll=!this.keyAuthCheckAll;
      if(this.keyAuthCheckAll){
          this.productCheck= this.productBoughtList;     
      }else{
          this.productCheck=[];
      }
    },
    saveProductHandler(){
      // this.loading=true;
      // let resArr=this.productCheck;
      this.updateProductRequest({
        indexModal:this.indexModal,
        resArr:this.productCheck
      });

    },
    updateProductRequest(){
      commonRequest.updateModelProduct({
        modalID:this.modalID,
        resArr:this.productCheck
      }).then((res)=>{
        this.$Notice.success({
          title: '提示',
          desc:'产品编辑成功'
        });
        this.$emit('onOkCallBack',res);
      })
    },
  }
}
</script>
