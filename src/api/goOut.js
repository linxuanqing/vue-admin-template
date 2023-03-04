import request from '@/utils/request'

export function getGoOutList(params) {
  return request({
    url: 'http://127.0.0.1:8082/goOut/list',
    method: 'get',
    params
  })
}

export function createGoOut(data) {
  return request({
    url: 'http://127.0.0.1:8082/goOut',
    method: 'post',
    data
  })
}

export function updateGoOut(data) {
  return request({
    url: 'http://127.0.0.1:8082/goOut',
    method: 'put',
    data
  })
}

export function goHomeNow(data) {
  return request({
    url: 'http://127.0.0.1:8082/goOut/goHomeNow',
    method: 'post',
    data
  })
}

export function deleteGoOut(params) {
  return request({
    url: 'http://127.0.0.1:8082/goOut',
    method: 'delete',
    params
  })
}
