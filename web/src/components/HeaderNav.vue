<template>
  <div class="header-nav">
    <el-row type="flex">
      <el-col :span="1" class="logo">
        <img src="@/assets/mylogo.jpg" />
      </el-col>
      <el-col :span="6">
        <el-menu
          :default-active="'1'"
          mode="horizontal"
          background-color="rgba(0, 0, 0, 1)"
          text-color="white"
          active-text-color="orange"
        >
          <el-menu-item index="1">发现音乐</el-menu-item>
          <el-menu-item index="2">我收藏的音乐</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: ''
    }
  },
  methods:{

  },
  beforeMount() {

  }
};
</script>

<style scoped>
.header-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 5rem;
  background: rgba(0, 0, 0, 1);
  opacity: 0.6;
  transition: 0.5s;
  z-index: 999;
}

.header-nav:hover {
  background: rgba(0, 0, 0, 1);
  opacity: 0.8;
}

.logo {
  height: 60px;
}

.logo img {
  height: 100%;
}

.el-row {
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
}

.el-menu {
  border-bottom: none !important;
}

.el-menu-item {
  font-size: 16px;
}

.el-menu-item:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}
</style>
