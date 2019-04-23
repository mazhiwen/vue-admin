<template>
  <div class="login">
    <h1 class="app-name">{{appName}}</h1>
    <div class="login-box" :class="{'no-pointer-events': submitting}">
      <Form ref="userForm" :model="userForm" :rules="userRule">
        <FormItem prop="username">
          <Input :maxlength="11" type="text" v-model="userForm.username" icon="ios-person" placeholder="手机号" autofocus></Input>
        </FormItem>
        <FormItem prop="password">
          <Input :maxlength="20" type="password" v-model="userForm.password" icon="ios-locked-outline" placeholder="密码"></Input>
        </FormItem>
        <!-- <Button type="primary" :loading="submitting" @click="handleGetSms('userForm')" long>
          <span v-if="!submitting">下一步</span>
          <span v-else>Loading...</span>
        </Button> -->
        <Button type="primary" :loading="submitting" @click="handleLogin('userForm')" @keyup.enter.native="handleLogin('userForm')" long>
          <span v-if="!submitting">登 录</span>
          <span v-else>Loading...</span>
        </Button>
      </Form>
      
    </div>
    <Alert v-show="error" type="error" class="error">{{error}}</Alert>
  </div>
</template>

<script>
import axios from 'axios';
import { storageHelper ,cookie,copy} from 'utils';
import { 
  appName, authToken, authMobile,xMerchantId,userPassword ,
  checkItemInfo,merchantAuth
} from 'configs';
import { menusOrigin } from 'statics/menus';
import {
  SetMenus
} from 'store/mutation-types.js'
import {mapMutations} from 'vuex';

export default {

  data() {
    return {
      appName: appName,
      submitting: false,
      error: '',
      userForm: {
        username: '',
        password: ''
      },
      userRule: {
        username: [
          { required: true, trigger: 'blur', message: '请填写手机号码' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请填写密码' }
        ]
      }
    };
  },
  mounted() {

  },
  methods: {
    ...mapMutations([
      SetMenus 
    ]),
    errorHanler(error) {
      this.error = error.message || error.error;
    },
    setSubmitState(state) {
      this.submitting = state;
    },
    
    handleLogin (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return;
        this.login()
      })
    },
    
    login() {
      cookie.remove(authToken)
      this.setSubmitState(true);
      axios.post('v1/admin/login', {...this.userForm,userType:'merchant'}, { useOrigin: true })
        .then((res) => {
          storageHelper.setItem(authToken, res.data.data['token'], { expire: 0.5 });
          storageHelper.setItem(authMobile,  this.userForm.username, { expire: 0.5 });
          storageHelper.setItem(userPassword,  this.userForm.password, { expire: 0.5 });
          storageHelper.setItem(xMerchantId, res.data.data['merchantId'], { expire: 0.5 });
          storageHelper.setItem(merchantAuth, res.data.data['merchantAuth'], { expire: 0.5 });
          this.setSubmitState(true);
          this.$router.push({ name: 'home'});
          
        })
        .catch((error) => {
          this.setSubmitState(false);
          this.errorHanler(error);
        })
    },
    
  }

};
</script>

<style lang="less">
  .login {
    text-align: center;
    padding: 10rem 0;
    width: 320px;
    margin: 0 auto;
    .login-box {
      background: #fff;
      border: 1px solid rgba(0,0,0,0.1);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border-radius: 0.25rem;
      padding: 2rem
    }
    .ivu-form-item {
      margin-bottom: 2rem
    }
  }
  .app-name, .login-box {
    margin-bottom: 1rem;
  }
</style>
