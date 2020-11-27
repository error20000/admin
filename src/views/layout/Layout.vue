<template>
  <div class="layout">
    <el-container>

      <layout-header></layout-header>
      
      <el-main class="main">
        <transition name="main" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
      
      <!-- 加footer是为了header、main垂直排列 -->
      <el-footer class="footer"></el-footer>

    </el-container>

  </div>
</template>
<script>
import { isLoginUrl, logoutUrl, changePwdUrl } from "@/api";
import layoutHeader from './header/Header'

export default {
  components: {
    layoutHeader
  },
};
</script>

<style>

.layout{
  height: 100%;
}
.footer{
  height: 0 !important;
}

/** main */
.main-enter,
.main-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.main-enter-active {
  transition: all 0.2s;
}
.main-leave-active {
  position: absolute;
  transition: all 0.3s;
}
</style>