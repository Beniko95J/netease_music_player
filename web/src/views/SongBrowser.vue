<template>
  <div>
    <h1>发现音乐</h1>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-input v-model="query" placeholder="音乐" @keyup.native.enter="search(query)"></el-input>
      </el-header>
      
      <el-main>
        <el-table :data="songs">
          <el-table-column prop="name" label="歌曲标题" width="240">
          </el-table-column>
          <el-table-column prop="duration" label="时长" width="240">
          </el-table-column>
          <el-table-column prop="artists" label="歌手" width="240">
          </el-table-column>
          <el-table-column prop="album" label="专辑" width="240">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="240">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="play(scope.row.songId)">播放</el-button>
              <el-button type="text" size="small" @click="like(scope.row)">收藏</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer>
        <audio controls autoplay :src="url"></audio>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      songs: [],
      query: '',
      url: ''
    };
  },
  methods: {
    async search(query) {
      const res = await axios.get('https://autumnfish.cn/search?keywords=' + query);
      this.helper(res.data.result.songs);
    },
    async play(id) {
      const res = await axios.get("https://autumnfish.cn/song/url?id=" + id);
      this.url = res.data.data[0].url;
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
    helper(rawData) {
      this.songs = rawData.map(d => {
        return {
          name: d.name,
          duration: d.duration,
          artists: d.artists[0].name,
          album: d.album.name,
          songId: d.id
        }
      })
    }
  }
}
</script>

<style>

</style>