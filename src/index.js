const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

//cria o server
const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);  

  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndPoint = pathname.split('/').filter(Boolean);

  if (splitEndPoint.length > 1) {
    pathname = `/${splitEndPoint[0]}/:id`;
    id = splitEndPoint[1];
  }

  const route = routes.find((routObj) => (
    routObj.endpoint === pathname && routObj.method === request.method
  ));

  if (route) {
    request.query = parsedUrl.query;
    request.params = { id };

    route.handler(request, response);
  } else {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${request.url}`);
  }

  // if (request.url === '/users' && request.method === 'GET'){
  //   UserController.listUsers(request, response);   
  // } else {    
  
  // }

});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));