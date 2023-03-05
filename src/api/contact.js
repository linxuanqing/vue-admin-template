import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'http://127.0.0.1:8082/contact/list',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: 'http://127.0.0.1:8082/contact',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'http://127.0.0.1:8082/contact',
    method: 'put',
    data
  })
}

export function deleteData(params) {
  return request({
    url: 'http://127.0.0.1:8082/contact',
    method: 'delete',
    params
  })
}
