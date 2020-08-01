import request from '@/utils/request'

export default {
  getChapterByCourseId(courseId) {
    return request({
      url: `/eduService/chapter/getChapterByCourseId/${courseId}`,
      method: 'get',
    });
  },
  addChapter(chapterInfo) {
    return request({
      url: `/eduService/chapter/addChapter`,
      method: 'post',
      data:chapterInfo,
    });
  },
  updateChapter(chapterInfo) {
    return request({
      url: `/eduService/chapter/updateChapter`,
      method: 'put',
      data:chapterInfo,
    });
  },
  deleteChapter(id) {
    return request({
      url: `/eduService/chapter/deleteChapter/${id}`,
      method: 'delete',
    });
  },
  getChapterByChapterId(id) {
    return request({
      url: `/eduService/chapter/${id}`,
      method: 'get',
    });
  },
}
