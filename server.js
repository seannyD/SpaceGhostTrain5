const express = require('express');
const http = require('http');
const WebSocket =  require('ws');

const app = express();

app.use(express.static('public'));

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer });

httpServer.listen(3000, () => {
  console.log('Listening at http://localhost:%d/', httpServer.address().port);
});
