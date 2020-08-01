import request from '@/utils/request'

export default {
  getAllSubject() {
    return request({
      url: `/eduService/subject/list`,
      method: 'get',
    });
  },
}
