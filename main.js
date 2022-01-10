document.addEventListener("DOMContentLoaded", () => {
    
    const TILES_CLASSES = {
        0: "grid-cell",
        2: "tile-2",
        4: "tile-4",
        8: "tile-8",
        16: "tile-16",
        32: "tile-32",
        64: "tile-64",
        128: "tile-128",
        256: "tile-256",
        512: "tile-512",
        1024: "tile-1024",
        2048: "tile-2048",
    };

    const tilesElements = document.querySelectorAll(".grid-cell");
    const newGameBtn = document.querySelector(".rungame-container");
    const scoreDisplay = document.querySelector(".score-container__main");
    const bestScoreDisplay = document.querySelector(".score-container__best");
    bestScoreDisplay.textContent = localStorage.bestScore ? localStorage.bestScore : 0;
    const gameMessage = document.querySelector(".game-message_display-none");
    let stepsArr = [];
    let scoresArr = [];
    let score = 0;
    let tilesNumArr = [];
    let canRemember = true;

    class Game {
        constructor (event) {
            this._event = event;
        }

        startGame () {
            canRemember = false;

            gameMessage.className = "game-message_display-none";
            gameMessage.innerHTML = "";
            document.addEventListener("keydown", move);

            score = 0;
            scoreDisplay.textContent = score;

            const tileReset = () => {
                let tileArr = [];
                for (let i = 0; i < 16; i++) {
                    tileArr.push(0);
                }
                return tileArr;
            }

            tilesNumArr = tileReset();

            this.tileGen();
            this.tileGen();
            this.rememberStepAndScore();

            for (let i = 0; i < 16; i++) {                
                this.changeTileClass(tilesElements[i], 0)
                if (tilesNumArr[i] !== 0) {
                    tilesElements[i].textContent = tilesNumArr[i];
                    this.changeTileClass(tilesElements[i], tilesNumArr[i]);
                } else {
                    tilesElements[i].textContent = "";
                }
            }
        }

        render () {
            canRemember = true;
            tilesElements.forEach((item) => {
                if (Number(item.textContent) === 0) item.textContent = "";
                this.changeTileClass(item, item.textContent);
            });
            scoreDisplay.textContent = score;
        }        
        
        changeTileClass (tile, nclass) {
            nclass = Number(nclass);
            tile.className = TILES_CLASSES[0];
            tile.classList.add(TILES_CLASSES[nclass]);
        }

        rememberStepAndScore () {
            scoresArr.push(score);
            stepsArr.push(tilesNumArr.slice());
            let count = 0;
            tilesNumArr.map(item => {if (item !== 0) count++})
            if (count >= 2 && canRemember) {
                localStorage.setItem("score", score);
                localStorage.setItem("lastStepArr", stepsArr[stepsArr.length - 1]);
            }
        }

        stepBack () {
            let lastStepArr = [];
            if (stepsArr.length > 1) {
                lastStepArr = stepsArr[stepsArr.length - 2];
                console.log(lastStepArr);
                tilesElements.forEach( (item, index) => {
                    item.textContent = lastStepArr[index];
                    tilesNumArr[index] = lastStepArr[index];
                });

                score = scoresArr[scoresArr.length - 2];
                
                this.render();
                
                scoresArr.pop();
                stepsArr.pop();
            }
        }

        tileGen () {
            try {
                let rndEmptyTileIndex = Math.floor(1 + Math.random() * 16);
                if (!tilesNumArr[rndEmptyTileIndex - 1]) {
                    let rndTile = Math.round(Math.random() * 10);
                    rndTile === 9 ? tilesNumArr[rndEmptyTileIndex - 1] = 4 : tilesNumArr[rndEmptyTileIndex - 1] = 2;
                    tilesElements[rndEmptyTileIndex - 1].textContent = tilesNumArr[rndEmptyTileIndex - 1];
                    this.changeTileClass(tilesElements[rndEmptyTileIndex - 1], tilesNumArr[rndEmptyTileIndex - 1]);
                } else {
                    this.tileGen();
                }
            } catch {
                this.gameOver();
            }
        }

        gameOver () {
            gameMessage.className = "game-message";
            gameMessage.innerHTML = "<p>You lose </p>";
            gameMessage.firstElementChild.className = "game-message__lose";
            gameMessage.setAttribute("style", "display:flex;");
            document.removeEventListener("keydown", move);
        }

        gameWin () {
            let isWin = tilesNumArr.find(item => item === 2048);
            
            if (isWin) {
                gameMessage.className = "game-message";
                gameMessage.innerHTML = "<p>You won</p>";
                gameMessage.firstElementChild.className = "game-message__win";
                gameMessage.setAttribute("style", "display:flex;");
                document.removeEventListener("keydown", move);
            }
        }

        moveControl () {
            const ev = this._event.keyCode;

            switch (ev) {
                case 38:
                    this.goUp();
                    this.combineUp();
                    this.rememberStepAndScore();
                    this.render();
                    break;
                case 39:
                    this.goRight();
                    this.combineRight();
                    this.rememberStepAndScore();
                    this.render();
                    break;
                case 40:
                    this.goDown();
                    this.combineDown();
                    this.rememberStepAndScore();
                    this.render();
                    break;
                case 37:
                    this.goLeft();
                    this.combineLeft();
                    this.rememberStepAndScore();
                    this.render();
                    break;
                case 8:
                    this.stepBack();
            }
        }
        
        goUp () {
            for (let i = 0; i < 4; i++) {
                this.getRowOrColumn(i, 0, 1);
            }
        }

        goRight () {
            for (let i = 0; i < 16; i += 4) {
                this.getRowOrColumn(i, 1, 0);
            }
        }

        goDown () {
            for (let i = 0; i < 4; i++){
                this.getRowOrColumn(i, 1, 1);
            }

        }

        goLeft () {
            for (let i = 0; i < 16; i += 4) {
                this.getRowOrColumn(i, 0, 0)
            }
        }

        getRowOrColumn (index, direction, axis) {
            axis === 0 ? axis = 1: axis = 4;
            let row = [
                tilesNumArr[index],
                tilesNumArr[index + axis],
                tilesNumArr[index + axis * 2],
                tilesNumArr[index + axis * 3],
            ];

            const rowWithoutZeros = row.filter(num => num);
            const gaps = row.length - rowWithoutZeros.length;
            const newRow = direction === 1 ? Array(gaps).fill(0).concat(rowWithoutZeros) : rowWithoutZeros.concat(Array(gaps).fill(0));
            newRow.forEach((element, indx) => {
                if (tilesElements[index + axis * indx].textContent != element) {
                    tilesElements[index + axis * indx].textContent = element;
                    tilesNumArr[index + axis * indx] = element;
                    this.changeTileClass(tilesElements[index + axis * indx], element);
                }
            });         
        }
        
        combineUp () {
            for (let i = 0; i < 12; i++) {
                if (tilesElements[i].textContent === tilesElements[i + 4].textContent) {
                    this.combineRowOrColumn(i, 0, 1);
                    this.goUp();
                }
            }
            this.tileGen();
        }

        combineRight () {
            for (let i = 15; i > 0; i--) {
                if (i % 4 != 0 && tilesElements[i].textContent === tilesElements[i - 1].textContent) { // доп проверка
                    this.combineRowOrColumn(i, 1, 0);
                    this.goRight();
                }
            }
            this.tileGen();
        }

        combineDown () {
            for (let i = 15; i > 3; i--) {
                if (tilesElements[i].textContent === tilesElements[i - 4].textContent) {
                    this.combineRowOrColumn(i, 1, 1);
                    this.goDown();
                }
            }
            this.tileGen();
        }

        combineLeft () {
            for (let i = 0; i < 15; i++) {
                if (((i + 1) % 4) != 0 && tilesElements[i].textContent === tilesElements[i + 1].textContent) { // доп проверка
                    this.combineRowOrColumn(i, 0, 0);
                    this.goLeft();
                }
            }
            this.tileGen();
        }

        combineRowOrColumn (index, direction, axis) {
            axis === 0 ? axis = 1 : axis = 4;

            let firstElement = Number(tilesElements[index].textContent);
            let secondElement;
            let sumResult;

            if (direction) {
                secondElement = Number(tilesElements[index - axis].textContent);
                sumResult = firstElement + secondElement;
                tilesElements[index - axis].textContent = tilesNumArr[index - axis] = sumResult;
                tilesElements[index].textContent = tilesNumArr[index] = 0;
            }

            if (!direction) {
                secondElement = Number(tilesElements[index + axis].textContent);
                if (axis === 1) {
                    sumResult = firstElement + secondElement;
                    tilesElements[index + axis].textContent = tilesNumArr[index + axis] = 0;
                    tilesElements[index].textContent = tilesNumArr[index] = sumResult;
                }
                if (axis === 4) {
                    sumResult = firstElement + secondElement;
                    tilesElements[index].textContent = tilesNumArr[index] = 0;
                    tilesElements[index + 4].textContent = tilesNumArr[index + 4] = sumResult;
                }
            }
            score += sumResult;
            scoreDisplay.textContent = score;

            if (localStorage.bestScore < score || !localStorage.bestScore) {
                bestScoreDisplay.textContent = score;
                localStorage.setItem("bestScore", score);
            }
            this.gameWin();
        }        
    }

    function start() {
        localStorage.setItem("score", 0);
        localStorage.setItem("lastStepArr",0);
        stepsArr = [];
        let start = new Game();
        start.startGame();
    }

    if (localStorage.score > 0){
        score = Number(localStorage.score);
        let lastArr = localStorage.lastStepArr.split(",");
        scoreDisplay.textContent = score;
        console.log(lastArr);
        tilesElements.forEach((item, index) => {
            item.textContent = tilesNumArr[index] = Number(lastArr[index]);
        });

        let render = new Game();
        render.render();
    } else {
        start();
    }
    newGameBtn.addEventListener("click", start);
    
    function move(event) {
        let moveTiles = new Game(event);
        moveTiles.moveControl();
    }
    document.addEventListener("keydown", move);
});
