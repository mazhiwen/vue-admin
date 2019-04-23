<template>
  <div>
    <Card >
      <slot name="cardextra" slot="extra">
      
      </slot>
      
      <p slot="title" class="title">
        {{title}}
      </p>
      <div class="container">
        <Form :model="check" inline >
          
          <Tooltip 
            v-for="(value,index) in conditionList"
            max-width="200" 
            :content="intersect(conditionsProductMap[value],types)"
            :key="index"
          >
            <FormItem :label="searchKeyNameMap[value]" 
            >
              <Input v-if="value=='cnid'" 
                type="text" size="large" v-model="check[value]"  
                :maxlength="18" :placeholder="`请输入${searchKeyNameMap[value]}`"
              />
              <Select v-else-if="value=='degree'"
                size="large" v-model="check[value]"
              >
                <Option v-for="item in degreeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-else-if="value=='plateType'"
                size="large" v-model="check[value]" style="width:150px;"
              >
                <Option v-for="(value,index) in plateTypeList" :value="value.key" :key="index">{{value.value}}</Option>
              </Select>
              <Select v-else-if="value=='identificationType'"
                size="large" v-model="check[value]" style="width:150px;"
              >
                <Option :value="'id_handheld_proof'">手持身份证</Option>
              </Select>
              <Input v-else-if="value=='mobile'||value=='liaison1'||value=='liaison2'||value=='liaison3'" 
                type="text" size="large" v-model="check[value]"  
                :maxlength="11" :placeholder="`请输入${searchKeyNameMap[value]}`"
              />
              <Upload v-else-if="value=='base64Str'"
                accept="image/*" 
                action="" 
                :before-upload="beforeUpload">
                <Button size="large">上传图片</Button>
                <span v-if="file === null">未选择图片</span>
                <span v-if="file !== null">{{ file.name }}</span>
              </Upload>
              <Input v-else 
                type="text" size="large" v-model="check[value]"  
                :placeholder="`请输入${searchKeyNameMap[value]}`"
              />
              
            </FormItem>
          </Tooltip>
        </Form>
        
        <div class="tips">
          <p>【重要提示】</p>
          <p>查询需满足以下条件，否则应承担相应法律责任:</p>
          <p>1. 需经信息主体明确授权;</p>
          <p>2. 向信息主体告知查询用途与目的、可能产生的不良后果并取得其同意。</p>
        </div>
        <Row class="up-down">
          <Button 
            :loading="submitLoading" size="large" 
            type="warning" @click="submit()"
            :disabled="submitDisabled"
          >
            提交
          </Button>
          <Button :disabled="clearDisabled" size="large" 
            class="down" @click="clear()">
            清空
          </Button>
          <Button v-if="showRetry" style="margin-left:49px;" 
            size="large" type="warning"  @click="retry()"
          >
            重试
          </Button>


        </Row>

        <slot name="result" v-if="isShowResult"></slot>
        
      </div>
    </Card>
    
    
  </div>
</template>

<script>
import axios from "axios"
import {commonRequest,validator } from 'utils';
import {SHOW_CHECK_RESULT,HIDE_CHECK_RESULT,SET_RESULTTXT} from 'store/mutation-types.js'
import {mapState,mapMutations} from 'vuex';
import {plateTypeList} from 'statics/plateTypeList';
import {searchKeyNameMap} from 'configs';
 

const checkItems = {
  threeItems:['mobile','name','cnid'],
  degreeCheck:['name','cnid','degree'],
  bankcardCheck:['name','cnid','bankcardNo'],
  liaisonCheck:['mobile','liaison1','liaison2','liaison3'],
  riskCheckPerson:['mobile','name','cnid'],
  smallLimitScore:['mobile','name','cnid'],
  colligateScore:['mobile','name','cnid'],
  multiLoanScore:['mobile','name','cnid'],
  mobileNetTime:['mobile','name','cnid'],
  mobileNetStatus:['mobile','name','cnid'],
  riskReport:['mobile','name','cnid'],
  vehicleLicenseCheck:['plateNumber','plateType','owner'],
  handheldImage:['identificationType','base64Str'],
  drivingInfo:['idCard','name'],
  riskCheckLabel:['mobile','name','cnid'],
  fraudScore:['mobile','name','cnid']
}
const conditionsList=[
  'mobile','name','cnid','degree','bankcardNo','liaison1','liaison2','liaison3',
  'plateNumber','plateType','owner','base64Str','identificationType','idCard'
];

//条件对应的产品集合全部map
let conditionsProductMap={
};
let checkItemsEntries=Object.entries(checkItems);
conditionsList.map((value,index)=>{
  let pArr=[];
  checkItemsEntries.map(([indexp,valuep])=>{
    if(valuep.includes(value)){
      pArr.push(indexp);
    }
  })
  conditionsProductMap[value]=pArr;
})
const validateMsgMap={
  plateType:{
    type:'noBlank',
    msg:'请选择车牌类型'
  },
  owner:{
    type:'name',
    msg:'请输入格式正确的车辆所有人'
  },
  identificationType:{
    type:'noBlank',
    msg:'请选择识别类型'
  },
  idCard:{
    type:'cnid',
    msg:'请正确输入驾驶证'
  }
}


export default {
  props: {
    types:{
      default:()=>{
        return [];
      }
    },
    isEmpty:{
      type:Boolean,
      default:false
    },
    submitDisabled:{
      type:Boolean,
      default:false
    },
    submitLoading:{
      type:Boolean,
      default:false
    },
    title:String,
    inputSubmitDisabled:Boolean,
    clearDisabled:{
      type:Boolean,
      default:false
    },
    showRetry:{
      type:Boolean,
      default:false
    },
  },
  computed:{
    ...mapState({
      storeConfigData:state=>state.configData.data,
    }),
    conditionList () {
      let list=[];
      this.types.map((value,index)=>{
        list=list.concat(checkItems[value]);  
      })
      list=Array.from(new Set(list));
      
      // let res=[];
      // list.map((value,idnex)=>{
      //   res.push({
      //     type:value,
      //     content:this.intersect(this.conditionsProductMap[value],this.types),
      //   })
      // })
      this.$emit('onConditionlistUpdated',list);
      return list;
    },
    
  },
  data () {
    return {
      conditionsProductMap:conditionsProductMap,
      isShowResult:true,
      searchKeyNameMap:searchKeyNameMap,
      file:null,
      check: {
        liaison2:'',
        liaison3:'',
        identificationType:'id_handheld_proof',
        
         
      },
      
      degreeList:[{
        value:'5',
        label:'大专'
      },{
        value:'6',
        label:'本科'
      },{
        value:'7',
        label:'硕士'
      },{
        value:'8',
        label:'博士'
      },{
        value:'10',
        label:'高中及以下'
        },
      ],
      plateTypeList:[],
    }
  },
  created () {

    
  },
  updated(){
    
  },
  mounted () {
    Promise.all([
      // commonRequest.getProductTree(),
    ])
      .then((resAll)=>{

      })
    console.log(plateTypeList);  
    this.plateTypeList=plateTypeList;
    this[HIDE_CHECK_RESULT]();
    this[SET_RESULTTXT]('');
    
  },
  methods: {
    ...mapMutations([
      SHOW_CHECK_RESULT,
      HIDE_CHECK_RESULT,
      SET_RESULTTXT 
    ]),
    //交集
    intersect(a,b){
      let 
        set1 = new Set(a),
        set2 = new Set(b);
      let resArr=[...new Set([...set1].filter( x => set2.has(x)))];
      
      let resText=[];
      resArr.map((value,index)=>{
        resText.push(this.storeConfigData.checkItemInfo.businessType[value]);
      })
      
      return resText.join();
    },
    beforeUpload(file) {
      // this[HIDE_CHECK_RESULT]();
      
      this.check['base64Str']='';
      if(file.size>4*1024*1024){
        this.$Notice.warning({
          title:'错误',
          desc:'图片大小不可超过4MB'
        });    
        return false;
      }
      if(!/.\.(gif|jpeg|png|jpg|bmp|svg|DIB|JPE|PBM|PGM|PPM|SR|RAS|TIFF|TIF|EXR|jp2)/i.test(file.name)){
        this.$Notice.warning({
          title:'错误',
          desc:'文件类型需要是图片'
        });
        return false;
      }
      this.file = file;
      let r = new FileReader();
      r.onload = ()=>{
        
        this.check['base64Str'] = r.result.split(';base64,')[1];
      };
      r.readAsDataURL(file);
      
      
      return false
    },
    submit() {
      
      let validateParams=[];
      let params = {};
      
      for(let item of this.conditionList) {
        validateParams.push({
          type:item,
          ...validateMsgMap[item],
          value:this.check[item]
        });
        
        params[item]=this.check[item];
        
      }
      validator.validate({isEmpty:this.isEmpty,params:validateParams})
        .then((valid)=>{
          if(valid){
            console.log(params);
            this.isShowResult=true;
            this.$emit('onSubmit',params);
            
          }
        })
    },
    clear() {
      for(let key in this.check) {
        this.check[key] = ''
      }
      this.file=null;
      // this[HIDE_CHECK_RESULT]();
      // this[SET_RESULTTXT]('');
      this.isShowResult=false;
      this.$emit('onClear');
    },
    retry() {
      this[HIDE_CHECK_RESULT]();
      this[SET_RESULTTXT]('');
      this.$emit('onRetry');
    }
  },
  components: {

  },
  directives: {

  },
  filters: {

  },
  watch:{
  },
}
</script>
<style lang="less" scoped>
.container{
  // padding:30px;
  color: #666;
  .information{
    margin-top:16px;
    
  }
  .tips{
    margin-top:36px;
  }
  .select-btn{
    background-color:#fff;
    padding:10px 22px;
    color:#FF7C23;
    font-size: 14px;
    border: 1px solid #FF7C23;
  }
  
  button.down{
    margin-left:49px;
  }
  .label{
    margin-right:22px;
    
    display: inline-block;
    text-align: left;
  }
  .red{
    color:red;
    font-size:30px;
  }
  .input{
    width:192px;
    height:40px;
  }
}
</style>
