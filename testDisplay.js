const display = new PinballDisplay(20, 200); // 15 chars wide, 200ms speed

function load() {
    context.font = '120px LED'; // monospace';
    context.fillStyle = '#ff0000'; // Red LED color

    display.start("PLAYER 1 SCORE 10000");

    // To change text later:
    // display.setText("GAME OVER");

    // To stop:
    // display.stop();
}

function update(dt) {
    display.update(dt);
}

function draw(context) {
    display.draw(context);
}
