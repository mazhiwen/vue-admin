<template>
  <div>
    <Modal
      v-model="modalStatusCom"
      title="个人设置"
      @on-visible-change="modalChange"
    >
      <div class="mainprofile" v-if="!activeItem">
        <div>
          <span>名称</span>
          <Button type="ghost" ><span class="profilelabel">{{name}}</span> </Button>
        </div>
        <div>
          <span>手机</span>
          <Button type="ghost" ><span class="profilelabel">{{phone}}</span> </Button>
        </div>
        <div>
          <span>邮箱</span>
          <Button type="ghost" ><span class="profilelabel">{{mail}}</span> </Button>
        </div>
        <div>
          <span>密码</span>
          <Button type="ghost" @click="activeEdit('password')"><span class="profilelabel">{{passWord}}</span> <Icon type="chevron-right"></Icon></Button>
        </div>
      </div>
      <Form ref="userEditForm" v-if="activeItem" :model="userEditForm" :rules="changeValidate" label-position="right" :label-width="112">
        
        <FormItem label="名称" prop="name" v-if="activeItem=='name'">
          <Input icon="close-circled" @on-click="userEditForm.name=''" v-model="userEditForm.name" placeholder=""></Input>
        </FormItem>
        <FormItem label="新手机" prop="newPhone" v-if="activeItem=='phone'">
          <Input icon="close-circled" @on-click="userEditForm.newPhone=''" v-model="userEditForm.newPhone" placeholder=""></Input>
        </FormItem>
        <FormItem label="邮箱" prop="mail" v-if="activeItem=='email'">
          <Input icon="close-circled" @on-click="userEditForm.mail=''" v-model="userEditForm.mail" placeholder=""></Input>
        </FormItem>
        <template v-if="activeItem=='password'">
          <FormItem label="密码" prop="oldPassword">
            <Input type="password" icon="close-circled" @on-click="userEditForm.oldPassword=''" v-model="userEditForm.oldPassword" placeholder=""></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPassword">
            <Input type="password" v-model="userEditForm.newPassword" placeholder=""></Input>
          </FormItem>
          <FormItem label="确认新密码" prop="newPasswordConfirm">
            <Input type="password" v-model="userEditForm.newPasswordConfirm" placeholder=""></Input>
          </FormItem>
        </template>
        <FormItem  :label="activeItem=='phone'?'旧手机':'手机'"  prop="mobile">
          <Input v-model="showMobile" readonly>
            <div slot="append">
              <Button style="cursor:pointer;width: 100px;text-align:center;overflow:hidden;" :loading="optLoading" @click="getVerificationCode">
                <span v-if="!optLoading">获取验证码</span>
                <span v-else>{{optCount}}</span>
              </Button>
            </div>
          </Input>
        </FormItem>
        <FormItem label="输入验证码" prop="otp">
          <Input v-model="userEditForm.otp"></Input>
        </FormItem>
      </Form>
      <Alert v-show="error" type="error" class="error">{{error}}</Alert>

      <div slot="footer" class="modalfooter">
        <template v-if="activeItem">
          <Button type="ghost" @click="cancelEdit">取消</Button>
          <Button type="ghost" @click="submit" :loading="submitLoading">确定修改</Button>
        </template>
        
      </div>

    </Modal>

    
    
  </div>
</template>
<script>
import axios from 'axios';
import { authMobile,userPassword } from 'configs';
import {  storageHelper } from 'utils';


export default {
  props: {
    modalStatus: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    modalStatusCom:{
      get:function(){
        return this.modalStatus;
      },
      set:function(){
      }
    },
    showMobile:{
      get:function(){
        let num=this.userEditForm.mobile;
        return num.slice(0,3)+'****'+num.slice(7);
      }
    }

  },
  data () {
    const newPasswordValidator = (rule, value, callback) =>{
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.userEditForm.newPassword !== '') {
          this.$refs.userEditForm.validateField('newPasswordConfirm');
        }
        callback();
      }
    };
    const newPwdconVal = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.userEditForm.newPassword) {
        callback(new Error('输入内容与新密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userEditForm: {
        name:'',
        mobile:'',
        oldPassword: '',
        newPasswordConfirm:'',
        newPassword:'',
        mail:'',
        otp:'',
        newPhone:''
      },
      changeValidate: {
        name:[
          {required:true,message: '请输入名称', tragger: 'blur'}
        ],
        mail:[
          {required:true,message: '请输入邮箱', tragger: 'blur'}
        ],
        newPhone:[
          {required:true,message: '请输入新手机', tragger: 'blur'}
        ],
        otp:[
          {required:true,message: '请输入验证码', tragger: 'blur'}
        ],
        oldPassword:[
          {required: true, message: '旧密码不能为空', tragger: 'blur'}
        ],
        newPassword:[
          {required: true, validator: newPasswordValidator, tragger: 'blur'}
        ],
        newPasswordConfirm:[
          {required: true, validator: newPwdconVal, tragger: 'blur'}
        ]
      },
      error: '',
      submitting: false,
      name:'',
      phone:'',
      passWord:'******',
      mail:null,
      activeItem:null,
      optLoading:false,
      optCount:60,
      submitLoading:false,
      

    }
  },
  watch:{
    modalStatus: function(newVal) {
      // this.$refs['changeForm'].resetFields();
    }
  },
  methods: {
    errorHanler(error) {
      this.error = error.message || error.error;
    },
    setSubmitState(state) {
      this.submitting = state;
    },
    activeEdit(item){
      this.activeItem=item;
    },
    clearName(){
      console.log(3);
    },
    getVerificationCode(){
      this.optLoading=true;
      var interval;
      axios.get('v1/admin/sendOpt',{params:{
          mobile:this.userEditForm.mobile,
          timestamp:new Date().getTime()
        }})
        .then(res=>{
            this.$Notice.success({
                title: '验证码发送成功!'
            });
            interval=setInterval(()=>{
              if(this.optCount--==0){
                this.optLoading=false;

                clearInterval(interval);
                this.optCount=60;
              }
            },1000);
        }).catch(()=>{
          this.optLoading=false;
        })
        
        
    },
    submit(){
      let data=this.userEditForm;
      let sendData={
        mobile:data.mobile,
        otp:data.otp,
      };
      
      if(this.activeItem=='name'){

      }else if(this.activeItem=='phone'){

      }else if(this.activeItem=='email'){

      }else if(this.activeItem=='password'){
        sendData.oldPassword=data.oldPassword;
        sendData.password=data.newPassword;
      }
      this.$refs['userEditForm'].validate((valid)=>{
        if (valid) {
          this.submitLoading=true;
          axios.post('v1/admin/updatePasswd',sendData)
            .then(res=>{
                this.$Notice.success({
                    title: '修改成功'

                });
                storageHelper.setItem(userPassword,  sendData.password, { expire: 0.5 });

                this.passWord=this.userEditForm.oldPassword=sendData.password;
                this.cancelEdit();
            })
            .finally(()=>{
              
              this.submitLoading=false;
            })
        } else {
        }
      });
      
      
    },
    initData(){
      this.userEditForm={
        name:this.name,
        mobile:this.phone,
        oldPassword: '',
        newPasswordConfirm:'',
        newPassword:'',
        mail:'',
        otp:'',
        newPhone:''

      };
    },
    modalChange(status){
      if(!status){
        this.cancelEdit();
        this.$emit('togglemodal');

      }

    },
    getUserProfile(){
      axios.get('v1/admin/getInfo',{})
        .then(res=>{
            let data=res.data;
            this.userEditForm.name=this.name=this.userEditForm.mobile=this.phone=data.mobile;
            this.mail=data.email;
            // this.passWord=data.password;
        })
      
    },
    cancelEdit(){
      this.activeItem=false;
      this.initData();
    }
  },
  mounted(){
    this.getUserProfile();
  }
}
</script>
<style lang="less" scoped>
.mainprofile{
  text-align: center;
  
}
.mainprofile>div{
  
  text-align: left;
  margin-bottom: 24px;
  >span{
    margin-right: 20px;
    width: 25%;
    display: inline-block;
    text-align: right;
  }
  .ivu-icon{
    float: right;
    line-height: 20px;
  }
  .ivu-btn,.ivu-input-wrapper{
    border-radius: 0;
    width: 50%;
    text-align: left;
  }
  .profilelabel{
    width: 80%;
    display: inline-block;
  }
  .ivu-input-group{
    display: inline-table;
  }
}
.modalfooter{
  text-align: center;
  .ivu-btn{
  }
}

</style>

