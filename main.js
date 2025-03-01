let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let interval;
let lastUpdate;

function run() {
	let currentDate = Date.now();
	let dt = (currentDate - lastUpdate) / 1000;
	lastUpdate = currentDate;
	update(dt);
	context.clearRect(0, 0, canvas.width, canvas.height);
	draw(context);
}

function init() {
	load();
	lastUpdate = Date.now();
	interval  = setInterval(run, 1000 / 60);
}

init();