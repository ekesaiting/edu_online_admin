<template>
  <div class="teacher-list">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" ref="teacherQuery">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
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

      <el-table-column prop="name" label="名称" width="80"/>

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="介绍"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
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
  import teacherApi from '@/api/edu/teacher'

  export default {
    name: 'List',
    data() {
      return {
        listLoading: true,
        page: 1,
        size: 8,
        teacherQuery: {
          name: '',
          level: null,
          begin: null,
          end: null
        },
        list: [],
        total: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(page = 1) {
        this.page = page
        this.listLoading = true
        teacherApi.getTeacherListPage(this.page, this.size, this.teacherQuery)
          .then(resp => {
            this.total = resp.data.total
            this.list = resp.data.items
            this.listLoading = false
          })
      },
      resetForm() {
        this.teacherQuery = {}
        this.getList()
      },
      removeDataById(id) {
        this.$confirm('此操作将永久该讲师, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          teacherApi.deleteTeacherById(id)
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

  .teacher-list {

    .el-form-item {
      margin-top: 0;
      margin-bottom: 0;
    }
    .el-form {
      margin: 10px 5px;
    }

  }
</style>
