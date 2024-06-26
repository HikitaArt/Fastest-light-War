class Enemy{
    constructor(){
        this.x = (Math.floor(Math.random() * (9 - 0 + 1)) + 0)*50; 
        this.y = -50;
        this.width = 50;
        this.height = 50;
        this.speed = 1;
    }
    move(){
        this.y +=this.speed;
    }
    drawEnemy(context){
        //context.fillRect(this.x,this.y,this.width,this.height);
        let img = new Image();
        img.src = "sprites/enemyShip.png"
        context.drawImage(img, this.x,this.y);
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    destroy(){
        listOfEnemies.splice(listOfEnemies.indexOf(this),1);
    }
    checkLose(rect, ctx){
        if(this.y >= rect.bottom-100){
            clearInterval(frameUpdate);
            ctx.fillStyle = "red";
            ctx.fillText("GAME OVER", 135, 200);
            ctx.fillStyle = "white";
        }
    }
}
class Bullet{
    constructor(x){
        this.width = 10;
        this.height = 20;
        this.x = x-5;
        this.y = 655;
        this.speed = 2;
    }
    drawBullet(ctx){
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    move(){
        this.y -= this.speed;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    destroy(){
        listOfBullets.splice(listOfBullets.indexOf(this),1);
    }
}
function shipDraw(x, context){
    /*context.beginPath();
    context.moveTo(x-15,690);
    context.lineTo(x,655);
    context.lineTo(15+x,690);
    context.closePath();
    context.fill();*/
    let img = new Image();
    img.src = "sprites/ship.png"
    context.drawImage(img, x-15, 655);
}
function shipMove(event, rect){
    let x = event.clientX - rect.left;
    return x;
}
function clearScreen(context, canvas){
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
}
function changeScore(score){
    divScore.textContent = "score: " + score;
}

let divScore = document.getElementsByClassName("score")[0];
let score = 0;

let canvas = document.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
let screen = canvas.getBoundingClientRect();
ctx.fillStyle = "white";
ctx.font = "bold 36px Arial";

let listOfBullets = new Array();
let listOfEnemies = new Array();

let testEnemy = new Enemy();
listOfEnemies.push(testEnemy);
testEnemy.move();

let x = 0;

canvas.onmousemove = function(event){
    x = shipMove(event, screen);
}

const frameUpdate = setInterval(function(){
    clearScreen(ctx, canvas);
    shipDraw(x, ctx);
    listOfEnemies.forEach(function(enemy){
        enemy.move(ctx);
        enemy.drawEnemy(ctx);
        enemy.checkLose(screen, ctx);
    });
    listOfBullets.forEach(function(bullet){
        bullet.move();
        let bulletX = bullet.getX();
        let bulletY = bullet.getY();
        listOfEnemies.forEach(function(enemy){
            let enemyX = enemy.getX();
            let enemyY = enemy.getY()
            //нарушаю инкапсуляцию
            if ((bulletX+bullet.width >= enemyX && bulletX <= enemyX+enemy.width) && (bulletY<=enemyY+40)){
                bullet.destroy();
                enemy.destroy();
                score++;
                changeScore(score);
            }
        });
        if (bullet.getY() < screen.top-20){
            bullet.destroy();
        }
        bullet.drawBullet(ctx);
    });
}, 5);

const shoot = setInterval(function(){
    listOfBullets.push(new Bullet(x));
},1500);
const spawnEnemy = setInterval(function(){
    listOfEnemies.push(new Enemy());
},2000);