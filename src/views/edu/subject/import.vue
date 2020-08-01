<template>
    <div>
      <h1>这是课程分类添加页面</h1>
      <el-form label-width="120px">
        <el-form-item label="信息描述">
          <el-tag type="info">excel模版说明</el-tag>
          <el-tag>
            <i class="el-icon-download"/>
            <a href="/static/Template.xlsx">点击下载模版</a>
          </el-tag>

        </el-form-item>

        <el-form-item label="选择Excel">
          <el-upload
            ref="upload"
            :auto-upload="false"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :disabled="importBtnDisabled"
            :limit="1"
            :action="BASE_API+'/eduService/subject/addSubject'"
            name="file"
            accept="application/vnd.ms-excel,.xlsx">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              :loading="loading"
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  export default {
    name: 'Save',
    data(){
      return{
        BASE_API: process.env.BASE_API, // 接口API地址
        importBtnDisabled: false, // 按钮是否禁用,
        loading: false
      }
    },
    created() {
    },
    methods:{
      submitUpload(){
        this.loading=true;
        this.importBtnDisabled=true;
        this.$refs.upload.submit();

      },
      fileUploadSuccess(){
        this.$message({
          type: 'success',
          message: '添加课程分类成功!'
        })
        this.$router.push("/edu/subject/list")

      },
      fileUploadError(){
        this.$message({
          type: 'error',
          message: '添加课程分类失败!'
        })
      },

    },
  }
</script>

<style scoped>

</style>
