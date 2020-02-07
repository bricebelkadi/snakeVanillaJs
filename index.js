// Initialisation des variables :

let modalDeadOn = false;
let lastDirection = 'down'
let modalExplainOn = true

let modalExplain = document.getElementById("modalExplain");
let modalDead = document.getElementById("modalDead");


let rightPressed = true;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let youEat = false;

// Fonction permettant d'ouvrir les modales 

function openModalExplain () {
    if (modalExplainOn) {
        modalExplain.style.display = "block";
    }
    else {
        modalExplain.style.display = "none";
    }
}

function openModalDead () {
    if (modalDeadOn) {
        modalDead.style.display = "block";
    }
    else {
        modalDead.style.display = "none";
    }
}


// Création de la zone de jeu, en la découpant en une grid :

let sizeGridInput = document.getElementById('gridSizeInput')
let speedInput = parseInt(document.getElementById('speedInput').value)
let gridSize = parseInt(sizeGridInput.value)
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

// Initialisation du score :

let eatCount = 0
// eatCounter = document.getElementById('eatCount')

// Initialisation de la première div à manger :

var min=1; 
var max=gridSize + 1;
let snakeFood = {}
function snakeFoodRandom () {
    let randomX = Math.floor(Math.random() * (+max - +min)) + +min; 
    let randomY = Math.floor(Math.random() * (+max - +min)) + +min; 
    snakeFood.x = randomX
    snakeFood.y = randomY
}
snakeFoodRandom()

// Création des fonctions d'affichages sur la grid 

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

// Création des fonctions de séléction de la tête et la queue du serpent

function snakeTailSelect () {
    let snakeTail = fullSnake[fullSnake.length-1];
    return snakeTail
}

function snakeHeadSelect () {
    let snakeHead = fullSnake[0];
    return snakeHead
}

// Initialisation du serpent 

class snakeBody {
    constructor(x,y) {
        this.x=x
        this.y=y
    }
}
let a = new snakeBody(5,5)
let b = new snakeBody(5,4)
let c = new snakeBody(5,3)
var fullSnake = [a,b,c]
fullSnake.forEach(snakeDisplayON);

// Initialisation de la nourriture grâce à la fonction préalablement crée

snakeDisplayFOOD(snakeFood);

// Automatisation de l'initialisation de la création du serpent avec une fonction

function snakeCreation () {
    fullSnake = [a,b,c]
    fullSnake.forEach(snakeDisplayON);
}

// Création de la fonction permettant de vérifier si un élement est entré en collision avec un des éléments du serpent

const verify = ({x,y}) =>{
    for (snakeBody of fullSnake) {
        if (x === snakeBody.x && y === snakeBody.y) {return false}
    }
    return true
}

// Fonction automatique se répétant de manière infinie

const moveAuto = () => {

    // Si la modale des explications est ouverte, le jeu se met en pause

    if (modalExplainOn === true) {
        openModalExplain()
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
        downPressed = false;
    }

    // Disparition de la dernière div representant la queue du serpent

    snakeDisplayOFF(snakeTailSelect())
    youEat = false ;
    let futureSnakeHead = {...snakeHeadSelect()}

    // Vérification si le serpent va entrer en collision avec le rebord de la grid
    
    if ((futureSnakeHead.x===1 && leftPressed === true) || (futureSnakeHead.x===gridSize && rightPressed===true) || (futureSnakeHead.y===1 && upPressed===true) || (futureSnakeHead.y===gridSize && downPressed===true)) {
        modalDeadOn = true
        openModalDead()
        document.getElementById('finalScore').innerHTML= `FINAL SCORE : ${eatCount}`
        clearInterval(moveLoop);
        eatCount = 0
        return; 
    }

    // Vérification si la tête du serpent a mangé le fruit à attraper
    
    if (futureSnakeHead.x == snakeFood.x && futureSnakeHead.y == snakeFood.y) {
        youEat = true
        console.log("!miam")
        snakeFoodRandom()
        while (verify(snakeFood)=== false) {snakeFoodRandom()}        
        snakeDisplayFOOD(snakeFood);
        eatCount ++
        // eatCounter.innerHTML = `Your score : <h3>${eatCount}</h3>`
    } 

    // Création de la fonction permettant de faire apparaitre un nouveau carré pour faire avancer le serpent

    const moovment = () => {
        if (verify(futureSnakeHead) === false) {
            modalDeadOn = true    
            openModalDead()
            document.getElementById('finalScore').innerHTML= `FINAL SCORE : ${eatCount}`
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

    // Application de la fonction crée juste au dessus aux quatres directions possibles

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

// Fonction permettant d'arreter la pause du jeu

function stopPause () {
    modalExplainOn = false
    openModalExplain()

}

// Fonction permettant de gérer les events en fonctions des touches appuyées par l'utilisateur

function keyDownHandler(event) {
    if (modalDeadOn === true || modalExplainOn === true) {
        if (event.keyCode === 13) {
            modalDeadOn = false
            modalExplainOn = false
            openModalDead()
            openModalExplain()
            resetParameter()
        }    
    }

    if (event.keyCode === 32) {

        if (modalExplainOn === false) {
            modalExplainOn = true
            openModalExplain()    
            rightPressed = false;
            leftPressed = false;
            upPressed = false;
            downPressed = false;
        }

        else if (modalExplainOn === true) {
            stopPause()
        }
    

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

// Mise en place des events Listeners

document.addEventListener('keydown', keyDownHandler, false);
document.getElementById('parambutton').addEventListener('click', resetParameter)
document.getElementById('parambutton2').addEventListener('click', stopPause)
document.getElementById('parambutton3').addEventListener('click', resetParameter)
// document.getElementById('parambutton4').addEventListener('click', stopPause)


// Mise en place de la boucle se répetant indéfiniment

var moveLoop = window.setInterval(moveAuto, speedInput)

// Création d'une fonction permettant de réinitialiser le jeu lorsque le joueur perd

function resetParameter (){
    clearInterval(moveLoop);
    modalDeadOn = false
    modalExplainOn = false

    openModalDead()
    openModalExplain()

    sizeGridInput = document.getElementById('gridSizeInput')
    gridSize=parseInt(sizeGridInput.value)
    gridCreation(gridSize)
    snakeCreation()
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
    eatCount = 0
    // eatCounter.innerHTML = `Your score : <h3>${eatCount}</h3>`
    min=1; 
    max=gridSize + 1;  
    randomX = Math.floor(Math.random() * (+max - +min)) + +min; 
    randomY = Math.floor(Math.random() * (+max - +min)) + +min; 
    snakeFood = {x:randomX, y:randomY}
    snakeDisplayFOOD(snakeFood);
    speedInput = parseInt(document.getElementById('speedInput').value)
    moveLoop = window.setInterval(moveAuto, speedInput)
    lastDirection = 'down'
}