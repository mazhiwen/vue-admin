<template>
  <div>
    <Form ref="changeForm" :model="changeForm" :rules="changeValidate" label-position="right" :label-width="112">
      <FormItem label="旧密码" prop="passwd">
        <Input type="password" v-model="changeForm.passwd"></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPasswd">
        <Input type="password" v-model="changeForm.newPasswd"></Input>
      </FormItem>
      <FormItem label="再次输入新密码" prop="newPasswdCheck">
        <Input type="password" v-model="changeForm.newPasswdCheck"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="submitting" @click="handleSubmit('changeForm')">
          <span v-if="!submitting">确定</span>
          <span v-else>Loading...</span>
        </Button>
      </FormItem>
    </Form>
    <Alert v-show="error" type="error" class="error">{{error}}</Alert>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  props: {
    modalOpen: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const validatePass = (rule, value, callback) =>{
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.changeForm.newPasswdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.changeForm.validateField('newPasswdCheck');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.changeForm.newPasswd) {
        callback(new Error('输入内容与新密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      changeForm: {
        passwd: '',
        newPasswd: '',
        newPasswdCheck: '',
      },
      changeValidate: {
        passwd:[
          {required: true, message: '旧密码不能为空', tragger: 'blur'}
        ],
        newPasswd:[
          {required: true, validator: validatePass, tragger: 'blur'}
        ],
        newPasswdCheck:[
          {required: true, validator: validatePassCheck, tragger: 'blur'}
        ]
      },
      error: '',
      submitting: false,
    }
  },
  watch:{
    modalOpen: function(newVal) {
      this.$refs['changeForm'].resetFields();
    }
  },
  methods: {
    errorHanler(error) {
      this.error = error.message || error.error;
    },
    setSubmitState(state) {
      this.submitting = state;
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.setSubmitState(true);
          axios.patch('iam/my/password', {
            oldPassword: this.changeForm.passwd,
            newPassword: this.changeForm.newPasswd,
            confirmPassword: this.changeForm.newPasswdCheck
          },{ defineError: true })
            .then((res) => {
              this.error = '';
              this.setSubmitState(false);
              this.$Notice.success({
                title: '您的密码修改成功',
                desc: ''
              });
              this.$emit('togglemodal')
            })
            .catch((error) => {
              this.setSubmitState(false);
              this.errorHanler(error);
            })
        }
      })
    },
  }
}
</script>
