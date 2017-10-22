var SGT = window.SGT || {};

(function() {
	var MAP_WIDTH = 3;
	var MAP_HEIGHT = 3;
	var elements;
	var client;
	var clearMessageTimer;

	// It's easier to rotate vidoes by 90 degrees than 270,
	// so this is the position that each video should be in:
	var roomVideoNumbers = [
		["7","4","1",],
		["8","5","2",],
		["9","6","3",]
		];

	function initialize() {
		elements = {
			'introScreen': document.getElementById('IntroScreen'),
			'endScreen': document.getElementById('EndScreen'),
			'room': document.getElementById('room'),
			'message': document.getElementById('message'),
			'password': document.getElementById('password'),
			'map': document.getElementById('map'),
			'video': document.getElementById('video'),
			'videoPlayer': document.getElementById('video-player'),
		};

		client = new SGT.Client({
			roomChanged: handleRoomChange,
			colourChanged: handleColourChange,
			invalidPassword: handleInvalidPassword,
			won: handleWin,
		});

		elements.videoPlayer.addEventListener('ended',videoEnded,false);

		watchPassword();
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

	function handleRoomChange(newRoom) {
		setExits(newRoom);
		setPasswordVisibility(newRoom);
		setActiveMapRoom(newRoom);
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
		console.log(room.row + " "+room.col);
		return room.row === 2 && room.col === 2;
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

	function handleInvalidPassword() {
		clearPassword();
		if (isPasswordRoom(client.room)) {
			flashMessage('Nothing happened');
		}
	}

	function handleWin() {
		clearPassword();
		playVideo();
	}

	function playVideo() {
		// the video that relates to the room
		var vidNum = roomVideoNumbers[client.room.row][client.room.col];
		// change the video source
		var video = elements.videoPlayer;
		var sources = video.getElementsByTagName('source');
    	sources[0].src = "videos/"+vidNum+".mp4";
    	sources[1].src = "videos/"+vidNum+".ogg";

    	// Load the video and show it
    	video.load();
    	// elements.video is the surrounding div for the player
    	document.getElementById("video").style.display="inline";
    	video.play();
	}

	function videoEnded(){
		toggleHidden(elements.video, true);
		toggleHidden(elements.endScreen, false);
		// TODO: Disconnect from server?
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

	function flashMessage(msg, timeout) {
		const msgEl = elements.message;
		const prevMsg = msgEl.innerHTML;
		if (timeout === undefined) {
			timeout = 2e3;
		}
		msgEl.innerHTML = msg;
		clearMessageTimer = setTimeout(function() {
			msgEl.innerHTML = prevMsg;
		}, timeout);
	}

	function clearPendingMessageChanges() {
		clearTimeout(clearMessageTimer);
		clearMessageTimer = null;
	}

	SGT.initialize = initialize;
	SGT.startGame = startGame;
	SGT.move = move;
})();
