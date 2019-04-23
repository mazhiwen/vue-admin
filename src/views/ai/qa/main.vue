<template>
<div class="page_qa">
  <div class="banner">
    <img src="../../../images/qa_banner.png">
    <a target="_blank" href="https://sa.THECOMPANY.com/#/sftp/index?source=THECOMPANY">
      <div>
        <h1>智能催收质检</h1>
        <p>通过语音识别、大数据处理技术有效识别风险信息，帮助催收质检人员高效检验催收语音，</p>
        <p>降低运营风险及人力成本。</p>
      </div>
    </a>
  </div>
  <div class="part1 part">
    <h5>产品流程</h5>
    <div>
      <div>
        <img :src="images.qa_part1_1"/>
        <p>催收录音抽样检验</p>
      </div>
      <img :src="images.qa_part1_2"/>
      <div>
        <img :src="images.qa_part1_3"/>
        <p>THECOMPANY语音分析工具</p>
      </div>
      <img :src="images.qa_part1_2"/>
      <div>
        <img :src="images.qa_part1_4"/>
        <p>催收录音抽样检验</p>
      </div>
    </div>
  </div>
  <div class="part2 part">
    <h5>应用价值</h5>
    <div>
      <div @mouseenter="part2Mouseenter(0)"
        @mouseleave="part2Mouseenter(0)"
        class="part2_1"
        :class="{transform_scale:part2ImgList[0].isHover}"
        >
        <img v-if="part2ImgList[0].isHover" :src="part2ImgList[0].imgHover"/>
        <img v-else :src="part2ImgList[0].img"/>
        <h6>提升质检效率，降低人工成本</h6>
        <p>全面颠覆传统质检模式实现批量质检，质检覆盖率提升至100%，大幅降低人工作业量。</p>
      </div>
      <div @mouseenter="part2Mouseenter(1)"
        @mouseleave="part2Mouseenter(1)"
        class="part2_1"
        :class="{transform_scale:part2ImgList[1].isHover}"
        >
        <img v-if="part2ImgList[1].isHover" :src="part2ImgList[1].imgHover"/>
        <img v-else :src="part2ImgList[1].img"/>
        <h6>提高对催收团队管理能力</h6>
        <p>迎合日益趋严的市场要求 ，高效检验催收质量，降低运营风险，提高对团队管理能力。</p>
      </div>
      <div @mouseenter="part2Mouseenter(2)"
        @mouseleave="part2Mouseenter(2)"
        :class="{transform_scale:part2ImgList[2].isHover}"
        class="part2_1">
        <img v-if="part2ImgList[2].isHover" :src="part2ImgList[2].imgHover"/>
        <img v-else :src="part2ImgList[2].img"/>
        <h6>提升客户满意度</h6>
        <p>读懂客户心声， 改善服务技巧，提升服务效果。</p>
      </div>
    </div>
  </div>



</div>
</template>

<script>
import {Button} from 'iview';
import axios from 'axios';
import { exportData } from 'utils'
import qa_part1_1 from 'images/qa_part1_1.png';
import qa_part1_2 from 'images/qa_part1_2.png';
import qa_part1_3 from 'images/qa_part1_3.png';
import qa_part1_4 from 'images/qa_part1_4.png';
import qa_part2_1 from 'images/qa_part2_1.png';
import qa_part2_1_w from 'images/qa_part2_1_w.png';
import qa_part2_2 from 'images/qa_part2_2.png';
import qa_part2_2_w from 'images/qa_part2_2_w.png';
import qa_part2_3 from 'images/qa_part2_3.png';
import qa_part2_3_w from 'images/qa_part2_3_w.png';
export default {
  data () {
    return {
      images:{
        qa_part1_1:qa_part1_1,
        qa_part1_2:qa_part1_2,
        qa_part1_3:qa_part1_3,
        qa_part1_4:qa_part1_4
      },
      search:{
        params:{
          parentType:"risk",
          type:'riskCheckPerson'
        },
        message:''
      },
      batch:{
        files:[]
      },
      part2ImgList:[
        {
          isHover:false,
          img:qa_part2_1,
          imgHover:qa_part2_1_w
        },
        {
          isHover:false,
          img:qa_part2_2,
          imgHover:qa_part2_2_w
        },
        {
          isHover:false,
          img:qa_part2_3,
          imgHover:qa_part2_3_w
        }
      ]
    }
  },
  computed:{
    

  },
  mounted () {
  },
  components:{
  },
  methods: {
    
    part2Mouseenter(index){

      this.part2ImgList[index].isHover=!this.part2ImgList[index].isHover;
    },
    openEditCharge(){
    },
    beforeUpload(file){
      // this.batch.files.push(file);
      this.batch.files=file;
      console.log(file);
      return false;
    },
    upload(){
      console.log(this.batch.files);
      let fFormDate=new FormData();
      fFormDate.append('file',this.batch.files);
      axios.post('v1/loan_applications/upload_validate/risk/riskCheckPerson',
        fFormDate,
        {
          headers:{'Content-Type':'multipart/form-data'},
          onUploadProgress: function (progressEvent) {
            // 对原生进度事件的处理
            console.log(progressEvent)
          },
        })

    },
    searchHandler(){
      axios.post('v1/loan_applications/single_validate',this.search.params)
        .then(res=>{
          this.search.message=res['message'];
        })
        
    },
    downTemple(){
      exportData({ type: 'riskCheckPerson' }, 'v1/loan_applications/exportVerifyTemplate')
    }
  }
}
</script>
