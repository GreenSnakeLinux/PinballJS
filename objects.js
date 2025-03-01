class Vec2f {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) { return new Vec2f(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vec2f(this.x - v.x, this.y - v.y); }
    mul(s) { return new Vec2f(this.x * s, this.y * s); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    length() { return Math.sqrt(this.dot(this)); }
    normalize() {
        const len = this.length();
        return len > 0 ? new Vec2f(this.x / len, this.y / len) : new Vec2f();
    }
    perpendicular() { return new Vec2f(-this.y, this.x); }
}

// Assuming Col4i is a color class with r,g,b,a components from 0-1
class Col4i {
    constructor(r, g, b, a = 1) {
        this.r = Math.floor(r * 255);
        this.g = Math.floor(g * 255);
        this.b = Math.floor(b * 255);
        this.a = Math.floor(a * 255);
    }
}

class Object {
    constructor(position, color) {
        this._position = new Vec2f(position.x, position.y);
        this._velocity = new Vec2f();
        this._friction = new Vec2f();
        this._gravity = new Vec2f();
        this._color = color;
        this._frozen = false;
    }
}

class Poly extends Object {
    constructor(position, vertices, radius) {
        super(position, new Col4i(1.00, 1.00, 1.00));
        this._vertices = new Array(vertices).fill().map(() => new Vec2f());
        this._radius = radius;
        this._omega = 0;
        this._angle = 0;
        this.update(0); // Initialize vertices positions
    }

    update(dt) {
        const m_2pi = 2 * Math.PI;

        if (!this._frozen) {
            this._velocity = this._velocity.add(this._gravity.mul(dt));
            this._position = this._position.add(this._velocity.mul(dt));
            this._velocity = this._velocity.mul((new Vec2f(1, 1).sub(this._friction.mul(dt))).x);
            this._angle += this._omega * dt;
            
            while (this._angle >= m_2pi) this._angle -= m_2pi;
            while (this._angle <= -m_2pi) this._angle += m_2pi;

            this._vertices.forEach((vertex, index) => {
                const angle = this._angle + (index * (m_2pi / this._vertices.length));
                vertex.x = this._position.x + (this._radius * Math.cos(angle));
                vertex.y = this._position.y + (this._radius * Math.sin(angle));
            });
        }
    }

    render(canvas) {
        canvas.color(this._color);
        let prev = this._vertices[this._vertices.length - 1];
        for (const vertex of this._vertices) {
            canvas.line(Math.floor(prev.x), Math.floor(prev.y), 
                       Math.floor(vertex.x), Math.floor(vertex.y));
            prev = vertex;
        }
    }

    // Iterator to allow for-of loops
    *[Symbol.iterator]() {
        yield* this._vertices;
    }

    // For rbegin() equivalent
    rbegin() {
        return this._vertices[this._vertices.length - 1];
    }
}

class Ball extends Object {
    constructor(position, radius) {
        super(position, new Col4i(1.00, 0.39, 0.39));
        this._radius = radius;
    }

    update(dt) {
        if (!this._frozen) {
            this._velocity = this._velocity.add(this._gravity.mul(dt));
            this._position = this._position.add(this._velocity.mul(dt));
            this._velocity = this._velocity.mul(((new Vec2f(1, 1)).sub(this._friction.mul(dt))).x);
			//console.log("this._velocity: " + this._velocity.x + " / " + this._velocity.y);
        }
    }

    render(canvas) {
        canvas.color(this._color);
        canvas.circle(Math.floor(this._position.x), Math.floor(this._position.y), this._radius);
    }

    collide(poly) {
        const epsilon = Number.EPSILON;

        const process = (A, B, C, R) => {
            const AB = B.sub(A);
            const AC = C.sub(A);
            const AB2 = AB.dot(AB);

            if (AB2 !== 0) {
                const t = AC.dot(AB) / AB2;
                if (t >= 0 && t <= 1) {
                    const P = A.add(AB.mul(t));
                    const PC = C.sub(P);
                    const PC_length = PC.length() + epsilon;
                    if (PC_length <= R) {
                        const normal = PC.normalize();
                        const ball_velocity = this._velocity;
                        const poly_velocity = P.sub(poly._position).perpendicular().mul(poly._omega);
                        const relative_velocity = ball_velocity.sub(poly_velocity);
                        if (relative_velocity.dot(normal) < 0) {
                            this._velocity = this.reflect(relative_velocity, normal).add(poly_velocity);
                            this._position = this._position.add(normal.mul(R - PC_length));
                        }
                    }
                }
            }
        };

        let prev = poly.rbegin();
        for (const vertex of poly) {
            process(prev, vertex, this._position, this._radius);
            prev = vertex;
        }
    }

    reflect(v, n) {
        // Reflection: v - 2 * (v · n) * n
        const dot = v.dot(n);
        return v.sub(n.mul(2 * dot));
    }
}

// Example usage:
/*
const canvas = new Canvas('Test', 800, 600);
const poly = new Poly(new Vec2f(400, 300), 6, 100);
const ball = new Ball(new Vec2f(200, 200), 20);
ball._gravity = new Vec2f(0, 98); // Some gravity

function animate() {
    canvas.clear();
    poly.update(0.016);
    ball.update(0.016);
    ball.collide(poly);
    poly.render(canvas);
    ball.render(canvas);
    canvas.present();
    requestAnimationFrame(animate);
}
animate();
*/