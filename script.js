const board = document.getElementById("game-board");
const instxt = document.getElementById("instruction-text");
const curr_score = document.getElementById("cscore");
const high_score = document.getElementById("hscore");

//console.log(b,"hi")
let overst = false;
let h = 0;
let grid_size = 20;
let snake = [{x:10,y:10},{ x: 10, y: 11 }];
let food = generate_food();
let direction = "r";
let gameinterval;
let speed = 400;
let started;
let t = true;
function generate_food() {
    const x = Math.floor(Math.random() * grid_size) + 1;
    const y = Math.floor(Math.random() * grid_size) + 1;
    for (let i = 1; i < snake.length; i++) {
        if (x != snake[i].x && y != snake[i].y) {
            return { x, y };
        }
    }
    return generate_food()
}

function draw() {if(started){
    //console.log("in the draw function");
    board.innerHTML = "";
    draw_snake();
    draw_food();
}}

function draw_snake() {
    //console.log("in the draw_snake function setting snake");
    snake.forEach(segment => {
        const snake_element = create_game_element("div", "snake");
        set_position(snake_element, segment);
        board.appendChild(snake_element);
    });
}

function draw_food() {
    const food_element = create_game_element("div", "food");
    set_position(food_element, food);
    board.appendChild(food_element);
}

function create_game_element(tag, class_name) {
    //console.log("in the create_game_element function creating tags");
    const element = document.createElement(tag);
    element.className = class_name;
    return element;
}

function set_position(element, position) {
    //console.log("in the set_position function setting coordinates");
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
    //console.log(element.style.gridRow);
}
//draw();
function move(direction) {
    const head = { ...snake[0] };
    switch (direction) {
        case "r":
            head.x++;
            break;
        case "t":
            head.y--;
            break
        case "l":
            head.x--;
            break
        case "b":
            head.y++;
            break
    }
    snake.unshift(head);
    if ((head.x === food.x) && (head.y === food.y)) {
        food = generate_food();
        new_score();
        decspeed();
        start();
    }
    else {
        snake.pop();
    }
}

function limit_snake() {
    const head = snake[0];
    if (head.x < 1 || head.x > grid_size || head.y < 1 || head.y > grid_size) { 
        reset();
     }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            reset();
        }
    }
}

function decspeed(){speed-=5;}

function start() {
    started = true;
    instxt.style.display = "none";
    clearInterval(gameinterval)
    gameinterval = setInterval(() => {
        move(direction);
        limit_snake();
        draw();
    }, speed);
}

function key_press(event) {
    if (
        (!started && event.code === "Space") || (!started && event.code === " ")
    ) {
        start();
    }
    else {
        switch (event.key) {
            case "ArrowUp":
                direction = "t";
                break;
            case "ArrowDown":
                direction = "b";
                break;
            case "ArrowLeft":
                direction = "l";
                break;
            case "ArrowRight":
                direction = "r";
                break;
        }
    }
}

function new_score() {
    const len_of_snake = snake.length-2; 
    curr_score.textContent = len_of_snake.toString().padStart(3,"0");
    console.log(high_score,curr_score,len_of_snake);
    if (len_of_snake > h){
        h = len_of_snake
        high_score.textContent = h.toString().padStart(3,"0");
    }
}


function reset() {
    stop();
    console.log("g");
    snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }];
    food = generate_food();
    curr_score.textContent = "000";
    direction = "r";
    speed = 300;
    clearInterval(gameinterval); 
    overst = true;
}

function stop(){
    //clearInterval(gameinterval);
    started = false;
    instxt.style.display = "block"; 
}

//document.addEventListener("touchmove",key_press);
document.addEventListener("keydown", key_press);

document.addEventListener('DOMContentLoaded', function () {
    var swipeElement = document.getElementById('swipe');
    var initialX, initialY;
  
    swipeElement.addEventListener('touchstart', function (event) {
      initialX = event.touches[0].clientX;
      initialY = event.touches[0].clientY;
    },{passive:false});
  
    swipeElement.addEventListener('touchmove', function (event) {
      event.preventDefault();
  
      var currentX = event.touches[0].clientX;
      var currentY = event.touches[0].clientY;
  
      var deltaX = currentX - initialX;
      var deltaY = currentY - initialY;
  
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            direction = "r";
                } 
                else {
                    direction = "l";        }
      } else {
        if (deltaY > 0) {
            direction = "b";        } else {
                direction = "t";        }
      }  
      initialX = currentX;
      initialY = currentY;
    },{passive:false});
  
    swipeElement.addEventListener('touchend', function () {
       start(); 
    },{passive:false});
  });
   
