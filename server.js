const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const Mansion = require('./lib/mansion');

const app = express();

app.use(express.static('public'));

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer });
const mansion = new Mansion();

wsServer.on('connection', (ws, req) => {
	mansion.connect(ws);
});

const port = process.env.SGT_PORT || 3000;

httpServer.listen(port, () => {
	console.log('Listening at http://localhost:%d/', httpServer.address().port);
});
