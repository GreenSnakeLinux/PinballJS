class PinballDisplay {
    constructor(width = 20, scrollSpeed = 200) {
        this.width = width;              // Display width in characters
        this.scrollSpeed = scrollSpeed / 1000;  // Speed in milliseconds
        this.currentText = "";           // Current text to display
        this.position = 0;              // Scroll position
        //this.intervalId = null;         // For animation control
        this.isRunning = false;
        this.textToDraw = "";
        this.scrollTimer = 0;
        
        // Simulated LED character set (simplified)
        this.ledCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-!";
    }

    // Start the display with given text
    start(text) {
        this.currentText = text.toUpperCase();
        this.position = 0; //this.width; // Start with text scrolling in from right
        if (!this.isRunning) {
            this.isRunning = true;
            //this.intervalId = setInterval(() => this.update(), this.scrollSpeed);
        }
    }

    // Stop the display
    stop() {
        //if (this.intervalId) {
            //clearInterval(this.intervalId);
            this.isRunning = false;
            //this.intervalId = null;
        //}
    }

    // Update display state
    update(dt) {
        if (this.isRunning) {

            this.scrollTimer += dt;
            if (this.scrollTimer < this.scrollSpeed)
            {
                return;
            }
            this.scrollTimer = 0;

            //this.position--;
            //this.position = Math.floor(this.position - (dt*0.001));
            this.position++;
            
            // Calculate visible portion of text
            let displayText = "";
            for (let i = 0; i < this.width; i++) {
                const textPos = this.position + i;
                if (textPos >= 0 && textPos < this.currentText.length) {
                    displayText += this.currentText[textPos];
                } else {
                    displayText += " "; // Empty space
                }
            }

            // Simulate LED display output
            //this.render(displayText);
            this.textToDraw = displayText;

            // Reset position when text has fully scrolled out
            /*if (this.position + this.currentText.length < 0) {
                this.position = this.width;
            }*/
            /*if (this.position <= -this.currentText.length) {
                this.position = this.width;
            }*/

            if (this.position > this.width) {
                this.position = -this.currentText.length;
            }
        }
    }

    draw(context) {
        //const canvas = document.getElementById('displayCanvas');
        //const ctx = canvas.getContext('2d');
        //context.clearRect(0, 0, canvas.width, canvas.height);
        //context.font = '20px monospace';
        //context.fillStyle = '#ff0000'; // Red LED color
        context.fillText(this.textToDraw, 10, 120);
    }

    // Render the display (console version)
    draw2(context, text) {
        // Simple LED-style simulation with dots
        let ledLine = "";
        for (let char of text) {
            if (this.ledCharset.includes(char)) {
                ledLine += char + " "; // Space between characters for readability
            } else {
                ledLine += "  "; // Space for unsupported characters
            }
        }
        
        // Clear console and show display (for demo purposes)
        console.clear();
        console.log("╔" + "═".repeat(this.width * 2) + "╗");
        console.log("║" + ledLine.padEnd(this.width * 2) + "║");
        console.log("╚" + "═".repeat(this.width * 2) + "╝");
    }

    // Change text without stopping animation
    /*setText(newText) {
        this.currentText = newText.toUpperCase();
        this.position = this.width; // Reset position for new text
    }*/

    setText(newText) {
        this.currentText = newText.toUpperCase();
        this.position = -this.currentText.length; // Reset to off-screen left
    }
}

// Example usage:
//const display = new PinballDisplay(15, 200); // 15 chars wide, 200ms speed
//display.start("PLAYER 1 SCORE 10000");

// To change text later:
// display.setText("GAME OVER");

// To stop:
// display.stop();