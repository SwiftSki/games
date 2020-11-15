/*
TODO:
figure out how to get map vectors to correspond with enemy movements
towers shoot
*/
var canv, ctx;
var enemy = [];
var baseHealth = 10, 
    money = 100,
    towers = [],
    shots = [];


var cMap = maps[0]; //this will be random later

function keyTyped(){
    switch(key){
        case '1':
            defense(0);
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
    textSize(15);
    text(`lives: ${baseHealth}\nmoney: ${money}`, 5, 420);
    pop();
    //towers
    fill(0, 0, 255);
    rect(100, 400, 50, 50);
    fill(0);
    text('1\nbasic\n$10', 110, 415);
    
    //towers
    for(let i = 0; i < towers.length; i++){
        let obj = towers[i];
        //draw
        push();
        if(obj.name == 'basic'){
        fill(0, 0, 255);
        circle(obj.x, obj.y, 20);
        }
        
        pop();
        
        //shoot
        shoot(towers[i].x, towers[i].y, towers[i].damage, towers[i].fireRate);
    }
    //render shots
    for(let i = 0; i < shots.length; i++){
        fill(255, 0, 0);
        circle(shots[i].x, shots[i].y, 5);
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
}

function shoot(x, y, damage, fireRate){
    //find nearest enemy
  
    //spawn thw shot
}
function colorCollision(){
    //some magic that checks for placement collisions
    let data = ctx.getImageData(mouseX - 10, mouseY - 10, 20, 20).data;
    console.log(data);
    for(let i = 0; i < data.length; i += 4){
        if(
            data[i] == 0 &&
            data[i + 1] == 0 &&
            data[i + 2] == 0
        ){
            return true;
        }
    }
    return false;
    
}
function defense (/**@type{number}*/def){ //creates defenses
    let notColliding = colorCollision();
    console.log(notColliding);
    if(notColliding && money >= defenses[def].price){
        let d = {
            name: defenses[def].name,
            damage: defenses[def].damage,
            fireRate: defenses[def].fireRate,
            x: mouseX,
            y: mouseY
        }
        towers.push(d);
        money -= defenses[def].price;
    }
}

class Enemy {
    constructor(p) {
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
            fill(0, 0, 255);
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