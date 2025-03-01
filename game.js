let kbRight = false;
let kbLeft = false;
let kbDown = false;
let kbUp = false;
let kbCode = {left: 37, up: 38, right: 39, down: 40};
let Player = {x: 0, y: 0, width: 0, height: 0, angle: 90};
let gameStateType = {stateSplash: 0, stateStart: 1, statePause: 2, stateStop: 3};
let gameState = gameStateType.stateSplash;
let sheet = new Image();

function load() {
	context.font = "48px serif";
	context.textAlign = "center";
	context.textDecoration
	context.fillStyle = "white";

	Player.width = canvas.width / 8;
	Player.height = Player.width;
	Player.x = canvas.width / 2 - (Player.width / 2);
	Player.y = canvas.height - (Player.height / 4 * 3);
	Player.angle = 0;

	//let img = new Image();
	//img.src = "images/ship.png";
	sheet.src = "images/bust_a_move_sheet.png";

	setEvents();
}

function setEvents() {
	if(gameState == gameStateType.stateSplash) {
		canvas.addEventListener("click", splashIO);
		canvas.addEventListener("keydown", splashIO);
	} else {
		document.addEventListener("keydown", keyDown, false); // canvas instead of document ?
		document.addEventListener("keyup", keyUp, false);
		canvas.onmousedown = mouseDown;
		canvas.onmouseover = mouseOver;
	}
}

function splashIO (event) {  // function to start the game when IO is correct
	// check for the correct events
	if(event.type === "click" || (event.type === "keydown" && event.code === "Enter")){
		// remove events
		canvas.removeEventListener("click", splashIO);
		canvas.removeEventListener("keydown", splashIO);
		gameState = gameStateType.stateStart;
		setEvents();
	}
}

function update(dt) {
	checkKeys();
}

function draw(context) {
	if(gameState == gameStateType.stateSplash) {
		context.fillText("Press here with the mouse or enter to Play", canvas.width / 2, canvas.height / 2);
	} else {
		//context.drawImage(img, Player.x, Player.y);
		context.drawImage(sheet, 1, 1545, 64, 64, Player.x, Player.y, Player.width, Player.height);
	}
}

function keyDown(e) {
	e.preventDefault();
	if (e.keyCode == kbCode.left) {
		// Arrow Left
		kbLeft = true;
	}
	if (e.keyCode == kbCode.right) {
		// Arrow Right
		kbRight = true;
	}
	if (e.keyCode == kbCode.down) {
		// Arrow Down
		kbDown = true;
	}
	if (e.keyCode == kbCode.up) {
		// Arrow Up
		kbUp = true;
	}
}

function keyUp(e) {
	e.preventDefault();
	if (e.keyCode == kbCode.left) {
		// Arrow Left
		kbLeft = false;
	}
	if (e.keyCode == kbCode.right) {
		// Arrow Right
		kbRight = false;
	}
	if (e.keyCode == kbCode.down) {
		// Arrow Down
		kbDown = false;
	}
	if (e.keyCode == kbCode.up) {
		// Arrow Up
		kbUp = false;
	}
}

function checkKeys() {
	if(kbRight) {
		Player.x++;
	}
	if(kbLeft) {
		Player.x--;
	}
	if(kbDown) {
		Player.y++;
	}
	if(kbUp) {
		Player.y--;
	}
}

function mouseDown(e) {
	e.preventDefault();
}

function mouseOver(e) {
	e.preventDefault();
}

/*function parseSrpiteSheet() {
	for(var col=0; col<spriteCols; col++){
		for(var row=0; row<spriteRows; row++){
			var sourceX=col*spriteWidth;
			var sourceY=row*spriteHeight;
			// testing: calc a random position to draw this sprite
			// on the canvas
			var canvasX=150+20;
			canvasY+=spriteHeight+5;
			// drawImage with changing source and canvas x/y positions
			context.drawImage(img,
				sourceX,sourceY,spriteWidth,spriteHeight,
				canvasX,canvasY,spriteWidth,spriteHeight
			);
		}
	}
}*/
