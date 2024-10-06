document.addEventListener('DOMContentLoaded', function(){
    const gameArena=document.getElementById('game-arena')
    const arenaSize=600;
    const cellsize=20;
    let score=0; //score of the game
    let gameStarted=false //game status
    let food={x:300, y:200}; //{x:15*20, y:10*20} ->To convert cell co-ordinate into pixels ->top left pixels for food
    let snake=[{x:160,  y:200}, {x:140, y:200}, {x:120, y:200}];

    let dx= cellsize;
    let dy=0;
    let intervalId;
    let gameSpeed=200;

    function moveFood(){
        let newX, newY;

        do{
            newX= Math.floor(Math.random() * 30) * cellsize;
            newY= Math.floor(Math.random() * 30) * cellsize;
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));

        food = { x: newX, y: newY };
    }

    function updateSnake(){
        const newHead={x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(newHead) //add new head to the snake

        //check collision with food
        if(newHead.x === food.x && newHead.y === food.y){
            score+= 10;
            moveFood();

            if(gameSpeed >50){
                clearInterval(intervalId)
                gameSpeed-= 10;
                gameLoop();
            }
        }
        else {
            snake.pop(); //remove tail
        }
    }

    function changeDirection(e){
        console.log("Key pressed",e)
        const isGoingDown= dy === cellsize;
        const isGoingUp= dy === -cellsize;
        const isGoingRight= dx === cellsize;
        const isGoingLeft= dx === -cellsize;
        if(e.key === 'ArrowUp' && !isGoingDown){
            dx=0;
            dy=-cellsize;
        }
        else if(e.key === 'ArrowDown' && !isGoingUp){
            dx=0;
            dy=cellsize;
        }
        else if(e.key === 'ArrowLeft' && !isGoingRight){
            dx=-cellsize;
            dy=0;
        }
        else if(e.key === 'ArrowRight' && !isGoingLeft){
            dx=cellsize;
            dy=0;
        }

    }

    function drawDiv(x, y, className){
        const divElement= document.createElement('div')
        divElement.classList.add(className)
        divElement.style.top= `${y}px`;
        divElement.style.left= `${x}px`;
        return divElement;
    }


    function drawFoodAndSnake(){
        gameArena.innerHTML=''; //clear the game arena
        // wipe out everything and redraw with new position

        snake.forEach((snakeCell)=>{
            const snakeElement=drawDiv(snakeCell.x, snakeCell.y, 'snake')
            gameArena.appendChild(snakeElement)
        })

        const foodElement= drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement)
    }

    function isGameOver(){

        // snake collision check
        for(let i=1; i<snake.length; i++){
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y){
                return true;
            }
        }
        
        //wall collision checks
        const hitLeftWall=snake[0].x < 0; //snake[0]-> head
        const hitRightWall=snake[0].x > arenaSize-cellsize;
        const hitTopWall=snake[0].y < 0;
        const hitBottomWall=snake[0].y > arenaSize-cellsize;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameLoop(){
        intervalId= setInterval(()=>{
            if(isGameOver()){
                clearInterval(intervalId)
                gameStarted= false;
                alert('Game Over' + '\n' + 'Your Score: ' +score);
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard()
        },gameSpeed);
    }

    function runGame(){
        if(!gameStarted){
            gameStarted=true;
            document.addEventListener('keydown', changeDirection)
            gameLoop();
        }
    }

    function drawScoreBoard(){
        const scoreBoard= document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }


    function initiateGame(){
        const scoreBoard=document.createElement('div');
        scoreBoard.id='score-board';

        document.body.insertBefore(scoreBoard, gameArena); //insert score board before arena

        const startButton=document.createElement('button')
        startButton.textContent="Start Game";
        startButton.classList.add('start-button')

        startButton.addEventListener('click', function startGame(){
            startButton.style.display='none'; //hide start button

            runGame();
        })

        document.body.appendChild(startButton)
    }

    initiateGame();
})