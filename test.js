// Classe Ball équivalente à la classe C++ Ball
class Ball {
    constructor() {
        this.radius = 20;
        this.position = {
            x: 400,  // Position initiale au centre (800/2)
            y: 300   // Position initiale au centre (600/2)
        };
        this.velocity = {
            x: 300,  // Vitesse initiale en pixels par seconde
            y: 200
        };
        this.color = '#3498DB';
    }
	
	update(deltaTime, windowWidth, windowHeight) {
	    // Mise à jour de la position
		this.position.x += this.velocity.x * deltaTime;
		this.position.y += this.velocity.y * deltaTime;
		
        // Collision avec les murs
        if (this.position.x + this.radius > windowWidth) {
            this.position.x = windowWidth - this.radius;
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.x - this.radius < 0) {
            this.position.x = this.radius;
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.radius > windowHeight) {
            this.position.y = windowHeight - this.radius;
            this.velocity.y = -this.velocity.y;
        }
        if (this.position.y - this.radius < 0) {
            this.position.y = this.radius;
            this.velocity.y = -this.velocity.y;
        }
    }

	draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}

// Logique principale
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ball = new Ball();

let lastTime = performance.now();

function gameLoop(currentTime) {
    // Calcul du deltaTime en secondes
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mettre à jour et dessiner la balle
    ball.update(deltaTime, canvas.width, canvas.height);
    ball.draw(ctx);

    // Boucle d'animation
    requestAnimationFrame(gameLoop);
}

// Démarrer l'animation
requestAnimationFrame(gameLoop);