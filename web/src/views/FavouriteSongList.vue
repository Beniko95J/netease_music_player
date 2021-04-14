<template>
  <div>
    <h1>我喜欢的音乐</h1>

    <el-container>
      
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
              <el-button type="text" size="small" @click="remove(scope.row.songId)">取消收藏</el-button>
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
      url: ''
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get('/list');
      console.log(res);
      this.songs = res.data;
    },
    async play(id) {
      console.log(id);
      const res = await axios.get("https://autumnfish.cn/song/url?id=" + id);
      this.url = res.data.data[0].url;
    },
    async remove(id) {
      const res = await this.$http.delete(`/delete/${id}`);
      console.log(res);
      this.$message({
        type: 'success',
        message: '取消收藏成功！'
      });
      this.fetch();
    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style>

</style>