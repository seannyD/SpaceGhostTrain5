const alphabet = require('./alphabet');

const MAP_WIDTH = 3;
const MAP_HEIGHT = 3;
const SECRET = 'occult';

class Mansion {
	constructor() {
		this.clients = [];
		this.stage = new Stage(this._notifyClientsOfColourChange.bind(this));
	}

	connect(ws) {
		this.clients.push(new Client(ws, this));
	}

	isFilled(room) {
		const letter = SECRET[this.stage];
		return alphabet.isFilled(letter, room.row, room.col);
	}

	_notifyClientsOfColourChange(oldLetter, newLetter) {
		this.clients.forEach((client) => {
			const room = client.room;
			const wasFilled = alphabet.isFilled(oldLetter, room.row, room.col);
			const isFilled = alphabet.isFilled(newLetter, room.row, room.col);
			if (wasFilled !== isFilled) {
				client.handleColourChange(isFilled);
			}
		});
	}
}

class Client {
	constructor(ws, mansion) {
		this.mansion = mansion;
		this.room = chooseRandomRoom();
		this.isAlive = true;
		this.ws = ws;
		this.ws.on('message', this._handleMessage.bind(this));
	}

	setRoom(room) {
		this.room = room;
		this._send({
			name: 'move',
			row: room.row,
			col: room.col,
			filled: this.mansion.isFilled(room)
		});
	}

	handleColourChange(isFilled) {
		this._send({
			name: 'colour',
			isFilled: isFilled
		});
	}

	_handleMessage(msgJson) {
		const req = buildRequestFromJson(msgJson);
		if (req) {
			req.apply(this);
		}
	}

	_send(msg) {
		this.ws.send(JSON.stringify(msg));
	}
}

const DELTA_FOR_DIR = {
	'up':    { row:  1, col:  0 },
	'down':  { row: -1, col:  0 },
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

class Stage {
	constructor(onAdvance) {
		this.stage = 0;
		this.onAdvance = onAdvance;
		this.updateId = this._scheduleNextUpdate();
	}

	getLetter() {
		return SECRET[this.state];
	}

	advance() {
		const nextStage = (this.stage + 1) % SECRET.length;
		const oldLetter = SECRET[this.stage];
		const newLetter = SECRET[nextStage];
		this.stage = nextStage;
		this.updateId = this._scheduleNextUpdate();
		this.onAdvance(oldLetter, newLetter);
	}

	pause() {
		clearTimeout(this.updateId);
		this.updateId = null;
	}

	resume() {
		if (this.updateId !== null) return;
		this.advance();
	}

	_scheduleNextUpdate() {
		const delay = 3e3 + (Math.random() * 2e3);
		setTimeout(this.advance.bind(this), delay);
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
