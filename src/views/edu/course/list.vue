<template>
  <div class="course-list">
    <el-form :inline="true" class="demo-form-inline" ref="courseParams">
      <el-form-item>
        <el-input v-model="courseParams.name" placeholder="课程名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseParams.status" clearable placeholder="课程状态">
          <el-option :value="'Normal'" label="已发布"/>
          <el-option :value="'Draft'" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="courseParams.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList(1)">查询</el-button>
      <el-button type="default" @click="resetForm()">清空</el-button>
    </el-form>
    <!--     表格主体 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="名称" width="240"/>

      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="viewCount" label="观看数" width="80"/>
      <el-table-column prop="buyCount" label="购买数" width="80"/>
      <el-table-column label="操作" width="200" align="center" class-name="actions">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑基础信息</el-button>
          </router-link>
          <router-link :to="'/edu/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑大纲信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">
            删除课程信息
          </el-button>
        </template>
      </el-table-column>


    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="page"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
  import courseApi from '@/api/edu/course'

  export default {
    name: 'List',
    data() {
      return {
        listLoading: true,
        page: 1,
        size: 8,
        list: [],
        total: 0,
        courseParams: {
          name: '',
          status: '',
          begin: null
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.page = page
        this.listLoading = true
        courseApi.getCoursePageConditionList(this.page, this.size, this.courseParams)
          .then(resp => {
            this.total = resp.data.total
            this.list = resp.data.courseList
            this.listLoading = false
          })
      },
      resetForm() {
        this.courseParams = {}
        this.getList()
      },
      removeDataById(id) {
        this.$confirm('此操作将永久删除该课程以及属于该课程的章节与小节信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          courseApi.deleteCourse(id)
            .then(resp => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .course-list {
    .actions {
      .el-button {
        margin: 5px 0;
      }
    }

    .el-form-item {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-form {
      margin: 10px 5px;
    }
  }
</style>
