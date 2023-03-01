import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getGoOutList(params) {
  return request({
    url: 'http://127.0.0.1:8082/goOut/list',
    method: 'get',
    params
  })
}
