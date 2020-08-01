<template>
  <div>
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题" style="width: 90%">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="selectOneLevelSubject">
          <el-option
            v-for="onelevelSubject in oneLevelsubjectList"
            :key="onelevelSubject.id"
            :label="onelevelSubject.title"
            :value="onelevelSubject.id">
          </el-option>
        </el-select>
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="twolevelSubject in twoLevelSubjectList"
            :key="twolevelSubject.id"
            :label="twolevelSubject.title"
            :value="twolevelSubject.id"/>

        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介" style="width: 90%">
        <tinymce :height="300" v-model="courseInfo.description" :key="this.$route.fullPath"/>
      </el-form-item>

      <el-form-item label="课程封面">
        <el-upload
          ref="upload"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="fileUploadSuccess"
          :action="BASE_API+'/ossService/uploadCover'"
          name="cover">
          <img :src="courseInfo.cover" alt="" style="width: 400px;height: 200px"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import courseApi from '@/api/edu/course'
  import teacherApi from '@/api/edu/teacher'
  import subjectApi from '@/api/edu/subject'
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'Info',
    components: { Tinymce },
    data() {
      return {
        saveBtnDisabled: false,
        teacherList: [],
        courseInfo: {
          id:'',
          title: '',
          subjectId: '',
          subjectParentId: '',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/defaultCover.jpg',
          price: 0
        },
        oneLevelsubjectList: [],
        twoLevelSubjectList: [],
        BASE_API: process.env.BASE_API
      }
    },
    created() {
      this.init()
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    methods: {
      init() {
        this.getTeacherList()
        this.getSubjectList().then(() => {
          if (this.$route.params && this.$route.params.id) {
            this.getCourseInfo(this.$route.params.id).then(() => {
              for (const subjectElement of this.oneLevelsubjectList) {
                if (subjectElement.id === this.courseInfo.subjectParentId) {
                  this.twoLevelSubjectList = subjectElement.children
                }
              }
            })
          } else {
            this.courseInfo = {
              id:'',
              title: '',
              subjectId: '',
              subjectParentId: '',
              teacherId: '',
              lessonNum: 0,
              description: '',
              cover: '/static/defaultCover.jpg',
              price: 0
            }
          }
        })
      },
      saveOrUpdate() {
        if (this.$route.params && this.$route.params.id) {
          this.updateCourseInfo()
        } else {
          this.saveCourseInfo()
        }
      },
      saveCourseInfo() {
        courseApi.addCourseInfo(this.courseInfo).then(resp => {
          this.$message({
            type: 'success',
            message: '添加课程信息成功!'
          })
          this.$router.push({ path: '/edu/course/chapter/' + resp.data.courseId })
        })

      },
      updateCourseInfo() {
        courseApi.updateCourseInfo(this.courseInfo).then(resp => {
          this.$message({
            type: 'success',
            message: '修改课程信息成功!'
          })
          this.$router.push({ path: '/edu/course/chapter/' + resp.data.courseId })
        })
      },
      async getCourseInfo(id) {
        await courseApi.getCourseInfoById(id).then(resp => {
          this.courseInfo = resp.data.courseInfo
        })
      },
      getTeacherList() {
        teacherApi.getTeacherList().then(resp => {
          this.teacherList = resp.data.items
        })
      },
      async getSubjectList() {
        await subjectApi.getAllSubject().then(resp => {
          this.oneLevelsubjectList = resp.data.items
          /*console.log('执行getSubjectList')
          console.log(this.oneLevelsubjectList)*/
        })
      },
      selectOneLevelSubject(value) {
        this.courseInfo.subjectId = null
        for (const subjectElement of this.oneLevelsubjectList) {
          if (subjectElement.id === value) {
            this.twoLevelSubjectList = subjectElement.children
          }
        }

      },
      beforeUploadHandle(file) {
        const isJpg = file.type === 'image/jpeg'
        const isLt2M = file.size / (1024 * 1024) < 4
        if (!isJpg) {
          this.$message.error('上传的封面必须是JPG格式')
        }
        if (!isLt2M) {
          this.$message.error('上传的封面大小必须小于4M')
        }
        return isJpg && isLt2M
      },
      fileUploadSuccess(resp) {
        this.courseInfo.cover = resp.data.filePath
      }

    }
  }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }

</style>
