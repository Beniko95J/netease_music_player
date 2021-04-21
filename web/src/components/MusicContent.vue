<template>
  <div class="app-container">
    <div class="bg"></div>
    <HeaderNav></HeaderNav>
    <el-row type="flex" justify="space-around" class='m-container'>
      <el-col :span="11" class="left-panel">
        <el-row>
          <el-col :span="12">
            <el-input placeholder="请输入内容" v-model="input" @keyup.native.enter="getSong(input)" class="m-input"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button @click="fetch()" class="m-button">显示收藏</el-button>
          </el-col>
          <el-col :span="4">
            <el-button @click="listAllAdd()" class="m-button">全部加入</el-button>
          </el-col>
          <el-col :span="4">
            <el-button @click="listAllRemove()" class="m-button">全部移除</el-button>
          </el-col>
        </el-row>
        <el-col class="m-content">
          <el-row type="flex" justify="start" class="list-title">
            <el-col :span="6">歌曲</el-col>
            <el-col :span="2" :offset="1">时长</el-col>
            <el-col :span="2" :offset="1">歌手</el-col>
            <el-col :span="4" :offset="1">专辑</el-col>
          </el-row>
          <el-row v-for="data in currentSongList" :key="data.id" class="list-item">
            <el-col :span="6" class="long-string">{{data.song}}</el-col>
            <el-col :span="2" :offset="1" class="long-string">{{data.dt}}</el-col>
            <el-col :span="2" :offset="1" class="long-string">{{data.singer}}</el-col>
            <el-col :span="4" :offset="1" class="long-string">{{data.album}}</el-col>
            <el-col :span="4" :offset="1">
              <el-row type="flex" justify="space-around" class="play-icon">
                <el-col :span="6">
                  <i class="el-icon-video-play" @click="playSong(data)"></i>
                </el-col>
                <el-col :span="6">
                  <i class="el-icon-circle-plus-outline" @click="listAdd(data)"></i>
                </el-col>
                <el-col :span="6">
                  <i class="el-icon-star-off" v-show="!isShowCollection" @click="like(data)"></i>
                  <i class="el-icon-delete" v-show="isShowCollection" @click="remove(data)"></i>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-pagination
            class="m-page"
            layout="prev, pager, next"
            :current-page = "currentPage"
            :page-size = "pageSize"
            :total="songList.length"
            @current-change=page>
          </el-pagination>
        </el-col>
      </el-col>
      <el-col :span="11" class="m-content">
        <el-row>
          <el-col>{{playContent.song}}</el-col>
        </el-row>
        <el-row>
          <el-col>{{playContent.singer}}</el-col>
        </el-row>
        <el-row type="flex" justify="center" class="lyric-contain">
          <el-col :span="24" class="song-lyric" :style="lyricMove">
            <el-row
              v-for="(item,index) in lyric"
              :key="index"
              :style="{'font-size': (index==currentRow ? '1.3rem':'.9rem'), 'color': (index==currentRow ? 'blue' : 'black')}"
              class="lyric-row"
            >{{item.text}}</el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <PlayComponent></PlayComponent>
  </div>
</template>

<script>
import axios from 'axios';
import HeaderNav from './HeaderNav';
import PlayComponent from './PlayComponent'
export default {
  name: "articleContent",
  data() {
    return {
      input: '',
      bannerShow: false,
      currentSongList: [],
      songList: [],
      lyric: [],
      currentRow: 0,
      lyricMove: {
        top: "6rem"
      },
      currentPage: 1,
      pageSize: 10,
      isShowCollection: false
    };
  },
  methods: {
    getSong(name) {
      this.clearSongList();
      let url = "https://autumnfish.cn/search?keywords=" + name + "&limit=60";
      axios.get(url).then(res => {
        console.log(res);
        this.formatSongs(res.data.result.songs);
        this.page(1);
        this.isShowCollection = false;
      }).catch(err => {
        console.log(err);
      });
    },
    //格式化歌曲列表信息
    formatSongs(arr) {
      let n = arr.length;
      for (let i = 0; i < n; i++) {
        let obj = {};
        obj.id = arr[i].id;
        obj.song = arr[i].name;
        obj.singer = arr[i].artists[0].name;
        obj.dt = this.formatDt(arr[i].duration);
        obj.album = arr[i].album.name;
        this.songList.push(obj);
      }
    },
    //格式化播放时长
    formatDt(time) {
      let dt = time / 1000;
      let m = parseInt(dt / 60);
      let s = parseInt(dt % 60);
      m >= 10 ? m : (m = "0" + m);
      s >= 10 ? s : (s = "0" + s);
      return m + ":" + s;
    },
    //播放歌曲
    playSong(obj) {
      this.getLyric(obj.id);
      this.$store.commit("setContent", obj);
    },
    //添加歌曲
    listAdd(obj) {
      this.$store.commit("addSong", obj);
    },
    listAllAdd() {
      for (let i = 0; i < this.songList.length; i++) {
        this.$store.commit("addSong", this.songList[i]);
      }
    },
    listAllRemove() {
      for (let i = 0; i < this.songList.length; i++) {
        this.$store.commit("removeSong", this.songList[i]);
      }
    },
    //获取歌词信息
    async getLyric(id) {
      let url = "https://autumnfish.cn/lyric?id=" + id;
      const res = await axios.get(url);
      console.log(res);
      this.lyric = [];
      this.formatLyric(res.data.lrc.lyric);
    },
    //格式化歌词
    formatLyric(text) {
      let arr = text.split("\n"); //分割为行
      let row = arr.length; //歌词行数
      for (let i = 0; i < row; i++) {
        let temp_row = arr[i]; //let row = "[00:04.302]作曲 ：梁博";
        let temp_arr = temp_row.split("]");
        let text = temp_arr.pop();
        temp_arr.forEach(element => {
          let obj = {};
          let time_arr = element.substr(1, element.length - 1).split(":");
          let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]);
          obj.time = s;
          obj.text = text;
          this.lyric.push(obj);
        });
      }
      this.lyric.sort(this.sortRule);
      this.$store.commit("setLyric", this.lyric);
    },
    sortRule(a, b) {
      return a.time - b.time;
    },
    page(currentPage) {
      this.currentPage = currentPage;
      let start = (currentPage-1) * this.pageSize;
      let end = Math.min(currentPage * this.pageSize, this.songList.length);
      this.currentSongList = this.songList.slice(start, end);
    },
    clearSongList() {
      this.songList = [];
    },
    async like(data) {
      console.log(data);
      const res = await this.$http.post('/add', data);
      console.log(res);
      this.$message({
        type: 'success',
        message: '收藏成功'
      });
    },
    async fetch() {
      const res = await this.$http.get('/list');
      console.log(res);
      this.songList = res.data;
      this.page(this.currentPage);
      console.log(this.currentPage);
      this.isShowCollection = true;
    },
    async remove(data) {
      const res = await this.$http.delete(`/delete/${data.id}`);
      console.log(res);
      this.$message({
        type: 'success',
        message: '取消收藏成功！'
      });
      this.fetch();
    }
  },
  computed: {
    playContent() {
      return this.$store.state.playContent;
    },
    lyricCurrent() {
      return this.$store.state.current;
    }
  },
  watch: {
    lyricCurrent() {
      this.lyric.forEach((element, index) => {
        if (this.lyricCurrent == element.time) {
          this.lyricMove.top = -index * 2.5 + 6 + "rem";
          this.currentRow = index;
        }
      });
    },
    playContent() {
      this.lyricMove.top = "6rem";
      this.getLyric(this.$store.state.playContent.id);
      return this.$store.state.playContent;
    }
  },
  created() {
    this.bannerShow = true;
    window.scrollTo(0, 0);
  },
  components: {
    HeaderNav,
    PlayComponent
  }
};
</script>

<style scoped>
.app-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url('../assets/banner/sekiro.jpg');
  background-position: center;
  background-size: cover;
  filter: blur(3px);
  z-index: -1;
}

.m-container {
  position: relative;
  align-items: flex-start;
  padding: 3rem 1rem 1rem 1rem;
  height: calc(100% - 160px);
}

.left-panel {
  height: 100%;
}

.m-input {
  margin-bottom: 1rem;
}

.m-button {
  width: 100%;
}

.m-content {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1rem;
  padding: 1rem;
  height: 80%;
  overflow: auto;
}

.list-title {
  border-bottom: 0.25rem solid gray;
  padding-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
}

.list-item {
  border-bottom: 0.125rem solid slategray;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  line-height: 2rem;
}

.play-icon {
  font-size: 2rem;
}

.play-icon i:hover {
  color: #409eff;
}

.lyric-contain {
  position: relative;
  height: 30rem;
  margin-top: 1rem;
  overflow: hidden;
  border: solid 0.5rem rgba(255, 255, 255, 0.8);
}

.song-lyric {
  position: absolute;
  transition: 1s;
  padding: 1rem;
}

.lyric-row {
  height: 2.5rem;
}

.m-page {
  margin: 0 auto;
  text-align: center;
  margin-top: 0.5rem;
}

.long-string {
  white-space:nowrap; 
  overflow:hidden;
  text-overflow:ellipsis;
}

.long-string:hover {
  text-overflow:inherit;
  overflow:visible;
}
</style>
