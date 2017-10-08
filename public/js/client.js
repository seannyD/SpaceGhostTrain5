var SGT = window.SGT || {};

(function() {
	function openWebSocket() {
		var loc = window.location;
		return new WebSocket("ws://" + loc.host + loc.pathname);
	}

	function Client(eventHandlers) {
		this.room = { row: 0, col: 0 };
		this.roomColour = 'black';
		this.eventHandlers = eventHandlers;
		this.ws = openWebSocket();
		this.ws.onmessage = this._handleMessage.bind(this);
	}

	Client.prototype.move = function(dir) {
		this._send({ name: 'move', dir: dir });
	};

	Client.prototype._send = function(msg) {
		var msgJson = JSON.stringify(msg);
		this.ws.send(msgJson);
	};

	Client.prototype.setRoom = function(room) {
		this.room = room;
		this._emit('roomChanged', room);
	}

	Client.prototype.setRoomColour = function(isFilled) {
		this.isFilled = isFilled;
		this._emit('colourChanged', isFilled);
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
			case 'colour': return new ColourMessage(cmd);
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

	function ColourMessage(cmd) {
		this.isFilled = cmd.isFilled;
	}

	ColourMessage.prototype.apply = function(client) {
		client.setRoomColour(this.isFilled);
	};

	var MAP_WIDTH = 3;
	var MAP_HEIGHT = 3;
	var elements;
	var client;

	function start() {
		elements = {
			'room': document.getElementById('room'),
			'map': document.getElementById('map')
		};

		client = new Client({
			roomChanged: handleRoomChange,
			colourChanged: handleColourChange,
		});
	}

	function handleRoomChange(newRoom) {
		setExits(newRoom);
		setActiveMapRoom(newRoom);
	}

	function setExits(room) {
		var roomEl = elements.room;
		roomEl.classList.toggle('exit-up',    room.row > 0);
		roomEl.classList.toggle('exit-down',  room.row < MAP_HEIGHT - 1);
		roomEl.classList.toggle('exit-left',  room.col > 0);
		roomEl.classList.toggle('exit-right', room.col < MAP_WIDTH - 1);
	}

	function setActiveMapRoom(room) {
		var roomId = 'map-room-' + room.row + '-' + room.col;
		var room = document.getElementById(roomId);
		clearActiveMapRooms();
		room.classList.add('active');
	}

	function clearActiveMapRooms() {
		var map = elements.map;
		map.querySelectorAll('.active').forEach(function(el) {
			el.classList.remove('active');
		});
	}

	function handleColourChange(isFilled) {
		document.body.classList.toggle('filled', isFilled);
	}

	function move(dir) {
		if (client) {
			client.move(dir);
		}
	}

	SGT.start = start;
	SGT.move = move;
})();
