<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button
        :disabled="btnDisabled"
        type="primary"
        @click="create()">生成</el-button>
    </el-form>

  </div>
</template>

<script>
  import staApi from '@/api/edu/sta'
  export default {
    name: 'create',
    data(){
      return{
        day:null,
        btnDisabled:true,
      }
    },
    watch:{
      day(newValue,oldValue){
        this.btnDisabled = !newValue;
      }
    },
    methods:{
      create(){
        staApi.createStaData(this.day).then(resp=>{
          this.$message({
            type:"success",
            message:"统计数据生成成功"
          })
         this.$router.push("/sta/show");
        })
      }
    }
  }
</script>

<style scoped>

</style>
