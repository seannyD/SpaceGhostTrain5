class Reaper {
	constructor(interval) {
		this.connections = [];
		this.intervalTimer = setInterval(
			this._onInterval.bind(this), interval || 5e3);
	}

	watch(ws, onClose) {
		const conn = { ws, onClose, alive: true };
		ws.on('pong', () => {
			conn.alive = true;
		});
		this.connections.push(conn);
	}

	_onInterval() {
		this._clearDeadConnections();
		this.connections.forEach((conn) => {
			conn.alive = false;
			conn.ws.ping('', /* mask */ false, /* failSilently */ true);
		});
	}

	_clearDeadConnections() {
		const [dead, alive] = this._pullOutDeadConnections();
		dead.forEach((conn) => {
			conn.ws.terminate();
			conn.onClose();
		});
		this.connections = alive;
	}

	_pullOutDeadConnections() {
		const dead = [];
		const alive = [];
		this.connections.forEach((conn) => {
			(conn.alive ? alive : dead).push(conn);
		});
		return [dead, alive];
	}
}

module.exports = Reaper;
