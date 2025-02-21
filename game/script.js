class Target {
    constructor(height, width, x, y, image){
        this.height = height
        this.width = width
        this.x = x
        this.y = y
        this.image = image
    }

    randomPlace(boardWidth, boardHeight){
        let randomX = Math.random() * (boardWidth - this.width) + 50
        let randomY = Math.random() * (boardHeight - this.height * 2) + 50
        this.x = randomX
        this.y = randomY
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    imageSelect(value){
        if(value == "target1"){
            this.image = targetImage
        }
        
        if(value == "target2"){
            this.image = targetImage2
        }

        if(value == "target3"){
            this.image = targetImage3   
        }
    }
}

class Pointer {
    constructor(image, x, y, height, width){
        this.image = image
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.target = false
    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

class Gun {
    constructor(height,width,x,y, image){
        this.height = height,
        this.width = width,
        this.x = x, 
        this.y = y
        this.image = image
    }

    draw(ctx){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }


    imageSelect(value){
        if(value == "gun1"){
            this.image = gunImage1
        }
        
        if(value == "gun2"){
            this.image = gunImage2
        }
    }
}

class Gameboard {
    constructor(board, boardHeight, boardWidth, ctx, target, targetArray, pointer,gun,time,score, username,level,selectGun, selectTarget, gameOver, scoreOutput, usernameOutput){
        this.board = board
        this.boardHeight = boardHeight
        this.boardWidth = boardWidth
        this.ctx = ctx
        this.target = target
        this.targetArray = targetArray
        this.pointer = pointer
        this.gun = gun
        this.time = time
        this.score = score
        this.username = username
        this.level = level
        this.selectGun = selectGun
        this.selectTarget = selectTarget
        this.gameOver = gameOver
        this.scoreOutput = scoreOutput
        this.usernameOutput = usernameOutput
    }

    initialize(){
        requestAnimationFrame(this.update.bind(this))
        setInterval(this.setTarget.bind(this), 300)
        setInterval(this.setTimer.bind(this),1000)
        this.eventListener()
    }

    eventListener() {
        document.addEventListener("mousemove", (e) => this.movePointer(e));
        document.addEventListener("keyup", (e) => this.detectPointer(e))
    }


    movePointer(e) {
        let rect = this.board.getBoundingClientRect();
        this.pointer.x = e.clientX - rect.left - this.pointer.width / 2;
        this.pointer.y = e.clientY - rect.top - this.pointer.height / 2;
    }


    detectPointer(e){
        if(e.code == "Space"){
            this.pointer.target = true
        }
    }

    setTarget(){
        if(this.targetArray.length < 3){
            let target = new Target(this.target.height, this.target.width, this.target.x, this.target.y, this.target.image)
            target.randomPlace(this.boardWidth, this.boardHeight)
            this.targetArray.push(target)
        }
     }

    setTimer(){
        if(this.time <= 0){
            this.gameOver = true
        }
        this.time -= 1
    }

    update(){
        requestAnimationFrame(this.update.bind(this))
        this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight)
        if(this.gameOver == true || this.time <= 0){
            this.outputFunc()
            return
        }

        for(let i = 0; i < this.targetArray.length; i++){
            let target = this.targetArray[i]
            target.draw(this.ctx)

            if(this.detect(target, this.pointer)  && this.pointer.target == true){
                this.targetArray.splice(i,1)
                i--
                this.score += 10
                console.log("sigma")
                this.pointer.target = false
                break
            } 

            if(this.pointer.target == true){
                this.time -= 5
                this.pointer.target = false
            }
        }
        
        this.ctx.fillStyle = "rgba(0,0,0,0.8)"
        this.ctx.fillRect(0,0, this.boardWidth,50)

        this.ctx.font = "20px arial"
        this.ctx.fillStyle = "white"
        this.ctx.fillText(this.username, 50, 30)
        this.ctx.fillText(`Time : ${this.time}`, this.boardWidth - 140,30)
        this.ctx.fillText(`Score : ${this.score}`,this.boardWidth / 2 -40, 30)

        this.gun.draw(this.ctx)
        this.pointer.draw(this.ctx)
    }

    detect(a, b){
        return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
    }

    // HTML
    dashboardFunc(){
        document.getElementById("dashboard").style.display = "none"
        document.getElementById("board-out").style.display = "flex"
        this.username = document.getElementById("username").value
        this.level = document.getElementById("level").value
        this.selectGun = document.querySelector('input[name="select-gun"]:checked').value
        this.selectTarget = document.querySelector('input[name="select-target"]:checked').value
        this.userFunc()
        console.log(this.username)
        console.log(this.level)
        console.log(this.selectGun)
        console.log(this.selectTarget)


        this.gun.imageSelect(this.selectGun)
        this.target.imageSelect(this.selectTarget)

        this.initialize()

        if(this.level == "easy"){
            this.time = 30
        } else if(this.level == "medium"){
            this.time = 20
        } else {
            this.time = 15
        }
    }


    outputFunc(){
        this.scoreOutput = document.getElementById("score-output").value = this.score
        this.usernameOutput = document.getElementById("username-output").value = this.username
        document.getElementById("output").style.display = "block"
    }


    saveFunc(){
        let data = {
            username: this.usernameOutput,
            score: this.scoreOutput
        }

        let storage = JSON.parse(localStorage.getItem("data")) || []
        storage.push(data)
        localStorage.setItem("data", JSON.stringify(storage))
    }


    userFunc(){
        let html = document.getElementById("sigma-abiz")
        let data = JSON.parse(localStorage.getItem("data")) || []

        html.innerHTML = data?.splice(0,1).map(item => `
        <div>
            <h4>${item.username}</h4>
            <p>Score : ${item.score}</p>
        </div>`).join("");
    }
}

let username;
let level;
let selectGun
let selectTarget
let scoreOutput
let usernameOutput


const boardHeight = 600
const boardWidth = 1000
const board = document.getElementById("board")
const ctx = board.getContext("2d")
board.height = boardHeight
board.width = boardWidth


let targetImage = new Image()
targetImage.src = "assets/target1.png"
let targetImage2 = new Image()
targetImage2.src = "assets/target2.png"
let targetImage3 = new Image()
targetImage3.src = "assets/target3.png"
let targetHeight = 120
let targetWidth = 120
let targetX = 0
let targetY = 0
let targetArray = []

let pointerImage = new Image()
pointerImage.src = "assets/pointer.png"
let pointerX = boardWidth / 2
let pointerY = boardHeight / 2
let pointerHeight = 50
let pointerWidth = 50

let gunImage1 = new Image()
gunImage1.src = "assets/gun1.png"
let gunImage2 = new Image()
gunImage2.src = "assets/gun2.png"
let gunWidth = 280
let gunHeight = 260
let gunX = boardWidth / 2 - gunWidth / 2
let gunY = boardHeight - gunHeight

let time = 0;
let score = 0
let gameOver = false

let gun = new Gun(gunHeight,gunWidth,gunX,gunY,gunImage1)
let pointer = new Pointer(pointerImage, pointerX, pointerY, pointerHeight, pointerWidth)
let target = new Target(targetHeight, targetWidth, targetX, targetY, targetImage)
let gameboard = new Gameboard(board, boardHeight, boardWidth, ctx, target, targetArray, pointer,gun,time,score, username,level,selectGun, selectTarget , gameOver, scoreOutput, usernameOutput)





// js dom

function instruction(){
    let instruction = getComputedStyle(document.getElementById("dashboard-instruction")).display
    console.log(instruction)
    if(instruction == "none"){
        document.getElementById("dashboard-instruction").style.display = "block"
    } else if(instruction == "block"){
        document.getElementById("dashboard-instruction").style.display = "none"
    }
}





