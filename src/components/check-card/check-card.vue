<template>
  <Card  class="graphwrap" :bordered="false">
    <p slot="title" >
      {{title}}
    </p>
    <!-- <span href="#" slot="extra" @click="refresh" class="data-time">
      数据获取时间：<span class="time">{{time | msToTime}}</span>
      <a><Icon size="22" type="ios-loop-strong"></Icon></a> 
    </span> -->
    <p slot="extra" @click="refresh" class="graphtitle-right"><span>数据获取时间:<span class="main-num-color">{{time|msToTime}}</span></span> <a><Icon size="22" type="ios-loop-strong"></Icon></a></p>

    <ul class="card-content">
      <Row class="today-check">今日查询次数</Row>
      <Row class="count-num"><span class="count orange">{{dayCount}}</span>次</Row>
      <Row class="month-check">本月查询次数<span class="orange">{{monthCount}}</span>次</Row>
    </ul>
  </Card>
</template>

<script>
export default {
  props: {
    title: String,
    dayCount: Number,
    monthCount: Number,
    time: [String, Number],
    type: String
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  components: {

  },
  methods: {
    refresh() {
      this.$emit('refresh',this.type)
    }
  },
  filters: {

  }
}
</script>
