/*
TODO:
figure out how to get map vectors to correspond with enemy movements
towers shoot
*/
"use strict";
var canv, ctx;
var enemy = [],
    wave = 0,
    spawning = [],
    spawnTimer = 20;
var baseHealth = 10, 
    money = 100,
    towers = [],
    shots = [],
    gameOver = false;


var cMap = maps[0]; //this will be random later

function keyTyped(){
    switch(key){
        case '1':
            defense(0);
            break;
        case '2':
            defense(1);
            break;
    }
}

function setup() {
    createCanvas(400, 450);
    canv = document.getElementById('defaultCanvas0');
    ctx = canv.getContext('2d');
    enemy.push(new Enemy(1));
}

function draw() {
    background(0);
    if(gameOver){
        fill(255);
        textSize(50);
        text('Game Over', 100, 200);
        return;
    }
    
    //draw map
    push();
    noFill();
    strokeWeight(20);
    stroke(150, 255,150);
    beginShape();
    for(let i = 0; i < cMap.length; i++){
        vertex(cMap[i][0], cMap[i][1]);
    }
    endShape();
    pop();
    
    //store
    push();
    fill(150);
    rect(0, 400, 400, 50);
    //text
    fill(0);
    textSize(12);
    text(`lives: ${baseHealth}\nmoney: ${money}\nwave: ${wave}`, 5, 415);
    pop();
    //towers
    fill(0, 0, 255);
    rect(100, 400, 50, 50);
    fill(255);
    text('1\nbasic\n$10', 110, 415);
    fill(0, 255, 0);
    rect(150, 400, 50, 50);
    fill(255);
    text('2\nrapid\n$50');

    //spawn enemies
    if(spawning.length > 0 && (spawnTimer == 0 || enemy.length == 0)){
        enemy.push(spawning[0]);
        spawning.shift();
        spawnTimer = 20;
    }
    spawnTimer--;
    
    //towers
    for(let i = 0; i < towers.length; i++){
        let obj = towers[i];
        //draw
        push();
        if(obj.name == 'basic'){
        fill(0, 0, 255);
        circle(obj.x, obj.y, 20);
        } else if(obj.name == 'rapid'){
            fill(0, 255, 0);
            circle(obj.x, obj.y, 20);
        }
        
        pop();
        
        //shoot
        if(towers[i].timer == 0){
            shoot(towers[i].x, towers[i].y, towers[i].damage, towers[i].fireRate);
            towers[i].timer = towers[i].fireRate;
        }
        towers[i].timer--;
    }
    //shots
    for(let i = shots.length - 1; i > 0; i--){
        //render
        fill(255, 0, 0);
        circle(shots[i].x, shots[i].y, 5);

        //move
        shots[i].x += shots[i].xv / 500;
        shots[i].y += shots[i].yv / 500;

        //timer
        if(shots[i].time == 0){
            shots.splice(i, 1);
        }
        shots[i].time--;
    }
    
    //calls the enemy function 'render()'
    for(let i = 0; i < enemy.length; i++){
        enemy[i].render();
        
        if(enemy[i].decay){
        
        }
        
        if (enemy[i].pos.x > 400){
        baseHealth -= 1;

        //resets enemy
        enemy[i].pos.x = 0;
        enemy[i].pos.y = 0;
        }
    }

    //collisions
    for(let i = shots.length - 1; i > 0; i--){
        for(let j = enemy.length - 1; j >= 0; j--){
            if(shots[i] == undefined || enemy[j] == undefined){
                console.log(`this shot is broken\nshot: ${shots[i]}\ni: ${i}\n\nor it could be an enemy\nenemy: ${enemy[j]}\nj: ${j}`);
                continue;
            }
            if(checkDistance(shots[i].x, shots[i].y, enemy[j].pos.x, enemy[j].pos.y) < 20){
                shots.splice(i, 1);
                enemy[j].p--;
                money += enemy[j].p;
                if(enemy[j].p == 0){
                    enemy.splice(j, 1);
                }
            }
        }
    }

    //spawn new wave
    if(enemy.length == 0 && spawning.length == 0){
        newWave();
    }

    if(baseHealth <= 0){
        gameOver = true;
    }
}

function shoot(x, y, damage, fireRate){
    //find nearest enemy
    let best = Infinity;
    let bestEnemy = enemy[0];
    for(let j = 0; j < enemy.length; j++){
        if(checkDistance(x, y, enemy[j].pos.x, enemy[j].pos.y) < best){
            bestEnemy = enemy[j];
            best = checkDistance(x, y, enemy[j].pos.x, enemy[j].pos.y);
        }
    }
  
    //spawn the shot
    shots.push({
        x: x,
        y: y,
        xv: -x + bestEnemy.pos.x,
        yv: -y + bestEnemy.pos.y,
        time: 2000
    });
}
function colorCollision(/**@type{number}*/r, /**@type{number}*/g, /**@type{number}*/b){
    //some magic that checks for placement collisions
    let data = ctx.getImageData(mouseX - 10, mouseY - 10, 20, 20).data;
    for(let i = 0; i < data.length; i += 4){
        if(
            data[i] != r ||
            data[i + 1] != g ||
            data[i + 2] != b
        ){
            return false;
        }
    }
    return true;
    
}
function checkDistance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function newWave(){
    wave++;
    for(let i = 0; i < wave * 3; i++){
        spawning.push(new Enemy(Math.floor(Math.random() * wave + 1)));
    }
}
function defense (/**@type{number}*/def){ //creates defenses
    let colliding = colorCollision(0, 0, 0);
    if(colliding && money >= defenses[def].price){
        let d = {
            name: defenses[def].name,
            damage: defenses[def].damage,
            fireRate: defenses[def].fireRate,
            timer: defenses[def].timer,
            x: mouseX,
            y: mouseY
        }
        towers.push(d);
        money -= defenses[def].price;
    }
}
y
class Enemy {
    constructor(/**@tpe{number}*/p) {
        //this is the position of the enemy
        this.pos = createVector(0, 0);
        this.name = enemies[p - 1].name;
        this.p = enemies[p - 1].p;
        this.decay = enemies[p - 1].decay;
        this.decayTime = enemies[p - 1].decayTime;

        //these create vectors from an angle
        this.section1 = p5.Vector.fromAngle(radians(79));
        this.section2 = p5.Vector.fromAngle(radians(10));
        this.section3 = p5.Vector.fromAngle(radians(68.3));

        //this is the function that draws the enemy
        this.render = function () {
            push();
            //this is how the enemy moves
            translate(this.pos);
            //this is the enemy
            noStroke();
            fill(0, 0 + this.p, 255 - this.p);
            circle(0, 0, 15);
            pop();
            //this section says what vector should be moving on, so for if its past the 1st section it does section2, if it is past section2 is does section3, if it is in neither of those sections it does section1
            if (this.pos.x >= 19.4 && this.pos.x <= 299.4) { //these need to change depending on the map
                this.pos.add(this.section2);
            } else if (this.pos.x >= 299.4) {
                this.pos.add(this.section3);
            } else {
                this.pos.add(this.section1);
            }
        };
    }
}