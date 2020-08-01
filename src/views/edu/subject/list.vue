<template>
  <div>
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="subjects"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
  import  subjectApi from '@/api/edu/subject'
  export default {

    data() {
      return {
        filterText: '',
        subjects: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    created() {
      this.getTree();
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },

    methods: {
      getTree(){
        subjectApi.getAllSubject().then(resp=>{
          this.subjects=resp.data.items;
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    }
  }
</script>
