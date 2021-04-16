<template>
  <div class="template">
    <HeaderNav></HeaderNav>
    <el-row class="banner">
      <transition name="el-fade-in-linear">
        <el-col :span="24" v-show="bannerShow" class="banner-img">
          <img src="@/assets/banner/sekiro.jpg" />
        </el-col>
      </transition>
    </el-row>
    <el-row class='music-container' type="flex" justify="space-around" style="margin:8rem 0 2rem 0">
      <el-col :span="11">
        <el-row>
          <el-input placeholder="请输入内容" v-model="input" @keyup.native.enter="getSong(input)"></el-input>
        </el-row>
        <el-col class="content">
          <el-row class="list-title">
            <el-col :span="6">歌曲</el-col>
            <el-col :span="2" :offset="1">时长</el-col>
            <el-col :span="4" :offset="1">歌手</el-col>
            <el-col :span="4" :offset="1">专辑</el-col>
          </el-row>
          <el-row v-for="data in currentSongList" :key="data.id" class="song-list">
            <el-col :span="6" class="long-string">{{data.song}}</el-col>
            <el-col :span="2" :offset="1" class="long-string">{{data.dt}}</el-col>
            <el-col :span="4" :offset="1" class="long-string">{{data.singer}}</el-col>
            <el-col :span="4" :offset="1" class="long-string">{{data.album}}</el-col>
            <el-col :span="2" :offset="1" class="play-btn">
              <el-row class="play-icon">
                <el-col :span="4">
                  <i class="el-icon-video-play" @click="playSong(data)"></i>
                </el-col>
                <el-col :span="4" :offset="4">
                  <i class="el-icon-circle-plus-outline" @click="listAdd(data)"></i>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-pagination
            class="mpage"
            layout="prev, pager, next"
            :current-page = "currentPage"
            :page-size = "pageSize"
            :total="songList.length"
            @current-change=page>
          </el-pagination>
        </el-col>
      </el-col>
      <el-col :span="11" class="content song-content">
        <el-row>
          <el-col class="content-name">{{playContent.song}}</el-col>
        </el-row>
        <el-row>{{playContent.singer}}</el-row>
        <el-row type="flex" justify="center" class="lyric-contain">
          <el-col :span="23" class="song-lyric" :style="lyricMove">
            <el-row
              v-for="(item,index) in lyric"
              :key="index"
              :style="{'font-size': (index==currentRow ? '1.3rem':'.9rem')}"
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
      pageSize: 10
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
      let start = (currentPage-1) * this.pageSize;
      let end = Math.min(currentPage * this.pageSize, this.songList.length);
      this.currentSongList = this.songList.slice(start, end);
    },
    clearSongList() {
      this.songList = [];
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
.template {
  width: 100%;
  background: #f2f2f2;
}

.banner {
  height: 100%;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  filter: blur(5px);
}

.banner-img {
  transition: 0.5s;
}

.banner-img img {
  width: 100% !important;
}

.content {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  min-height: 35rem;
}

.list-title {
  padding: 0.5rem;
  border-bottom: 1px solid slategray;
  align-items: flex-end;
}

.song-list {
  font-size: 0.8rem;
  padding-bottom: 0.5rem;
  margin: 1rem;
  border-bottom: 1px solid slategray;
}

.play-icon {
  font-size: 1.2rem;
}

.play-icon i:hover {
  color: #409eff;
}

.el-pagination >>> button,

.el-pagination >>> li {
  background: none;
}

.song-content {
  min-height: 35rem;
  max-height: 35rem;
}

.content-name {
  font-family: "KaiTi";
  padding: 2rem 0 1rem 0;
  font-size: 2rem;
}

.lyric-contain {
  position: relative;
  height: 20rem;
  margin-top: 3rem;
  overflow: hidden;
}

.song-lyric {
  /* css保留空格和换行符*/
  white-space: pre-wrap;
  /* css保留换行符*/
  white-space: pre-line;
  position: absolute;
  transition: 1s;
}

.lyric-row {
  height: 2.5rem;
}

.mpage {
  margin: 0 auto;
  text-align: center;
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

.el-input {
  margin-bottom: 1em;
}

.music-container {
  align-items: flex-end;
}

.el-pagination {
  color: gray;
}
</style>
