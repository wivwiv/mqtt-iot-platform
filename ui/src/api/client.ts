import http from '.';

export function createClient(data: any) {
  return http.post('/client', data);
}

export function findAllClient(query: any) {
  return http.get('/client', {
    params: query,
  });
}

export function createACL(data: any) {
  return http.post('/client/mqtt/acl', data);
}
