import request from '@/utils/request'

export default {
  deleteVodById(videoSourceId) {
    return request({
      url: `/vodService/deleteVod/${videoSourceId}`,
      method: 'delete',
    });
  },
}
