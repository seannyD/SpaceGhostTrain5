

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

function showMe(x){
	document.getElementById(x).style.display = 'inline';
}

function hideMe(x){
	document.getElementById(x).style.display = 'none';
}



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