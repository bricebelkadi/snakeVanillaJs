// Création de la zone de jeu, en la découpant en une grid
let sizeGridInput = document.getElementById('gridSizeInput')
let speedInput = parseInt(document.getElementById('speedInput').value)

console.log(sizeGridInput.value)
let gridSize = parseInt(sizeGridInput.value)

let eatCount = 0

eatCounter = document.getElementById('eatCount')
eatCounter.innerHTML = `Your score : <h3>${eatCount}</h3>`


const snakeBox = document.getElementById("snakeBox");


function gridCreation (gridSizeParam) {
    let innerHtml = "";
    let lineLoop = ""
    let colo = ""
    let colLoop = ""
    gridSize = gridSizeParam
    for (let i = 1; i <= gridSize ; i++) {
        colo = ""
        for (let j = 1 ; j <= gridSize ; j++){
            colLoop = `<div id="colo${j}line${i}" class="colo"></div>`
            colo = colo + colLoop
        }
        lineLoop = `<div class="line ${i}">${colo}</div>`
        innerHtml = innerHtml + lineLoop
    }
    snakeBox.innerHTML = innerHtml;
    console.log(gridSize)
}


gridCreation(gridSize)

// Création des events pour les paramètres du jeu

let paramButton = document.getElementById('parambutton')
paramButton.addEventListener('click', resetParameter)

let x = 5;
let y = 5;

var min=1; 
var max=gridSize + 1;  
let randomX = Math.floor(Math.random() * (+max - +min)) + +min; 
let randomY = Math.floor(Math.random() * (+max - +min)) + +min; 
let snakeFood = {x:randomX,y:randomY}


class snakeBody {
    constructor(x,y) {
        this.x=x
        this.y=y
    }
}

let modalOn = false;
let lastDirection = 'right'

function snakeFoodRandom () {
    randomX = Math.floor(Math.random() * (+max - +min)) + +min; 
    randomY = Math.floor(Math.random() * (+max - +min)) + +min; 
    snakeFood.x = randomX
    snakeFood.y = randomY
}



function snakeDisplayON ({x,y}) {
    let div = document.getElementById(`colo${x}line${y}`);
    div.style.backgroundColor = 'black'
}

function snakeDisplayOFF ({x,y}) {
    let div = document.getElementById(`colo${x}line${y}`);
    div.style.backgroundColor = ''
}

function snakeDisplayFOOD ({x,y}) {
    let div = document.getElementById(`colo${x}line${y}`);
    div.style.backgroundColor = 'red'
}

snakeDisplayFOOD(snakeFood);

function snakeTailSelect () {
    let snakeTail = fullSnake[fullSnake.length-1];
    return snakeTail
}

function snakeHeadSelect () {
    let snakeHead = fullSnake[0];
    return snakeHead
}

var a = new snakeBody(5,5)
var b = new snakeBody(5,4)
var c = new snakeBody(5,3)
var fullSnake = [a,b,c]
fullSnake.forEach(snakeDisplayON);


function snakeCreation () {
    fullSnake = [a,b,c]
    fullSnake.forEach(snakeDisplayON);
    
}

let rightPressed = true;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let youEat = false;

let youAreDead = false;


const verify = ({x,y}) =>{
    for (snakeBody of fullSnake) {
        if (x === snakeBody.x && y === snakeBody.y) {return false}
    }
    return true
}



const moveAuto = () => {

    snakeDisplayOFF(snakeTailSelect())
    youEat = false ;
    let futureSnakeHead = {...snakeHeadSelect()}
    
    if ((futureSnakeHead.x===1 && leftPressed === true) || (futureSnakeHead.x===gridSize && rightPressed===true) || (futureSnakeHead.y===1 && upPressed===true) || (futureSnakeHead.y===gridSize && downPressed===true)) {
        $('#modalYouAreDead').modal('show')
        modalOn = true
        document.getElementById('finalScoreDied').innerHTML= `<p>Final score :</p><h3>${eatCount}</h3>`
        clearInterval(moveLoop);
        eatCount = 0
        return; 
    }
    
    if (futureSnakeHead.x == snakeFood.x && futureSnakeHead.y == snakeFood.y) {
        youEat = true
        console.log("!miam")
        snakeFoodRandom()
        while (verify(snakeFood)=== false) {snakeFoodRandom()}        
        snakeDisplayFOOD(snakeFood);
        eatCount ++
        eatCounter.innerHTML = `Your score : <h3>${eatCount}</h3>`


        
    }

    const moovment = () => {
        if (verify(futureSnakeHead) === false) {
            $('#modalYouEatYourself').modal('show')
            modalOn = true
            document.getElementById('finalScoreEaten').innerHTML= `<p>Final score :</p><h3>${eatCount}</h3>`
            clearInterval(moveLoop);
            return; 
            
        }
        fullSnake.unshift(futureSnakeHead)
        snakeDisplayON(snakeHeadSelect())
        if (youEat === false) {
            snakeDisplayOFF(snakeTailSelect())
            fullSnake.pop()
        }
    }

    if (rightPressed === true) {
            futureSnakeHead.x ++ 
            lastDirection = 'right'
            moovment(); 
            
    }


    if (leftPressed === true) {
        futureSnakeHead.x -- 
        lastDirection = 'left'
        moovment();
    }
    if (upPressed === true) {
        futureSnakeHead.y -- 
        lastDirection = 'up'
        moovment();
    }
    if (downPressed === true ) {
        futureSnakeHead.y ++ 
        lastDirection = 'down'
        moovment();
    }
}

function keyDownHandler(event) {
    
    if (modalOn === true) {
        if (event.keyCode == 13) {
            $('#modalYouEatYourself').modal('hide')
            $('#modalYouAreDead').modal('hide')
            resetParameter ()
        }    
    }

    if (event.keyCode < 37 || event.keyCode > 40) {
        return
    }
    
    if(event.keyCode == 39 && lastDirection !== 'left') {
        rightPressed = true;
        leftPressed = false;
        upPressed = false;
        downPressed = false;
    
    }
    
    else if(event.keyCode == 37 && lastDirection !== 'right') {
        leftPressed = true;
        upPressed = false;
        downPressed = false;
        rightPressed = false;

    
    }
    
    else if(event.keyCode == 40 && lastDirection !== 'up') {
        downPressed = true;
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
    
    }
    
    else if(event.keyCode == 38 && lastDirection !== 'down') {
        upPressed = true;
        rightPressed = false;
        leftPressed = false;
        downPressed = false;
    
    }

}


document.addEventListener('keydown', keyDownHandler, false);
document.getElementById('parambutton2').addEventListener('click', resetParameter)
document.getElementById('parambutton3').addEventListener('click', resetParameter)



var moveLoop = window.setInterval(moveAuto, speedInput)

function resetParameter (){
    clearInterval(moveLoop);
    $('#modalYouEatYourself').modal('hide')
    $('#modalYouAreDead').modal('hide')
    modalOn = false

    sizeGridInput = document.getElementById('gridSizeInput')
    gridSize=parseInt(sizeGridInput.value)
    gridCreation(gridSize)
    snakeCreation()
    rightPressed = true;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
    eatCount = 0
    eatCounter.innerHTML = `Your score : <h3>${eatCount}</h3>`
    min=1; 
    max=gridSize + 1;  
    randomX = Math.floor(Math.random() * (+max - +min)) + +min; 
    randomY = Math.floor(Math.random() * (+max - +min)) + +min; 
    snakeFood = {x:randomX, y:randomY}
    snakeDisplayFOOD(snakeFood);
    speedInput = parseInt(document.getElementById('speedInput').value)
    moveLoop = window.setInterval(moveAuto, speedInput)
    console.log("speed :" + speedInput)

}
