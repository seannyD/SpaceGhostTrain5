var SGT = window.SGT || {};

(function() {
	var MAP_WIDTH = 3;
	var MAP_HEIGHT = 3;
	var elements;
	var client;
	var flashIntervalTimer;
	var displayMessageTimer;
	var currentFill = false;

	// It's easier to rotate vidoes by 90 degrees than 270,
	// so this is the position that each video should be in:
	var roomVideoNumbers = [
		["7","4","1",],
		["8","5","2",],
		["9","6","3",]
	];

	var roomMessages = [
		[
			"This room is full of foreboding",
			"You feel alone, almost",
			"The big picture on the wall feels important"
		],
		[
			"You hear a whisper",
			"The table is empty",
			"You call out, only echoes answer"
		],
		[
			"A mirror shows an empty room",
			"Footprints lead east",
			"A book lies on the table. Type a word…"
		]
	];

	function initialize() {
		elements = {
			'introScreen': document.getElementById('IntroScreen'),
			'endScreen': document.getElementById('EndScreen'),
			'room': document.getElementById('room'),
			'message': document.getElementById('message'),
			'password': document.getElementById('password'),
			'map': document.getElementById('map'),
			'videoPrompt': document.getElementById('video-prompt'),
			'video': document.getElementById('video'),
			'videoPlayer': document.getElementById('video-player'),
		};

		client = new SGT.Client({
			roomChanged: handleRoomChange,
			setRoomColour: handleSetRoomColour,
			flash: handleFlash,
			invalidPassword: handleInvalidPassword,
			won: handleWin,
		});

		elements.videoPlayer.addEventListener('ended', videoEnded, false);

		watchPassword();
		watchVideoPrompt();

		// Reveal the body once the CSS has had time to load so that we avoid a
		// flash of unstyled content.
		document.body.style.display = "block";
	}

	function watchPassword() {
		var passwordEl = elements.password;
		passwordEl.onkeyup = function(ev) {
			ev = ev || window.event;
			if (ev.keyCode === 13 && client) {
				client.guessPassword(passwordEl.value);
			}
		}
	}

	function watchVideoPrompt() {
		elements.videoPrompt.onclick = function(ev) {
			ev = ev || window.event;
			playVideo();
		};
	}

	function handleRoomChange(newRoom) {
		setExits(newRoom);
		setPasswordVisibility(newRoom);
		setActiveMapRoom(newRoom);
		setRoomMessage(newRoom);
	}

	function setExits(room) {
		var roomEl = elements.room;
		roomEl.classList.toggle('exit-up',    room.row > 0);
		roomEl.classList.toggle('exit-down',  room.row < MAP_HEIGHT - 1);
		roomEl.classList.toggle('exit-left',  room.col > 0);
		roomEl.classList.toggle('exit-right', room.col < MAP_WIDTH - 1);
	}

	function setPasswordVisibility(room) {
		var passwordEl = elements.password;
		toggleHidden(passwordEl, !isPasswordRoom(room));
	}

	function isPasswordRoom(room) {
		return room.row === 2 && room.col === 2;
	}

	function setActiveMapRoom(room) {
		var roomId = 'map-room-' + room.row + '-' + room.col;
		var room = document.getElementById(roomId);
		clearActiveMapRooms();
		room.classList.add('active');
	}

	function setRoomMessage(room){
		elements.message.innerHTML = roomMessages[room.row][room.col];
	}

	function clearActiveMapRooms() {
		var map = elements.map;
		map.querySelectorAll('.active').forEach(function(el) {
			el.classList.remove('active');
		});
	}

	function handleSetRoomColour(isFilled) {
		// Don't do anything if we're in the middle of flashing.
		if (flashIntervalTimer) return;
		document.body.classList.toggle('filled', isFilled);
	}

	function handleFlash() {
		flashIntervalTimer = setInterval(function() {
			document.body.classList.toggle('filled');
		}, 100);

		setTimeout(function() {
			clearInterval(flashIntervalTimer);
			flashIntervalTimer = null;
			handleSetRoomColour(client.room.isFilled);
		}, 1100);
	}

	function handleInvalidPassword() {
		clearPassword();
		if (isPasswordRoom(client.room)) {
			displayMessage('Nothing happened');
		}
	}

	function handleWin() {
		clearPassword();
		promptVideo();
	}

	function promptVideo() {
		toggleHidden(elements.videoPrompt, false);
	}

	function playVideo() {
		var vidNum = roomVideoNumbers[client.room.row][client.room.col];
		var sources = elements.videoPlayer.getElementsByTagName('source');
		sources[0].src = "videos/"+vidNum+".mp4";
		sources[1].src = "videos/"+vidNum+".ogg";

		elements.videoPlayer.load();
		toggleHidden(elements.video, false);
		toggleHidden(elements.videoPrompt, true);
		elements.videoPlayer.play();
	}

	function videoEnded(){
		toggleHidden(elements.video, true);
		toggleHidden(elements.endScreen, false);
	}

	function startGame() {
		toggleHidden(elements.introScreen, true);
		toggleHidden(elements.endScreen, true);
		toggleHidden(elements.video, true);
	}

	function move(dir) {
		if (!client) return;
		client.move(dir);
	}

	function toggleHidden(el, force) {
		el.classList.toggle('hidden', force);
	}

	function clearPassword() {
		const passwordEl = elements.password;
		passwordEl.value = '';
		passwordEl.blur();
	}

	function displayMessage(msg, timeout) {
		const msgEl = elements.message;
		const prevMsg = msgEl.innerHTML;
		if (timeout === undefined) {
			timeout = 2e3;
		}
		msgEl.innerHTML = msg;
		displayMessageTimer = setTimeout(function() {
			msgEl.innerHTML = prevMsg;
		}, timeout);
	}

	function clearPendingMessageChanges() {
		clearTimeout(displayMessageTimer);
		displayMessageTimer = null;
	}

	SGT.initialize = initialize;
	SGT.startGame = startGame;
	SGT.move = move;
})();
