// Assuming these are defined in a globals.js or similar
const Globals = {
    poly_vertices: 6,
    poly_radius: 50, //350.00, //100,
    poly_omega: 2.09, //0,
    poly_friction: 0, //0.1,
    poly_gravity: 0,
    ball_radius: 20,
    ball_friction: 0.9, //0.25, //0.1,
    ball_gravity: 980, //9806.65, //98,
    
    set_poly_vertices: (v) => { Globals.poly_vertices = Math.max(3, v); },
    set_poly_radius: (r) => { Globals.poly_radius = Math.max(10, r); },
    set_poly_omega: (o) => { Globals.poly_omega = o; },
    set_ball_radius: (r) => { Globals.ball_radius = Math.max(5, r); }
};

const Elements = {
  Edges: 0,
  Bumper1: 1,
  Bumper2: 2,
  Ramp: 3,
  Spring: 4,
  AntiReturn: 5
};

class BouncingBall {
    constructor(width, height) {
        this._title = "Bouncing Ball";
        this._canvas = null;
        this._poly = []; //null;
        this._ball = null;
        this._size = new Vec2f();
        this._center = new Vec2f();
        this._color = new Col4i(0.12, 0.12, 0.12);
        this._dtime = 0.016; // Fixed timestep (approx 60fps)
        this._running = false;
        this.arrowDown = false;
        this.arrowDownRelease = false;

        //this.interval;
        this.lastUpdate = Date.now();

        this.create_canvas(width, height);
        this.create_rect(width, height); // Pinball edges
        this.create_poly(width, height); // Bumper 1
        this.create_poly2(width, height); // Bumper 2
        this.create_ramp(width, height); // Ramp
        this.create_spring(width, height); // Spring
        //this.create_anti_return(width, height); // Ball anti-return on top of ramp => TODO Display only when ball is out of ramp
        this.create_ball(width, height);
        this.start();
    }

    create_canvas(width, height) {
        this._canvas = new Canvas(this._title, width, height);
        this._size = new Vec2f(width, height);
        this._center = this._size.mul(0.5);
    }

    create_rect(width, height) {
        let poly = new Poly(this._center, 4, width / 2, height / 2);
        poly._frozen = true;
        poly._omega = 0;
        poly._friction = new Vec2f(Globals.poly_friction, 0);
        poly._gravity = new Vec2f(0, Globals.poly_gravity);

        this._poly.push(poly);
    }

    create_ramp(width, height) { // Ramp
        let ramp = new Poly(new Vec2f(width - Globals.ball_radius, height), 4, Globals.ball_radius, height * 3 / 4);
        ramp._frozen = true;
        ramp._friction = new Vec2f(Globals.poly_friction, 0);
        ramp._gravity = new Vec2f(0, Globals.poly_gravity);

        this._poly.push(ramp);
    }

    create_anti_return(width, height) { // Anti return
        let anti_return = new Line(new Vec2f(width - (Globals.ball_radius * 2), height * 1 / 4), new Vec2f(width, (height * 1 / 4) - (Globals.ball_radius * 2)));
        anti_return._frozen = true;
        anti_return._friction = new Vec2f(Globals.poly_friction, 0);
        anti_return._gravity = new Vec2f(0, Globals.poly_gravity);

        this._poly.push(anti_return);
    }

    create_spring(width, height) { // Spring
        let spring = new Poly(new Vec2f(width - Globals.ball_radius, height), 4, 4, Globals.ball_radius * 4);
        spring._frozen = true;
        spring._friction = new Vec2f(Globals.poly_friction, 0);
        spring._gravity = new Vec2f(0, Globals.poly_gravity);

        this._poly.push(spring);
    }

    create_poly(width, height) {
        //let poly = new Poly(this._center, Globals.poly_vertices, Globals.poly_radius, Globals.poly_radius);
        let poly = new Poly(new Vec2f(width*3/4 - (Globals.ball_radius) * 2, height*1/4), Globals.poly_vertices, 30, 30); // Globals.poly_radius, Globals.poly_radius);
        poly._frozen = true;
        poly._omega = Globals.poly_omega;
        poly._friction = new Vec2f(Globals.poly_friction, 0);
        poly._gravity = new Vec2f(0, Globals.poly_gravity);

        this._poly.push(poly);
    }

    create_poly2(width, height) {
        //let poly = new Poly(this._center, Globals.poly_vertices, Globals.poly_radius, Globals.poly_radius);
        let poly = new Poly(new Vec2f((Globals.ball_radius) * 2, height*1/4), Globals.poly_vertices, 30, 30); // Globals.poly_radius, Globals.poly_radius);
        poly._frozen = true;
        poly._omega = Globals.poly_omega;
        poly._friction = new Vec2f(Globals.poly_friction, 0);
        poly._gravity = new Vec2f(0, Globals.poly_gravity);

        this._poly.push(poly);
    }

    create_ball(width, height) {
        //this._ball = new Ball(this._center, Globals.ball_radius);
        this._ball = new Ball(new Vec2f(width-Globals.ball_radius, this._center.y), Globals.ball_radius);
        this._ball._friction = new Vec2f(Globals.ball_friction, Globals.ball_friction);
        this._ball._gravity = new Vec2f(0, Globals.ball_gravity);
    }

    toggle_underlay() {
        this._canvas._showUnderlay = !this._canvas._showUnderlay;
    }

    toggle_overlay() {
        this._canvas._showOverlay = !this._canvas._showOverlay;
    }

    set_poly_vertices(poly_vertices) {
        Globals.set_poly_vertices(poly_vertices);
        this.create_poly();
    }

    set_poly_radius(poly_radius) {
        Globals.set_poly_radius(poly_radius);
        //this._poly._radius = Globals.poly_radius;
    }

    set_poly_omega(poly_omega) {
        Globals.set_poly_omega(poly_omega);
        //this._poly._omega = Globals.poly_omega;
    }

    set_ball_radius(ball_radius) {
        Globals.set_ball_radius(ball_radius);
        this._ball._radius = Globals.ball_radius;
    }

    resized(width, height) {
        this._canvas._canvas.width = width;
        this._canvas._canvas.height = height;
        this._size = new Vec2f(width, height);
        const center = this._size.mul(0.5);
        const delta = center.sub(this._center);
        this._center = center;
        //this._poly._position = this._poly._position.add(delta);
        this._poly.forEach((item, index, array) => { //function (item, index, array) {
            item._position = item._position.add(delta); // TODO To debug: Seems OK
            //this._poly[index]._position = this._poly[index]._position.add(delta);
        });
        this._ball._position = this._ball._position.add(delta);
    }

    update(dt) {
        //this._poly.update(dt);
        this._ball.update(dt);
        //this._ball.collide(this._poly);

        this._poly.forEach((item, index, array) => { //function (item, index, array) {
            item.update(dt);
            this._ball.collide(item);
        });

        if(this.arrowDown) {
            this.arrowDown = false;
            let spring = this._poly[Elements.Spring];
            if(spring._radiusY > 0) {
                spring._radiusY -= dt*100*4; //4;
                spring.updateVertices();
            } else if(spring._radiusY != 0) {
                spring._radiusY = 0;
                spring.updateVertices();
            }
        }

        if(this.arrowDownRelease) {
            let spring = this._poly[Elements.Spring];
            if( spring._radiusY < Globals.ball_radius * 4) {
                spring._omega = 2.09; // TODO play with value
                spring._friction = 0; // TODO play with value
                spring._radiusY += dt*100*4; //4;
                spring.updateVertices();
            } else if( spring._radiusY != Globals.ball_radius * 4) {
                spring._omega = Globals.poly_omega;
                spring._friction = Globals.poly_friction; // Reset value to default
                spring._radiusY = Globals.ball_radius * 4; // Reset value to default
                spring.updateVertices();
                this.arrowDownRelease = false;
            } else {
                spring._omega = Globals.poly_omega; // Reset value to default
                spring._friction = Globals.poly_friction; // Reset value to default
                this.arrowDownRelease = false;
            }
        }
    }

    render0() {
        let color = new Col4i(1.00, 0.39, 0.39);
        this._canvas.color(color);
        this._canvas.present();
        //this._canvas.circle(200, 200, 100);
        //this._ball.render(this._canvas);
        this._canvas.circle(Math.floor(this._center.x), Math.floor(this._center.y), Globals.ball_radius);
    }

    render() {
        this._canvas.color(this._color);
        //this._canvas.clear();
        this._canvas.present();
        this._poly.forEach((item, index, array) => { //function (item, index, array) {
            item.render(this._canvas);
        });
        //this._poly.render(this._canvas);
        this._ball.render(this._canvas);
    }

    start() {
        this._running = true;
        const animate = () => {
            if (!this._running) return;

            let currentDate = Date.now();
            this._dtime = (currentDate - this.lastUpdate) / 1000;
            this.lastUpdate = currentDate;

            this.update(this._dtime);
            this._canvas.clear();
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
        //this.interval  = setInterval(animate, 1000 / 60);

        // Event listeners
        window.addEventListener('resize', () => {
            this.resized(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            this.on_key_press(event);
        });

        document.addEventListener('keyup', (event) => {
            event.preventDefault();
            this.on_keyup_press(event);
        });

        this._canvas._canvas.addEventListener('mousemove', (event) => {
			event.preventDefault();
            this.on_mouse_motion(event);
        });

        this._canvas._canvas.addEventListener('mousedown', (event) => {
			event.preventDefault();
            this.on_mouse_button_press(event);
        });

        this._canvas._canvas.addEventListener('mouseup', (event) => {
			event.preventDefault();
            this.on_mouse_button_release(event);
        });

        this._canvas._canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
			this.on_mouse_wheel(event);
        }, { passive: false });
    }

    quit() {
        this._running = false;
    }

    on_key_press(event) {
        const mods = event.shiftKey ? 'shift' : '';

        switch (event.key) {
            case 'h':
                this.toggle_overlay();
                break;
            case 'u':
                this.toggle_underlay();
                break;
            case 'r':
                //this.create_poly();
                //this.create_ball();
                break;
            case 'q':
            case 'Escape':
                this.quit();
                break;
            case 'ArrowUp':
                //this.set_poly_vertices(Globals.poly_vertices + 1);
                break;
            case 'ArrowDown':
                //this.set_poly_vertices(Globals.poly_vertices - 1);
                // Compress spring to launch ball in ramp
                this.arrowDown = true;
                break;
            case 'ArrowLeft':
                {
                    const value = 1.5 * this._dtime;
                    //this.set_poly_omega(this._poly._omega - (mods ? 2.0 * value : value));
                }
                break;
            case 'ArrowRight':
                {
                    const value = 1.5 * this._dtime;
                    //this.set_poly_omega(this._poly._omega + (mods ? 2.0 * value : value));
                }
                break;
            default:
                // Show key pressed value
                //console.log(event.key);
                break;
        }
    }

    on_keyup_press(event) {
        switch (event.key) {
            case 'ArrowDown':
                // Release spring to launch ball in ramp
                this.arrowDownRelease = true;
                break;
        }
    }

    on_mouse_motion(event) {
        const mods = event.shiftKey ? 'shift' : '';
        if (event.buttons & 1) { // Left mouse button
            if (mods) {
                this._ball._position = new Vec2f(event.offsetX, event.offsetY);
                this._ball._velocity = new Vec2f(event.movementX * 50, event.movementY * 50);
                this._ball._frozen = true;
                //this._poly._frozen = false;
            } else {
                //this._poly._position = new Vec2f(event.offsetX, event.offsetY);
                //this._poly._velocity = new Vec2f(0, 0);
                //this._poly._frozen = false;
                this._ball._frozen = false;
            }
        }
    }

    on_mouse_button_press(event) {
        const mods = event.shiftKey ? 'shift' : '';
        if (event.button === 0) { // Left button
            if (mods) {
                this._ball._position = new Vec2f(event.offsetX, event.offsetY);
                this._ball._velocity = new Vec2f(0, 0);
                this._ball._frozen = true;
                //this._poly._frozen = false;
            } else {
                //this._poly._position = new Vec2f(event.offsetX, event.offsetY);
                //this._poly._velocity = new Vec2f(0, 0);
                //this._poly._frozen = false;
                this._ball._frozen = false;
            }
        }
    }

    on_mouse_button_release(event) {
        if (event.button === 0) { // Left button
            //this._poly._frozen = false;
            this._ball._frozen = false;
        }
    }

    on_mouse_wheel(event) {
        const mods = event.shiftKey ? 'shift' : '';
        if (mods) {
            this.set_ball_radius(this._ball._radius + (event.deltaY * 100 * this._dtime));
        } else {
            //this.set_poly_radius(this._poly._radius + (event.deltaY * 100 * this._dtime));
        }
    }
}

// Usage:
//const app = new BouncingBall(1920, 1080);
const app = new BouncingBall(300, 400);