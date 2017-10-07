const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const Mansion = require('./mansion');

const app = express();

app.use(express.static('public'));

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer });
const mansion = new Mansion();

wsServer.on('connection', (ws, req) => {
	mansion.connect(ws);
});

httpServer.listen(3000, () => {
	console.log('Listening at http://localhost:%d/', httpServer.address().port);
});
