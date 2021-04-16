<template>
  <div class="play-control">
    <el-row type="flex" justify="flex-start">
      <el-col :span="1.5" class="control-icon control-col">
        <i class="el-icon-caret-left play-icon" @click="prevSong"></i>
        <i class="el-icon-video-play play-icon" v-show="!playStatus" @click="play"></i>
        <i class="el-icon-video-pause play-icon" v-show="playStatus" @click="pause"></i>
        <i class="el-icon-caret-right play-icon" @click="nextSong"></i>
      </el-col>
      <el-col :span="20" class="control-col">
        <el-row class="control-concent">
          <el-col :span="22" class="left-align">{{songContent.song}} - {{songContent.singer}}</el-col>
          <el-col :span="2" class="right-align">{{currentText}} / {{durationText}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" class="play-bar">
          <el-col :span="24" class="left-align">
            <el-slider v-model="currentBar" :show-tooltip="false" @click.native="skipBar"></el-slider>
          </el-col>
          <el-col :span="0"></el-col>
        </el-row>
      </el-col>
      <el-col :span="0.75" class="control-icon control-col">
        <el-tooltip class="item" effect="dark" content="单曲播放" placement="top">
          <i
            class="el-icon-ice-cream-square play-icon"
            v-show="loopStyle=='not'?true:false"
            @click="loopStyle='list'"
          ></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="列表循环" placement="top">
          <i
            class="el-icon-orange play-icon"
            v-show="loopStyle=='list'?true:false"
            @click="loopStyle='single'"
          ></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="单曲循环" placement="top">
          <i
            class="el-icon-lollipop play-icon"
            v-show="loopStyle=='single'?true:false"
            @click="loopStyle='random'"
          ></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="随机播放" placement="top">
          <i
            class="el-icon-magic-stick play-icon"
            v-show="loopStyle=='random'?true:false"
            @click="loopStyle='not'"
          ></i>
        </el-tooltip>
      </el-col>
      <el-col :span="0.75" class="control-icon control-col">
        <el-tooltip class="item" effect="dark" content="播放列表" placement="top">
          <i class="el-icon-more play-icon" @click="listShow=!listShow"></i>
        </el-tooltip>
      </el-col>
    </el-row>
    <audio ref="audio" autoplay></audio>
    <transition name="el-zoom-in-bottom">
      <el-row class="play-list-container" type="flex" v-show="listShow">
        <el-col>
          <el-row class="title" type="flex" justify="start">
            <el-col :span="23">播放列表</el-col>
            <el-col :span="1">
              <i class="el-icon-close" @click="listShow=false"></i>
            </el-col>
          </el-row>
          <el-row class="list-title" type="flex">
            <el-col :span="2"></el-col>
            <el-col :span="4" :offset="2" >歌曲</el-col>
            <el-col :span="4" :offset="2" class="long-string">时长</el-col>
            <el-col :span="4" :offset="2" class="long-string">歌手</el-col>
          </el-row>
          <el-row v-for="site in currentPlayList" :key="site.id" class="play-list" type="flex" justify="center">
            <el-col :span="2" class="play-wave">
              <img
                src="@/assets/wave.gif"
                v-show="(site.id==songContent.id&&playStatus===true)?true:false"
              />
            </el-col>
            <el-col :span="4" :offset="2" class="long-string">{{site.song}}</el-col>
            <el-col :span="4" :offset="2" class="long-string">{{site.dt}}</el-col>
            <el-col :span="4" :offset="2" class="long-string">{{site.singer}}</el-col>

            <el-col :span="1" v-show="(site.id!=songContent.id||playStatus==false)?true:false">
              <el-tooltip class="item" effect="dark" content="播放" placement="top">
                <i class="el-icon-video-play icon" @click="cutSong(site)"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="1" v-show="(site.id==songContent.id&&playStatus==true)?true:false">
              <el-tooltip class="item" effect="dark" content="暂停" placement="top">
                <i class="el-icon-video-pause icon" @click="pause"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="3">
              <el-tooltip
                class="item"
                effect="dark"
                content="移除"
                placement="top"
                @click.native="removeSong(site)"
              >
                <i class="el-icon-delete icon"></i>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-pagination
            class="mpage"
            layout="prev, pager, next"
            :current-page = "miniCurrentPage"
            :page-size = "miniPageSize"
            :total="playList.length"
            @current-change=minipage>
          </el-pagination>
        </el-col>
      </el-row>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      playStatus: false,
      Timer: "", //定时器
      currentBar: 0,
      currentText: "00:00",
      durationText: "00:00",
      listShow: false,
      loopStyle: "list", //not:单曲播放 list:列表循环 single:单曲循环 random:随机循环
      miniCurrentPage: 1,
      miniPageSize: 4,
      currentPlayList: []
    };
  },
  watch: {
    songContent() {
      this.playSong(this.songContent);
    },
    playList() {
      this.minipage(this.miniCurrentPage);
    }
  },
  computed: {
    songContent() {
      return this.$store.state.playContent;
    },
    playList() {
      return this.$store.state.playList;
    }
  },
  methods: {
    //点击播放
    play() {
      this.$refs.audio.ended
        ? this.playSong(this.songContent)
        : this.$refs.audio.play(),
        this.setTimer();
      this.playStatus = true;
    },
    //点击暂停
    pause() {
      this.playStatus = false;
      this.$refs.audio.pause(), this.clearTimer();
    },
    //列表点击播放歌曲
    cutSong(obj) {
      obj == this.songContent
        ? this.play()
        : this.$store.commit("setContent", obj);
    },
    //初始化播放信息
    playSong(obj) {
      this.durationText = obj.dt;
      this.playStatus = true;
      this.currentText = "00:00";
      this.currentBar = 0;
      let song_url = "https://autumnfish.cn/song/url?id=" + obj.id;
      this.getSong(song_url);
    },
    //获取歌曲资源并播放
    getSong(url) {
      axios.get(url).then(
        res => (
          (this.$refs.audio.src = res.data.data[0].url), this.setTimer()
        )
      )
      .catch(function(err) {
        console.log(err);
      });
    },
    //进度条跳转
    skipBar() {
      this.$refs.audio.currentTime =
        (this.currentBar / 100) * this.$refs.audio.duration;
    },
    //格式化播放时间
    formatTime(string) {
      var m = parseInt(string / 60);
      var s = parseInt(string % 60);
      m >= 10 ? m : (m = "0" + m);
      s >= 10 ? s : (s = "0" + s);
      return m + ":" + s;
    },
    //更新进度条
    updateCurrent() {
      this.currentBar == 100
        ? (this.clearTimer(),this.loopStyle == "not"
          ? this.notLoop()
          : this.loopStyle == "list"
          ? this.listLoop()
          : this.loopStyle == "single"
          ? this.singleLoop()
          : this.randomLoop()
          )
        : (this.currentBar =
            (this.$refs.audio.currentTime / this.$refs.audio.duration) * 100),
        (this.currentText = this.formatTime(this.$refs.audio.currentTime)),
        this.$store.commit("setCurrent", this.$refs.audio.currentTime);
    },
    //上一首
    prevSong() {
      let index = this.playList.indexOf(this.songContent);
      let length = this.playList.length;
      index == 0 ? index = length-1 : index--;
      this.$store.commit("setContent", this.playList[index]);
    },
    //下一首
    nextSong() {
      this.loopStyle=="random"?this.randomLoop():this.listLoop()
    },
    //单曲播放
    notLoop() {
      this.playStatus = false;
      this.clearTimer();
    },
    //列表循环
    listLoop() {
      let index = this.playList.indexOf(this.songContent);
      let length = this.playList.length;
      index == length - 1 ? index = 0 : index++;
      this.$store.commit("setContent", this.playList[index]);
    },
    //单曲循环
    singleLoop() {
      this.play();
    },
    //随机播放
    randomLoop() {
      let index = this.playList.indexOf(this.songContent);
      let random = parseInt(Math.random() * this.playList.length);
      while(index==random) {
        random = parseInt(Math.random() * this.playList.length);
      }
      this.$store.commit("setContent", this.playList[random]);
    },
    //设置定时器
    setTimer() {
      this.clearTimer();
      this.Timer = setInterval(this.updateCurrent, 1000);
    },
    //清除定时器
    clearTimer() {
      clearInterval(this.Timer);
      this.Timer = "";
    },
    //从播放列表中移除
    removeSong(obj) {
      this.$store.commit("removeSong", obj);
    },
    minipage(currentPage) {
      let start = (currentPage-1) * this.miniPageSize;
      let end = Math.min(currentPage * this.miniPageSize, this.playList.length);
      this.currentPlayList = this.playList.slice(start, end);
    }
  }
};
</script>

<style scoped>
.play-control {
  position: fixed;
  bottom: 0rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 5rem;
  background: rgba(0, 0, 0, 1);
  opacity: 0.6;
  transition: 0.5s;
  z-index: 999;
}

.play-control:hover {
  background: rgba(0, 0, 0, 1);
  opacity: 0.8;
}

.control-icon {
  color: white;
  padding: 0.5em;
  font-size: 2em;
  opacity: 1;
}

.control-col {
  margin-top: 0.6rem;
}

.play-bar .el-col:last-child {
  margin-left: 0.8em;
  display: flex;
  align-items: center;
}

.el-icon-more,
.el-icon-close {
  cursor: pointer;
}

.play-list-container {
  position: absolute;
  bottom: 5.5rem;
  right: 0.5em;
  margin: auto;
  width: 30rem;
  height: 20rem;
  background: rgba(0, 0, 0, 1);
  border-radius: 0.5rem 0.5rem 0 0;
  color: rgba(0, 0, 0, 1);
  transition: 0.3s;
  border-bottom: 1px solid;
  align-items: middle;
}

.title {
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  background: rgb(100, 100, 100);
  border-radius: 0.5rem 0.5rem 0 0;
  color: #ebeef5
}

.list-title {
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  border-bottom: 1px solid slategray;
  align-items:center;
}

.list-title .el-col,
.play-list .el-col {
  color: #ebeef5;
}

.play-list {
  padding: 0.5rem 0.5em 0.5rem 0.5em;
  border-bottom: 1px solid slategray;
}

.play-list:hover {
  background: rgb(180, 180, 180);
}

.icon {
  font-size: 1rem;
  cursor: pointer;
}

i {
  cursor: pointer;
}

.play-icon {
  color: white;
  transition: 0.3s;
}

.play-icon:hover {
  color: orange;
}

.el-pagination {
  color: #333333;
  font-weight: normal;
}

.mpage {
  margin: 0 auto;
  text-align: center;
}

.left-align {
  margin: 0 auto;
  padding-left: 0.6em;
  text-align: left;
}

.right-align {
  margin-top: 0 auto;
  padding-right: 0.8em;
  text-align: right;
}

.control-concent {
  font-size: 1rem;
  color: white;
}

.el-row {
  flex: 1;
  align-items: flex-start
}

.play-wave {
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
</style>