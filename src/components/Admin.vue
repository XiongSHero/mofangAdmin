<template>
  <el-container>
    <el-aside width="180px" style="background-color: #19233c">
      <h2 class="mf-title">客户管理系统</h2>
      <el-menu>
        <el-menu-item index="1-1" >
          <router-link :to="{path: '/index'}">
            <span class="icon iconfont icon-shouye"></span>首&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <router-link :to="{path: '/task'}">
            <span class="icon iconfont icon-renwu"></span>日常任务
          </router-link>
        </el-menu-item>
        <el-menu-item  index="1-3">
          <router-link :to="{path: '/record'}">
            <span class="icon iconfont icon-lianxiren"></span>联系记录
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-4">
          <router-link :to="{path: '/client'}">
            <span class="icon iconfont icon-kehu"></span>客  户  池
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-5">
          <router-link :to="{path: '/setting'}">
            <span class="icon iconfont icon-shezhi"></span>设&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="height: 50px;" class="admin-header clearfix">
        <HeaderTitle class="fl"></HeaderTitle>
        <span class="icon iconfont icon-tuichu fr" @click="logout" title="退出登录"></span>
        <span class="mf-reg fr" @click="showReg" v-if="userRight === 'admin'">注册管理员</span>
      </el-header>
      <el-main>
       <keep-alive>
         <router-view/>
       </keep-alive>
      </el-main>
    </el-container>
    <RegAndPass :title="regTitle" :do-type="reg" :show-card="showRegCard" @hideCard="hideReg"></RegAndPass>
  </el-container>
</template>

<script>
import HeaderTitle from './common/HeaderTitle'
import RegAndPass from './common/RegAndPass'
import util from '../assets/js/util'
export default {
  data () {
    return {
      regTitle: '注册管理员',
      reg: 'register',
      showRegCard: false,
      userRight: ''
    }
  },
  components: {
    HeaderTitle,
    RegAndPass
  },
  mounted () {
    this.userRight = util.getSession('store').user.right
  },
  methods: {
    logout () {
      localStorage.setItem('username', '')
      localStorage.setItem('store', '')
      this.$router.push({path: '/'})
    },
    showReg () {
      this.showRegCard = true
    },
    hideReg () {
      this.showRegCard = false
    }
  }
}
</script>

<style scoped>
  @import '../assets/css/iconfont.css';
  .el-container{
    height: 100%;
    min-height: 100%;
    overflow: hidden;
  }
  .el-header {
    line-height: 50px;
  }
  .el-header span{
    cursor: pointer;
  }
  .el-aside {
    color: #fff;
  }
  .mf-title{
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    color: #fff;
    width: 179px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
  }
  .el-menu{
    background: rgb(25, 35, 60);
    border-right: 1px solid rgb(25, 35, 60)
  }
  .el-menu-item a{
    display: block;
    color: #fff;
    font-size: 16px;
    vertical-align: baseline;
  }
  .iconfont{
    position: relative;
    top: -2px;
    color: #4d5470;
    margin-right: 20px;
  }
  .el-menu-item.is-active{
    background: #121a2c;
  }
  .el-menu-item:focus, .el-menu-item:hover {
    outline: 0;
    background-color: #121a2c;
  }
  .el-main{
    position: relative;
    background: #e8ecf0;
  }
  .admin-header{
    text-align: right;
  }
  .mf-reg{
    margin-right: 50px;
    font-weight: bold;
  }
</style>
