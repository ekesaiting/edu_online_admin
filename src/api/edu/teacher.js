import request from '@/utils/request'

export default {
  getTeacherListPage(page,size,techerQuery){
    return request({
      url: `/eduService/teacher/pageConditionList/${page}/${size}`,
      method: 'post',
      data:techerQuery,
    });
  },
  deleteTeacherById(id){
    return request({
      url: `/eduService/teacher/delete/${id}`,
      method: 'delete',
    });
  },
  addTeacher(teacherQuery){
    return request({
      url: `/eduService/teacher/save`,
      method: 'post',
      data:teacherQuery,
    });
  },
  getTeacherById(id){
    return request({
      url: `/eduService/teacher/${id}`,
      method: 'get',
    });
  },
  getTeacherList(){
    return request({
      url: `/eduService/teacher/list`,
      method: 'get',
    });
  },
  updateTeacher(teacherQuery){
    return request({
      url: `/eduService/teacher/update`,
      method: 'put',
      data:teacherQuery,
    });
  },

}


