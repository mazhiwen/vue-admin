<template>
  <Card>
    <p slot="title" class="title">
      {{title}}
    </p>
    <ul class="container">
      <Row>
        <Upload action="" :before-upload="beforeUpload">
          <button class="select-btn">选择文件</button>
          <span v-if="file === null">未选择任何文件</span>
          <span v-if="file !== null">{{ file.name }}</span>
        </Upload>
      </Row>   
      <Row>提示：最大支持1000条，UTF-8编码xls文件</Row>
      <div class="tips">
        <p>【重要提示】</p>
        <p>查询需满足以下条件，否则应承担相应法律责任:</p>
        <p>1. 需经信息主体明确授权;</p>
        <p>2. 向信息主体告知查询用途与目的、可能产生的不良后果并取得其同意。</p>
      </div>
      <Row class="up-down">
        <Button
          :loading="inputSubmitDisabled" 
          size="large" type="warning"
          @click="uploadFile">
          提交
        </button>
        <Button 
          size="large" class="down"
          @click="downloadTemplate">
          下载模板
        </Button>
        <Button 
          size="large" class="down"
          @click="getBatchAll">
          刷新
        </Button>
      </Row>
      <Table border :columns="columns7" :data="tableData"></Table>
    </ul>
  </Card>
</template>

<script>
import axios from 'axios'
import { msToDateTime } from 'filters'
import { exportData } from 'utils'
const reg = {
  xls: /\.[xls|xlsx]$/
}
export default {
  props: {
    title: String,
    type: String,
    parenttype:String,
    requestData:Object,
    tableData:Array
  },
  data () {
    return {
      inputSubmitDisabled:false,
      columns7: [
        {
          title: '任务ID',
          key: 'batchId',
        },
        {
          title: '提交文件',
          key: 'fileName'
        },
        {
          title: '提交时间',
          key: 'createdAt',
          render: (h, params) => {
            let time = msToDateTime(params.row.createdAt)
            return h('span',{},time)
          }
        },
        {
          title: '条数',
          key: 'num',
          width: 150,
          align: 'center',
        },
        {
          title: '当前状态',
          key: 'state'
        },
        {
          title: '完成时间',
          key: 'finishedAt',
          render: (h, params) => {
            if(params.row.finishedAt) {
              let time = msToDateTime(params.row.finishedAt)
              return h('span',{},time)
            }
          }
        },
        {
          title: ' 查验结果',
          key: 'address',
          render: (h, params) => {
            if(params.row.state === '已完成') {
              return h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.downloadResult(params.row.batchId)
                    }
                  }
                }, '下载')
            }
          }
        },
        {
          title: '操作',
          key: 'address',
          render: (h, params) => {
            if(params.row.state === '已完成') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.batchId)
                    }
                  }
                }, '删除')
              ]);
            }          
          }
        },
      ],

      file: null,
    }
  },
  mounted () {
  },
  components: {

  },
  methods: {
    getBatchAll() {
      let url;
      if(this.requestData.getBatchAll){
        url = this.requestData.getBatchAll.url;
      }else{
        url=`v1/batch/query_all?type=${this.type}`;
      }
      axios.get(url).then((res) => {
        this.tableData = res.data
      })
    },
    beforeUpload(file) {
      this.file = file
      return false
    },
    uploadFile() {
      if(!this.file) {
        this.$Message.warning({
          content:'请选择文件'
        })
        return false
      }
      if(this.file && !/\.(xls|xlsx)$/i.test(this.file.name)) {
        this.$Message.warning({
          content:'文件格式不正确，请选择xls或者xlsx文件'
        })
        return false
      }
      this.inputSubmitDisabled=true;
      let formData = new FormData()
      formData.append('file',this.file)
      let that = this
      this.file = null
      let requestData='loan_applications/upload_validate/';
      if(this.requestData&&this.requestData.import)
      {
        if(this.requestData.import.url){
          requestData=this.requestData.import.url;
          Object.entries(this.requestData.import.params).map(([index,value])=>{
            formData.append(index,value);
          })
        }else{
          requestData=this.requestData.import;
        } 
        
      }
      if(this.parenttype){
        requestData=`v1/${requestData}${this.parenttype}/${this.type}`
      }else{
        
      }
      axios.post(requestData,formData,
        {
          headers:{'Content-Type':'multipart/form-data'},
          onUploadProgress: function (progressEvent) {
            // 对原生进度事件的处理
            console.log(progressEvent)
          },
        })
        .then(function(res){
          if(res.status === 200) {
            that.$Message.success({
              content:"提交成功"
            })
            that.getBatchAll()
          }
        })
        .finally(()=>{
          this.inputSubmitDisabled=false;
        });
    },
    downloadTemplate() {
      let exportUrl;
      let params={ 
        type: this.type 
      };
      if(this.requestData&&this.requestData.exportUrl){
        if(this.requestData.exportUrl.params){
          exportUrl=this.requestData.exportUrl.url;
          params={...params,...this.requestData.exportUrl.params};
        }else{
          exportUrl=this.requestData.exportUrl;
        }
      }else{
        exportUrl='loan_applications/exportVerifyTemplate';

      }
      exportData(params, `v1/${exportUrl}`)
    },
    downloadResult(batchModelId) {
      exportData({ batchModelId }, `v1/model/application/batch/downloadBatchReport`)
    },
    remove(batchId) {
      let that = this
      
      that.$Modal.confirm({
        title: '',
        content: '确定删除?',
        onOk: () => {
          axios.get(this.requestData.delete,{
            params: {
              batchId
            }
          }).then(function() {
            that.$Message.success({
              content:"删除成功"
            })
            that.getBatchAll()

          })
          
        },
        onCancel: () => {
            
        }
      })
      
    }
  },
  filters: {

  }
}
</script>
<style lang="less" scoped>
.container{
  padding:30px 0;
  color: #666;
  
  .select-btn{
    background-color:#fff;
    padding:10px 22px;
    color:#FF7C23;
    font-size: 14px;
    border: 1px solid #FF7C23;
  }
  .up-down{
    padding: 33px 0;
  }
  button.down{
    margin-left:49px;
  }
  .tips{
    margin-top:36px;
  }
}
</style>
