'use babel';

import http from 'http';

export function request(config, data, callback) {
  const host = atom.config.get('improviz.improvizUrl');
  const port = atom.config.get('improviz.improvizPort');

  const options = {
    host,
    port,
    path: config.path,
    method: config.method || 'GET',
  };

  var post_req = http.request(options, (res) => {
    res.setEncoding('utf8');
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk });
    res.on('end', () => {
      callback(JSON.parse(responseData));
    });
  });

  post_req.write(data);
  post_req.end();
}
