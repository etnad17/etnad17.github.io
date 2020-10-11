const WIDTH = 1400;
const HEIGHT = 800;
const PATICLE_SIZE =7;
const PATICLE_CHANGE_SIZE_SPEED = 0.1;
const PATICLE_CHANGE_SPEED = 0.5;
const ACCELERATON = 0.12;
const DOT_CHANGE_SIZE_SPEED= 0.02;
const DOT_CHANGE_ALPHA = 0.07;

const PATICLE_MIN_SPEED = 10;
const NUMBER_PATICLE_PER_BULLET = 25;

class particle{
    constructor(bullet, deg){
        this.bullet =bullet;
        this.ctx = this.bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PATICLE_SIZE;
        this.speed = Math.random() * 4 + PATICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;
        this.dots = [];

    }

    update(){
        this.speed -= PATICLE_CHANGE_SPEED;
        if (this.speed < 0 ){
            this.speed = 0;
        }

        this.fallSpeed += ACCELERATON;
        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        this.x +=this.speedX;
        this.y +=this.speedY;
        if (this.size > PATICLE_CHANGE_SIZE_SPEED){
            this.size -= PATICLE_CHANGE_SIZE_SPEED;
        }

        if (this.size > 0){
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1,
                size: this.size
            }); 
        }

        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA;
        });
        this.dots = this.dots.filter( dot => {
            return dot.size >0;
        });
        if (this.dots.lenght == 0){
            this.remove();
        }
    }

    remove(){
        this.bullet.particles.splice(this.bullet.particles.indexOf(this),1);
    }

    draw(){
        this.dots.forEach( dot => {
            this.ctx.fillStyle = 'rgba('+this.color+','+dot.alpha+')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x,dot.y,dot.size,0,2*Math.PI);
            this.ctx.fill();
        })
    }
}

class bullet{
    constructor(fireworks){
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT / 2;
        this.color = Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255);
        this.particles = [];
        let bulletDeg = Math.PI * 2 / NUMBER_PATICLE_PER_BULLET;
        for (let i=0; i<NUMBER_PATICLE_PER_BULLET;i++){
        let newParticle = new particle(this, i * bulletDeg);
        this.particles.push(newParticle);
        }
    }
    remove(){
        this.fireworks.bullets.splice(fireworks.bullet.indexOf(this),1);
    }
    update() {
        if (this.particles.length == 0){
            this.remove();
        }
        this.particles.forEach(particle => particle.update());

    }

    draw() {
        this.particles.forEach(particle => particle.draw());

    }


}

class fireworks{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height= HEIGHT;
        document.body.appendChild(this.canvas);
        this.bullets = [];
        setInterval( () => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        },2000)
        

        this.loop();

    }

    loop(){
        this.bullets.forEach( bullet => bullet.update())
        this.draw();
        setTimeout( () => this.loop(), 20);
    }

    clearScreen(){
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0,0,WIDTH,HEIGHT);
    }

    draw(){
        this.clearScreen();
        this.bullets.forEach(bullet => bullet.draw())


    }
}
var f = new fireworks();
