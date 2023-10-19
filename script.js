const canvas = document.getElementById("canvas")
canvas.width = 1000
canvas.height = 500
const ctx = canvas.getContext("2d")
let isGameStarted = false
let snake = []
let size = 10
let width = 25
let apples = null
let appleX
let appleY
let playerXPosition = canvas.width / 2
let playerYPosition = canvas.height / 2
let playerPosition = {}
let speed = 5
let movementStatus = undefined
let fps = 1000 / 60
let score = 0
let highestscore = 0
let collisionDeath = true

document.body.addEventListener("keydown", snakeMove)

function snakeMove(event) {
    isGameStarted = true
    if(event.keyCode==38||event.keyCode==87){
        if(movementStatus!="down") {
            movementStatus = "up"
        } 
    }
    if(event.keyCode==40||event.keyCode==83){
        if(movementStatus!="up") {
            movementStatus = "down"
        }
    }
    if(event.keyCode==39||event.keyCode==68){
        if(movementStatus!="left") {
            movementStatus = "right"
        }
        
    }
    if(event.keyCode==37||event.keyCode==65){
        if(movementStatus!="right") {
            movementStatus = "left"
        }
        
    }
}

function pause() {
    movementStatus=undefined
}

function spawnApple() {
    if(apples!=null) {
        return
    } else if(apples==null) {
        apples = []
        appleX = Math.round(Math.floor(Math.random() * 950))
        appleY = Math.round(Math.floor(Math.random() * 450))

        for(let i = 0; i<snake.length; i++) {
            if(
                snake[i].x < (appleX + width)
                && snake[i].x + width > appleX
                && snake[i].y < (appleY + width)
                && snake[i].y + width > appleY

            ) {
                appleX = Math.round(Math.floor(Math.random() * 950))
                appleY = Math.round(Math.floor(Math.random() * 450))
                i = 0
            }
        }
        
        apples.push(appleX, appleY)
        ctx.fillStyle = "red"
        ctx.fillRect(appleX, appleY, 20, 20)
    }
    
}

function spawnPlayer() {  
    if(snake.length==0) {
        playerPosition = {
            x: playerXPosition,
            y: playerYPosition,
            color: "green"
        }
        ctx.fillStyle = "green"
        ctx.fillRect(playerPosition.x, playerPosition.y, width, width)
        while(snake.length<size) {
            snake.push(playerPosition)
        }
    }
}

function game() {

    highestscore = localStorage.getItem("record") || 0

    spawnPlayer()
    spawnApple()
    if(movementStatus!=undefined) {
        if(movementStatus==="up") {
            playerYPosition -= speed
        }
        else if(movementStatus==="down") {
            playerYPosition += speed
        }
        else if(movementStatus==="right") {
            playerXPosition += speed
        }
        else if(movementStatus==="left") {
            playerXPosition -= speed
        }
        playerPosition = {
            x: playerXPosition,
            y: playerYPosition,
            color: "green"
        }
        ctx.fillStyle = "green"
        ctx.fillRect(playerPosition.x, playerPosition.y, width, width)
        
        ctx.fillStyle = "black"
        ctx.fillRect(snake[0].x, snake[0].y, width, width)
        snake.shift()

        if(playerXPosition < (appleX + width)
        && playerXPosition + width > appleX
        && playerYPosition < (appleY + width)
        && playerYPosition + width > appleY) {
            ctx.fillStyle = "black"
            ctx.fillRect(appleX, appleY, width, width)
            apples = null
            size+=10
            score++
        }
        
        while(snake.length<size) {
            if(snake.indexOf(playerPosition!=-1)) {
                snake.push(playerPosition)
            }
        }
        for( let i = snake.length - 25; i >= 0; i-- ) {
            if(
                playerXPosition < (snake[i].x + width)
                && playerXPosition + width > snake[i].x
                && playerYPosition < (snake[i].y + width)
                && playerYPosition + width > snake[i].y
            ) {
                if(collisionDeath) {
                    playerXPosition = canvas.width / 2
                    playerYPosition = canvas.height / 2
                    size = 10
                    movementStatus = undefined
                    snake = []
                    ctx.fillStyle="black"
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    apples = null
                    score = 0
                    return
                }
                
            }
        }  
        
    }
    if(playerXPosition>canvas.width) {
        playerXPosition=0
    }
    if(playerXPosition+width<0) {
        playerXPosition = canvas.width
    }
    if(playerYPosition+width<0) {
        playerYPosition = canvas.height
    }
    if(playerYPosition>canvas.height) {
        playerYPosition=0
    }

    document.getElementById("score").innerText = "Score: " + score
    document.getElementById("highest-score").innerText = "Highest score: " + highestscore

    if(score>highestscore) {
        highestscore = score
        localStorage.setItem("record", highestscore)
    }

}

setInterval(game, fps)
