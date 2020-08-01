import request from '@/utils/request'

export default {
  createStaData(day) {
    return request({
      url: `/staService/sta/registerCount/${day}`,
      method: 'post',
    });
  },
  getShowStaData(params) {
    return request({
      url: `/staService/sta/showSta/${params.type}/${params.begin}/${params.end}`,
      method: 'get',
    });
  },
}
