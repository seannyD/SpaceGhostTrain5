var SGT = window.SGT || {};

SGT.Client = (function() {
	function openWebSocket() {
		var loc = window.location;
		return new WebSocket("ws://" + loc.host + loc.pathname);
	}

	function Client() {
		this.row = 0;
		this.col = 0;
		this.roomColour = 'black';
		this.ws = openWebSocket();
		this.ws.onmessage = this._handleMessage.bind(this);
	}

	Client.prototype.move = function(dir) {
		this._send({ name: 'move': dir: dir });
	};

	Client.prototype._send = function(msg) {
		var msgJson = JSON.stringify(msg);
		this.ws.send(msgJson);
	};

	Client.prototype.setRoom = function(row, col) {
		this.row = row;
		this.col = col;
	}

	Client.prototype.setRoomColour = function(colour) {
		this.roomColour = colour;
	}

	Client.prototype._handleMessage = function(ev) {
		var msg = buildMessageFromJson(ev.data);
		if (msg) {
			msg.apply(this);
		}
	};

	function buildMessageFromJson(json) {
		var cmd = JSON.parse(json);
		switch (cmd.name) {
			case 'move':   return new MoveMessage(cmd);
			case 'colour': return new ColourMessage(cmd);
		}
	}

	function MoveMessage(cmd) {
		this.row = cmd.row;
		this.col = cmd.col;
		this.isFilled = cmd.isFilled;
	}

	MoveMessage.prototype.apply = function(client) {
		client.setRoom(this.row, this.col);
		client.setRoomColour(this.isFilled);
	};

	function ColourMessage(cmd) {
		this.isFilled = cmd.isFilled;
	}

	ColourMessage.prototype.apply = function(client) {
		client.setRoomColour(this.isFilled);
	};

	return Client;
})();
