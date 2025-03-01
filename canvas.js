class Canvas {
    constructor(title, width, height) {
        this._title = title;
        this._width = width;
        this._height = height;
        this._showUnderlay = true;
        this._showOverlay = false;
        
        this.create(width, height);
    }

    create(width, height) {
        // Create canvas element
        this._canvas = document.createElement('canvas');
        this._canvas.width = width;
        this._canvas.height = height;
        document.body.appendChild(this._canvas);
        document.title = this._title;

        // Get 2D context
        this._ctx = this._canvas.getContext('2d');
        if (!this._ctx) {
            throw new Error('Failed to get canvas context');
        }

        // Load underlay and overlay images
        this._underlay = new Image();
        this._overlay = new Image();

        // Promise-based image loading
        Promise.all([
            new Promise((resolve, reject) => {
                this._underlay.onload = resolve;
                this._underlay.onerror = () => reject(new Error('Failed to load underlay image'));
                this._underlay.src = 'assets/underlay.png';
            }),
            new Promise((resolve, reject) => {
                this._overlay.onload = resolve;
                this._overlay.onerror = () => reject(new Error('Failed to load overlay image'));
                this._overlay.src = 'assets/overlay.png';
            })
        ]).catch(error => {
            throw error;
        });
    }

    clear() {
        if (!this._ctx) return;

        this._ctx.fillStyle = "black";
        this._ctx.clearRect(0, 0, this._width, this._height);
        
        if (this._showUnderlay && this._underlay.complete) {
            this._ctx.drawImage(this._underlay, 0, 0, this._width, this._height);
        }
    }

    present() {
        if (!this._ctx) return;

        if (this._showOverlay && this._overlay.complete) {
            this._ctx.drawImage(this._overlay, 0, 0, this._width, this._height);
        }
        // In HTML5 Canvas, present is implicit as drawings are immediately visible
        // No explicit present needed like in SDL
    }

    color(color) {
        if (!this._ctx) return;

        // Assuming color is an object with r, g, b, a properties (0-255 range)
        this._ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
        this._ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
    }

    line(x1, y1, x2, y2) {
        if (!this._ctx) return;

        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.stroke();
    }

    circle(xc, yc, r) {
        if (!this._ctx) return;

        // Using HTML5 Canvas arc method for perfect circle
        this._ctx.beginPath();
        this._ctx.arc(xc, yc, r, 0, 2 * Math.PI);
        this._ctx.stroke();

        // Alternative implementation matching the original Bresenham algorithm:
        /*
        let x = 0;
        let y = r;
        let m = 5 - 4 * r;
        
        while (x <= y) {
            const x1 = xc - x;
            const x2 = xc + x;
            const x3 = xc - y;
            const x4 = xc + y;
            const y1 = yc - y;
            const y2 = yc + y;
            const y3 = yc - x;
            const y4 = yc + x;

            this._ctx.beginPath();
            this._ctx.moveTo(x1, y1);
            this._ctx.lineTo(x2, y1);
            this._ctx.stroke();

            this._ctx.beginPath();
            this._ctx.moveTo(x1, y2);
            this._ctx.lineTo(x2, y2);
            this._ctx.stroke();

            this._ctx.beginPath();
            this._ctx.moveTo(x3, y3);
            this._ctx.lineTo(x4, y3);
            this._ctx.stroke();

            this._ctx.beginPath();
            this._ctx.moveTo(x3, y4);
            this._ctx.lineTo(x4, y4);
            this._ctx.stroke();

            if (m > 0) {
                m -= 8 * --y;
            }
            m += (8 * ++x) + 4;
        }
        */
    }
}

// Example usage:
/*
const canvas = new Canvas('My Canvas', 800, 600);
canvas.color({ r: 255, g: 0, b: 0, a: 255 }); // Red color
canvas.line(0, 0, 100, 100);
canvas.circle(400, 300, 50);
canvas.clear();
canvas.present();
*/