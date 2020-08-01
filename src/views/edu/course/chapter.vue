<template>
  <div class="chapter">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="primary" style="margin: 15px 30px" @click="openDialog">添加章节</el-button>

    <div class="chapter-list">
      <el-card  v-for="chapterItem in chapterList" :key="chapterItem.id" >
        <div slot="header" class="chapter-item" >
          <span>{{chapterItem.title}}</span>
          <span class="actions">
                <el-button @click="openVideoDialog(chapterItem.id)">添加课时</el-button>
                <el-button type="primary" @click="editChapter(chapterItem.id)">编辑</el-button>
                <el-button type="danger" @click="deleteChapter(chapterItem.id)">删除</el-button>
            </span>
        </div>
        <div v-for="videoItem in chapterItem.children" :key="videoItem.id" class="video-item">
          <span>{{ videoItem.title }}</span>
          <span class="actions">
          <el-button type="primary" @click="editVideo(videoItem.id)">编辑</el-button>
          <el-button type="danger" @click="deleteVideo(videoItem.id)">删除</el-button>
          </span>
        </div>
      </el-card>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" :title="this.chapter.id?'修改章节':'添加章节'">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" :title="this.video.id?'修改小节':'添加小节'">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree" >
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-upload="beforeUpload"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vodService/uploadVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo" :disabled="videoSaveBtnDisable">确 定</el-button>
      </div>
    </el-dialog>
    <el-form style="text-align: center">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import chapterApi from '@/api/edu/chapter'
  import videoApi from '@/api/edu/video'
  import vodApi from '@/api/edu/vod'

  export default {
    name: 'Chapter',
    data() {
      return {
        saveBtnDisabled: false,
        videoSaveBtnDisable:false,
        chapterList: null,
        courseId: this.$route.params.id,
        dialogChapterFormVisible: false,
        dialogVideoFormVisible: false,
        chapter: {
          id: null,
          title: '',
          sort: null
        },
        video:{
          id: null,
          chapterId:null,
          title: '',
          sort: null,
          isFree:false,
          videoSourceId:null,
          videoOriginalName:null,
        },
        fileList: [],//上传文件列表
        BASE_API: process.env.BASE_API // 接口API地址
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getChapterByCourseId(this.courseId)
      }

    },
    methods: {
      //成功回调
      handleVodUploadSuccess(response, file, fileList) {
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName=file.name;
        this.videoSaveBtnDisable=false;
      },
      //视图上传多于一个视频
      handleUploadExceed(files, fileList) {
        this.$message.warning('重新上传视频，请先删除已上传的视频')
      },
      beforeVodRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      beforeUpload(){
        this.videoSaveBtnDisable=true;
      },
      handleVodRemove(file, fileList) {
        vodApi.deleteVodById(this.video.videoSourceId).then(response=>{
          this.$message({
            type: 'success',
            message: "删除成功"
          })
          this.fileList=[];
          this.video.videoOriginalName=null;
          this.video.videoSourceId=null;
        })
      },
      openVideoDialog(chapterId){
        this.dialogVideoFormVisible=true;
        this.video={};
        this.fileList=[];
        this.video.chapterId=chapterId;
      },

      saveOrUpdateVideo(){
        if (this.video.id){
          this.updateVideo()
        }else{
          this.saveVideo();
        }
      },
      editVideo(videoId){
        videoApi.getVideoByVideoId(videoId).then(resp=>{
          this.dialogVideoFormVisible=true;
          this.video=resp.data.videoInfo;
        })
      },
      deleteVideo(videoId){
        this.$confirm('此操作将永久该小节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          videoApi.deleteVideo(videoId)
            .then(resp => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getChapterByCourseId(this.courseId)
            })
        })
      },
      updateVideo(){
        this.video.courseId = this.courseId
        videoApi.updateVideo(this.video).then(resp=>{
          this.dialogVideoFormVisible = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getChapterByCourseId(this.courseId)
          this.video = {}
        })
      },
      saveVideo (){
        this.video.courseId = this.courseId
        videoApi.addVideo(this.video).then(resp=>{
          this.dialogVideoFormVisible = false
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.getChapterByCourseId(this.courseId)
        })
      },
      deleteChapter(id){
        this.$confirm('此操作将永久该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapterApi.deleteChapter(id)
            .then(resp => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getChapterByCourseId(this.courseId)
            })
        })
      },
      openDialog(){
        this.dialogChapterFormVisible=true;
        this.chapter={};
      },
      saveOrUpdateChapter() {
        if(this.chapter.id){
          this.updateChapter()
        }else{
          this.saveChapter()
        }

      },
      updateChapter(){
        this.chapter.courseId = this.courseId
        chapterApi.updateChapter(this.chapter).then(resp => {
          this.dialogChapterFormVisible = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getChapterByCourseId(this.courseId)
          this.chapter = {}
        })
      },
      saveChapter() {
        this.chapter.courseId = this.courseId
        chapterApi.addChapter(this.chapter).then(resp => {
          this.dialogChapterFormVisible = false
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.getChapterByCourseId(this.courseId)
          this.chapter = {}
        })
      },
      editChapter(chapterId) {
        chapterApi.getChapterByChapterId(chapterId).then(resp => {
          this.dialogChapterFormVisible = true
          this.chapter = resp.data.chapterInfo
        })
      },
      getChapterByCourseId(id) {
        chapterApi.getChapterByCourseId(id).then(resp => {
          this.chapterList = resp.data.chapterList
        })
      },
      previous() {
        this.$router.push({ path: '/edu//course/info/' + this.courseId })
      },
      next() {
        this.$router.push({ path: '/edu/course/publish/' + this.courseId })
      }
    }
  }
</script>

<style scoped lang="scss">
  .chapter {
    .chapter-list {
      .el-card{
        margin: 10px 20px;
      }
      .chapter-item {
        font-size: 20px;
        font-weight: bold;
        border-radius: 5px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .actions {
        justify-self: end;
      }

      .video-item {
        padding: 5px 10px;
        font-size: 20px;
        border-bottom: 1px solid #ccc;
        margin: 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }



    }

  }


</style>
