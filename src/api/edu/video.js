import request from '@/utils/request'

export default {
  addVideo(videoInfo) {
    return request({
      url: `/eduService/video/addVideo`,
      method: 'post',
      data:videoInfo,
    });
  },
  updateVideo(videoInfo) {
    return request({
      url: `/eduService/video/updateVideo`,
      method: 'put',
      data:videoInfo,
    });
  },
  deleteVideo(id) {
    return request({
      url: `/eduService/video/deleteVideo/${id}`,
      method: 'delete',
    });
  },
  getVideoByVideoId(id) {
    return request({
      url: `/eduService/video/${id}`,
      method: 'get',
    });
  },
}
