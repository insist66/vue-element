import request from '../utils/requst.js';

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

