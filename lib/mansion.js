const WebSocket = require('ws');

const alphabet = require('./alphabet');

const MAP_WIDTH = 3;
const MAP_HEIGHT = 3;
const SECRET = 'occult#';
const SECRET_MATCH = SECRET.replace("#",'');

class Mansion {
	constructor() {
		this.clients = [];
		this.stage = new Stage(this._notifyClientsOfColourChange.bind(this));
	}

	connect(ws) {
		this.clients.push(new Client(ws, this));
	}

	submitPassword(guess) {
		if (guess === SECRET_MATCH) {
			this._notifyClientsOfWin();
			return true;
		}
		return false;
	}

	isFilled(room) {
		const letter = this.stage.getLetter();
		var fill = alphabet.isFilled(letter, room.row, room.col);
		var flash = letter=="#";
		return {isFilled : alphabet.isFilled(letter, room.row, room.col),
				flash : flash};
	}

	_notifyClientsOfColourChange(oldLetter, newLetter) {
		this.clients.forEach((client) => {
			const room = client.room;
			const wasFilled = alphabet.isFilled(oldLetter, room.row, room.col);
			const isFilled = alphabet.isFilled(newLetter, room.row, room.col);
			var flash = newLetter=="#";
			if ((wasFilled !== isFilled) || flash) {
				client.sendColourChange(isFilled, flash);
			}
		});
	}

	_notifyClientsOfWin() {
		this.clients.forEach((client) => {
			client.sendWin();
		});
	}
}

class Client {
	constructor(ws, mansion) {
		this.mansion = mansion;
		this.room = null;
		this.isAlive = true;
		this.ws = ws;
		this.ws.on('message', this._handleMessage.bind(this));
		this.setRoom(chooseRandomRoom());
	}

	setRoom(room) {
		this.room = room;
		var roomDetails = this.mansion.isFilled(room);

		this._send({
			name: 'move',
			row: room.row,
			col: room.col,
			isFilled: roomDetails.isFilled,
			flash: roomDetails.flash
		});
	}

	guessPassword(guess) {
		const correct = this.mansion.submitPassword(guess);
		if (!correct) {
			this._send({ name: 'invalid-password' });
		}
	}

	sendColourChange(isFilled, flash) {
		this._send({
			name: 'colour',
			isFilled: isFilled,
			flash: flash
		});
	}

	sendWin() {
		this._send({ name: 'win' });
	}

	_handleMessage(msgJson) {
		const req = buildRequestFromJson(msgJson);
		if (req) {
			req.apply(this);
		}
	}

	_send(msg) {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(msg));
		}
	}
}

function buildRequestFromJson(json) {
	const msg = JSON.parse(json);
	if (!msg) return;
	switch (msg.name) {
		case 'move': return new MoveRequest(msg);
		case 'password': return new PasswordAttempt(msg);
	}
}

const DELTA_FOR_DIR = {
	'up':    { row: -1, col:  0 },
	'down':  { row:  1, col:  0 },
	'left':  { row:  0, col: -1 },
	'right': { row:  0, col:  1 },
};

class MoveRequest {
	constructor(msg) {
		this.delta = DELTA_FOR_DIR[msg.dir];
	}

	apply(client) {
		if (!this.delta) return;
		const newRow = client.room.row + this.delta.row;
		const newCol = client.room.col + this.delta.col;
		if (isValidRow(newRow) && isValidCol(newCol)) {
			client.setRoom({ row: newRow, col: newCol });
		}
	}
}

class PasswordAttempt {
	constructor(msg) {
		this.enteredPassword = normalizePassword(msg.password);
	}

	apply(client) {
		client.guessPassword(this.enteredPassword);
	}
}

function normalizePassword(password) {
	if (!password) password = '';
	return password.toLowerCase()
		.replace(/\s/g, '')
		.replace(/0/g, 'o')
		.replace(/1/g, 'l');
}

class Stage {
	constructor(onAdvance) {
		this.stage = 0;
		this.onAdvance = onAdvance;
		this.updateId = null;
		this._scheduleNextUpdate();
	}

	getLetter() {
		return SECRET[this.stage];
	}

	advance() {
		const nextStage = (this.stage + 1) % SECRET.length;
		const oldLetter = SECRET[this.stage];
		const newLetter = SECRET[nextStage];
		this.stage = nextStage;
		this.onAdvance(oldLetter, newLetter);
		this._scheduleNextUpdate();
	}

	pause() {
		if (!this.updateId) return;
		clearTimeout(this.updateId);
		this.updateId = null;
	}

	resume() {
		if (this.updateId !== null) return;
		this.advance();
	}

	_scheduleNextUpdate() {
		const delay = 3e3 + (Math.random() * 2e3);
		this.updateId = setTimeout(this.advance.bind(this), delay);
	}
}

function isValidRow(row) {
	return inRange(row, 0, MAP_HEIGHT - 1);
}

function isValidCol(col) {
	return inRange(col, 0, MAP_WIDTH - 1);
}

function inRange(x, min, max) {
	return x >= min && x <= max;
}

function chooseRandomRoom() {
	const row = randInt(0, MAP_HEIGHT - 1);
	const col = randInt(0, MAP_WIDTH - 1);
	return { row, col };
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Mansion;
