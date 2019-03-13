<template>
  <!--低粒度组件，仅用于样式-->
  <div class="titleLink">
    <h1>{{titleName.name}}</h1>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  computed: Vuex.mapState(['titleName'])
}
</script>

<style>
  .titleLink{
    height: 30px;
    margin-top: 10px;
  }
  .titleLink h1{
    line-height: 30px;
    color: #4d79bb;
    font-size: 21px;
    font-weight: 400;
    border-left: 5px solid #4d79bb;
    text-indent: 15px;
  }
</style>
