document.addEventListener("DOMContentLoaded", () => {
    let newGameBtn = document.querySelector(".rungame-container");

    newGameGenerator()
    newGameBtn.addEventListener("click", newGameGenerator);
});

function newGameGenerator () {
    const tiles = [ null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,];
    let elements =  document.querySelectorAll(".grid-cell");

    let indexOfFullCells = {
        firstCell: 0,
        secondCell: 0,
    };

    while (indexOfFullCells.firstCell === indexOfFullCells.secondCell) {
        indexOfFullCells.firstCell = Math.floor(1 + Math.random() * 16);
        indexOfFullCells.secondCell = Math.floor(1 + Math.random() * 16);
    }
    
    Math.round(Math.random() * 10) == 9 ? tiles[indexOfFullCells.firstCell - 1] = 4 : tiles[indexOfFullCells.firstCell - 1] = 2;
    Math.round(Math.random() * 10) == 9 ? tiles[indexOfFullCells.secondCell - 1] = 4 : tiles[indexOfFullCells.secondCell - 1] = 2;

    
    for (let i = 0; i < 16; i++) {
        elements[i].innerText = tiles[i];
    }
}

class MoveTiles {
    constructor (events) {
        this.events = events;
    }

    moveUp () {

    }

    moveDown () {

    }

    moveLeft () {

    }

    moveRight () {

    }
}

function isWon (cells) {
    if ( cells.flat()
              .find((item) => item === 2048) ) {
        
        console.log("We found it"); // some function
        return;
    }
    console.log("We did not find it") // some other function
}