

var currentStyle = "black";

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

function start(){
	console.log("start");
	setInterval("toggleStyle()", 1000);
}