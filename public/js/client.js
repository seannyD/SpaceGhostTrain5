var SGT = window.SGT || {};

(function() {
	function openWebSocket() {
		var loc = window.location;
		return new WebSocket("ws://" + loc.host + loc.pathname);
	}

	function Client(eventHandlers) {
		this.room = { row: 0, col: 0, isFilled: false };
		this.eventHandlers = eventHandlers;
		this.ws = openWebSocket();
		this.ws.onmessage = this._handleMessage.bind(this);
	}

	Client.prototype.move = function(dir) {
		this._send({ name: 'move', dir: dir });
	};

	Client.prototype.guessPassword = function(guess) {
		this._send({ name: 'password', password: guess });
	}

	Client.prototype._send = function(msg) {
		var msgJson = JSON.stringify(msg);
		this.ws.send(msgJson);
	};

	Client.prototype.setRoom = function(room) {
		this.room = room;
		this._emit('roomChanged', room);
	}

	Client.prototype.setRoomColour = function(isFilled) {
		this.room.isFilled = isFilled;
		this._emit('setRoomColour', isFilled);
	}

	Client.prototype.flash = function() {
		this._emit('flash');
	}

	Client.prototype.notifyOfInvalidPassword = function() {
		this._emit('invalidPassword');
	}

	Client.prototype.notifyOfWin = function() {
		this._emit('won');
	}

	Client.prototype._handleMessage = function(ev) {
		var msg = buildMessageFromJson(ev.data);
		if (msg) {
			msg.apply(this);
		}
	};

	Client.prototype._emit = function(eventName) {
		var args = [].slice.call(arguments, 1);
		var handler = this.eventHandlers[eventName];
		if (handler) {
			handler.apply(null, args);
		}
	}

	function buildMessageFromJson(json) {
		var cmd = JSON.parse(json);
		switch (cmd.name) {
			case 'move':   return new MoveMessage(cmd);
			case 'room-state': return new RoomStateMessage(cmd);
			case 'flash': return new FlashMessage(cmd);
			case 'invalid-password': return new InvalidPasswordMessage();
			case 'win': return new WinMessage();
		}
	}

	function MoveMessage(cmd) {
		this.row = cmd.row;
		this.col = cmd.col;
		this.isFilled = cmd.isFilled;
	}

	MoveMessage.prototype.apply = function(client) {
		client.setRoom({ row: this.row, col: this.col });
		client.setRoomColour(this.isFilled);
	};

	function RoomStateMessage(cmd) {
		this.state = cmd.state;
	}

	RoomStateMessage.prototype.apply = function(client) {
		client.setRoomColour(this.state.isFilled);
	};

	function FlashMessage(cmd) {
	}

	FlashMessage.prototype.apply = function(client) {
		client.flash();
	};

	function InvalidPasswordMessage() {
	}

	InvalidPasswordMessage.prototype.apply = function(client) {
		client.notifyOfInvalidPassword();
	}

	function WinMessage() {
	}

	WinMessage.prototype.apply = function(client) {
		client.notifyOfWin();
	}

	SGT.Client = Client;
})();
