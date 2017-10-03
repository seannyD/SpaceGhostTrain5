

var currentStyle = "black";
var currentRoomRow = 0;
var currentRoomCol = 0;

var mapWidth = 3;
var mapHeight = 3;

var currentStage = 0;

// note: letters will be upside down!
var code = [
  [
	[1,1,1],
	[0,1,0],
	[0,1,0]	
  ],
  [
	[1,1,1],
	[1,0,1],
	[1,1,1]	
  ],
  [
	[1,0,0],
	[1,0,0],
	[1,1,1]	
  ]
];

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
	console.log("start");
	//setInterval("toggleStyle()", 1000);
	setRoomColour();
}

function setRoomColour(){
	// look up current sytle
	currentStyle = ["white",'black'][code[currentStage][currentRoomRow][currentRoomCol]];
	setRoomStyle();
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