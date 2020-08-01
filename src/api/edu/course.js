import request from '@/utils/request'

export default {
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduService/course/addCourse`,
      method: 'post',
      data:courseInfo,
    });
  },
  getCourseInfoById(id) {
    return request({
      url: `/eduService/course/${id}`,
      method: 'get',
    });
  },
  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduService/course/update`,
      method: 'put',
      data:courseInfo,
    });
  },
  getCoursePublishInfo(courseId) {
    return request({
      url: `/eduService/course/getCoursePublishInfo/${courseId}`,
      method: 'get',
    });
  },
  publishCourse(courseId) {
    return request({
      url: `/eduService/course/publishCourse/${courseId}`,
      method: 'put',
    });
  },
  getCoursePageConditionList(page,size,coursePageParams){
    return request({
      url: `/eduService/course/pageConditionList/${page}/${size}`,
      method: 'post',
      data:coursePageParams
    });
  },
  deleteCourse(courseId) {
    return request({
      url: `/eduService/course/deleteCourse/${courseId}`,
      method: 'delete',
    });
  },
}
