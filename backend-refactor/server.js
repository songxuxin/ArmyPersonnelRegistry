const app = require('./app');
const http = require('http');

const port = process.env.port || 2020;
app.set('port', port);
const server = http.createServer(app);

console.log('server started');
server.listen(port);