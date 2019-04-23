<template>
  <Modal :mask-closable="false" :value="modalStatus" title="需要短信验证" @on-visible-change="statusChange"	>
    <Form :model="formMsg" >
      <FormItem label="">
        <Input v-model="formMsg.code" style="width:270px;">
          <Button :disabled="optSendBtn" type="primary"  slot="prepend" icon="ios-paperplane" style="width: 150px;" @click="send">点击发送验证码 <span v-if="optSendBtn">{{optCount}}</span></Button>
        
        </Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="loadingBtn" @click="validate">验证</Button>              
    </div>
  </Modal>
</template>

<script>
import axios from 'axios';

export default {
  props:{
    modalStatus:{
      type:Boolean
    },
    otpType:{
    }
  },
  data () {
    return {
      formMsg:{
        code:''
      },
      loadingBtn:false,
      optCount:60,
      optSendBtn:false
    }
  },
  mounted () {
  },
  methods: {
    validate(){
      if(/^([a-z0-9])+$/.test(this.formMsg.code)){
        this.loadingBtn=true;
        axios.post('v1/admin/validateOpt',{},{
          params:{
            timestamp:new Date().getTime(),
            otp:this.formMsg.code,
            otpType:this.otpType

          }
        })
          .then(res=>{
            if(res['message']=='success'){
              this.$Notice.success({
                  title: '验证成功',
              });
              this.$emit('finished');
              this.statusChange(false);
            }
          })
          .finally(()=>{
            
            // this.$emit('finished');
            // this.statusChange(false);


            this.loadingBtn=false;
          })
      }else{
        this.$Notice.warning({
            title: '未正确输入验证码',
        });
      }
      
    },
    send(){
      let interval;
      this.optSendBtn=true;
      axios.get('v1/admin/sendOpt',{
        params:{
          timestamp:new Date().getTime(),
          otpType:this.otpType
        }
      })
        .then(res=>{
          if(res['message']=='success'){
            this.$Notice.success({
                title: '发送成功',
            });
            interval=setInterval(()=>{
              if(this.optCount--==0){
                clearInterval(interval);
                this.optSendBtn=false;
                this.optCount=60;
              }
            },1000);
    
          }

        })
        .finally(()=>{
        })
    },
    statusChange(status){
      if(status){
        this.formMsg.code='';
      }

      this.$emit('status-change',status);

    }
  }
}
</script>
<style>
.ivu-form-item{
  margin:20px auto;
}

</style>
