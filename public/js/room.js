var currentStyle = "black";
var currentRoomRow = 0;
var currentRoomCol = 1;

var mapWidth = 3;
var mapHeight = 3;

var currentStage = 0;

var gameStageMiddle = false;


var roomMessages = [
	["Room0", "Room1", "Room2"],
	["Room3", "Room4", "Room5"],
	["Room6", "Room7", "Room8"]
]

var password = "occult";
// note: letters will be upside down!
var code = [
  [
	[1,1,1],
	[1,0,1],
	[1,1,1]	
  ],
  [
	[1,1,1],
	[1,0,0],
	[1,1,1]	
  ],
  [
	[1,1,1],
	[1,0,0],
	[1,1,1]	
  ],
  [
	[1,1,1],
	[1,0,0],
	[1,0,1]	
  ],
  [
	[1,1,1],
	[1,0,0],
	[1,0,0]	
  ],
  [
	[0,1,0],
	[0,1,0],
	[1,1,1]	
  ]
];

function showMe(x){
	document.getElementById(x).style.display = 'inline';
}

function hideMe(x){
	document.getElementById(x).style.display = 'none';
}

function startGame(){
	hideMe("IntroScreen");
	hideMe("IntroScreen");

}


// Style functions

function switchToBlack(){
	document.body.style.setProperty('--fg',"white");
	document.body.style.setProperty('--bg',"black");
}

function switchToWhite(){
	document.body.style.setProperty('--fg',"black");
	document.body.style.setProperty('--bg',"white");
}

function toggleStyle(){
	if(currentStyle=="black"){
		currentStyle="white";
		switchToWhite();
	} else{
		currentStyle="black";
		switchToBlack();
	}
}

function setRoomStyle(){
	if(currentStyle=="black"){
		switchToBlack();
	} else{
		switchToWhite();
	}
}

function start(){
	
    var pw = document.getElementById("password");
    pw.onkeyup = function(e){
      // on pressing enter
      if(e.keyCode==13){
      	// if password matches
      	console.log("ENTER");
      	if(pw.value.toLowerCase().replace(/ /g,'')==password){
      		sendWinState();
      		gameStageMiddle = false;
      		document.getElementById("message").innerHTML = "You hear a sound ...";
      	} else{
      		console.log("No match");
      		pw.value = "";
      		pw.blur();
      		document.getElementById("room").focus();
      		document.getElementById("room").blur();
      		document.getElementById("message").innerHTML = "Nothing happened";
      		setTimeout("setMessage()", 2000);
      	}
      }
  	};



	console.log("start");
	//setInterval("toggleStyle()", 1000);
	setRoomColour();

	document.getElementById("IntroScreen").addEventListener("touchend", startGame(), false);
	document.getElementById("CoverImage").addEventListener("touchend", startGame(), false);
	showMe("IntroScreen");
	hideMe("password");
	hideMe("EndScreen");
}

function setCurrentStage(n){
	if(gameStageMiddle){
		currentStage = n;
		setRoomColour();
	}
}

function setRoomColour(){

	console.log("Room: row:"+currentRoomRow+", col:"+currentRoomCol)

	// look up current sytle
	currentStyle = ["white",'black'][code[currentStage][currentRoomRow][currentRoomCol]];
	setRoomStyle();

	if(currentRoomCol>0){
		showMe("exitLeft");
	} else{
		hideMe("exitLeft");
	}

	if(currentRoomCol<(mapWidth-1)){
		showMe("exitRight");
	} else{
		hideMe("exitRight");
	}

	if(currentRoomRow>0){
		showMe("exitDown");
	} else{
		hideMe("exitDown");
	}

	if(currentRoomRow<(mapHeight-1)){
		showMe("exitUp");
	} else{
		hideMe("exitUp");
	}

	setMessage();

	setMapColour();

	if(currentRoomRow == 2 & currentRoomCol==2){
		showMe("password");
	} else{
		hideMe("password");
	}

}

function setMessage(){
	document.getElementById("message").innerHTML = roomMessages[currentRoomRow][currentRoomCol];
}

function setMapColour(){
	for(var i=0;i<mapWidth;++i){
		for(var j=0;j<mapHeight;++j){
			var r = document.getElementById("m"+i+""+j);
			if(i==currentRoomCol & j==currentRoomRow){
				r.style.backgroundColor = "red";
			} else{
				r.style.backgroundColor = "var(--bg)"
			}
		}
	}
}

function move(direction){
	if(direction=="up"){
		if(currentRoomRow<(mapHeight-1)){
			currentRoomRow += 1;
			setRoomColour();
		}
	}
	if(direction=="down"){
		if(currentRoomRow>0){
			currentRoomRow -= 1;
			setRoomColour();
		}
	}
	if(direction=="left"){
		if(currentRoomCol>0){
			currentRoomCol -= 1;
			setRoomColour();
		}
	}
	if(direction=="right"){
		if(currentRoomCol<(mapWidth-1)){
			currentRoomCol += 1;
			setRoomColour();
		}
	}
}	





      

function sendWinState(){
	// overridden by server script
}




function playVideo(){
	// make sure password isn't focussed
	document.getElementById("room").focus();
    document.getElementById("room").blur();
	hideMe("password");
	gameStageMiddle = false;
	showMe("video");
	document.getElementById("videoPlayer").play();
}
