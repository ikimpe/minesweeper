'use strict'
//var toetsenbord = require('readline-sync');

// a constructor function for 1 field
function Field(rowCoord, columnCoord) {
    this.value = 0;
    this.revealed = false;
    this.flagged = 0;
    this.isBomb = false;
    this.charCover = ["*", "V", "?"];
    this.charBomb = "X";
    this.columnCoord = columnCoord;
    this.rowCoord = rowCoord;
}
// a function that returns the value of the field or the cover if the field is not yet revealed
Field.prototype.show = function () {
    if (this.revealed == false) {
        if (this.flagged % 3 == 0) return this.charCover[0];
        if (this.flagged % 3 == 1) return this.charCover[1];
        if (this.flagged % 3 == 2) return this.charCover[2];
    }
    else if (this.isBomb == true) { return this.charBomb }
    else { return this.value }
}

// a constructor function for a playboard
function Board(columns, rows, numBombs) {
    this.columns = columns;
    this.rows = rows;
    this.numberOfFields = rows * columns;
    this.numBombs = numBombs;
    this.playBoard = [];
    this.gameOver = false;
    this.whereToPlaceBombs = [];
    this.revealedFields = 0;
    this.flaggedByUser = 0;
    this.flaggedRight = 0;
    this.remainingBombs = numBombs;
    this.youWinGame = false;
    this.trackTime = false;
    this.timeSpend = 0;
}
// a function that creates a 2-dimentional array filled with zero's
Board.prototype.createBoard = function () {
    for (var i = 0; i < this.rows; i++) {
        this.playBoard.push(new Array(this.columns));
        for (var j = 0; j < this.columns; j++) {
            this.playBoard[i][j] = new Field(i, j);
        }
    }
}
// a function that places the bombs on the 2d array
Board.prototype.placeBombs = function () {
    for (var i = 0; i < this.numBombs; i++) {
        var rowNumber = Math.floor(this.whereToPlaceBombs[i] / this.columns);
        var columnNumber = this.whereToPlaceBombs[i] % this.columns;
        this.playBoard[rowNumber][columnNumber].isBomb = true;
    }
}
// a function that creates an array of numbers,
// which are between 0 and the number of fields in the playboard
Board.prototype.giveRandomNumbersArray = function () {
    var randomNumber;
    while (this.whereToPlaceBombs.length < this.numBombs) {
        randomNumber = Math.floor(Math.random() * this.numberOfFields);
        if (this.whereToPlaceBombs.indexOf(randomNumber) < 0) {
            this.whereToPlaceBombs.push(randomNumber);
        }
    }
}
// a function that places the numbers around the bombs
Board.prototype.placeNumbers = function () {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            if (this.playBoard[i][j].isBomb == false) {
                var LU = null, U = null, UR = null, R = null, DR = null, D = null, LD = null, L = null;
                /////     L = left     //     R = right     //     U = up     //     D = down     /////
                // define the neighbours of the field
                if (this.playBoard[i - 1] && this.playBoard[i - 1][j - 1]) LU = this.playBoard[i - 1][j - 1];
                if (this.playBoard[i - 1]) U = this.playBoard[i - 1][j];
                if (this.playBoard[i - 1] && this.playBoard[i - 1][j + 1]) UR = this.playBoard[i - 1][j + 1];
                if (this.playBoard[i][j + 1]) R = this.playBoard[i][j + 1];
                if (this.playBoard[i + 1] && this.playBoard[i + 1][j + 1]) DR = this.playBoard[i + 1][j + 1];
                if (this.playBoard[i + 1]) D = this.playBoard[i + 1][j];
                if (this.playBoard[i + 1] && this.playBoard[i + 1][j - 1]) LD = this.playBoard[i + 1][j - 1];
                if (this.playBoard[i][j - 1]) L = this.playBoard[i][j - 1];
                // check if neighbourfield exists and if that field is a bomb
                if (LU && LU.isBomb) this.playBoard[i][j].value++;
                if (U && U.isBomb) this.playBoard[i][j].value++;
                if (UR && UR.isBomb) this.playBoard[i][j].value++;
                if (R && R.isBomb) this.playBoard[i][j].value++;
                if (DR && DR.isBomb) this.playBoard[i][j].value++;
                if (D && D.isBomb) this.playBoard[i][j].value++;
                if (LD && LD.isBomb) this.playBoard[i][j].value++;
                if (L && L.isBomb) this.playBoard[i][j].value++;
            }
        }
    }
}
// a function that tracks time
/**/var startTrackingTime = null;
Board.prototype.timeTracker = function () {
    var self = this;
    /*var*/ startTrackingTime = setInterval(function () {
        self.timeSpend += 1;
        if (self.gameOver) {
            clearInterval(startTrackingTime);
        }
    }, 1000);

}
// a function that visualizes the array for the console
Board.prototype.visualize = function () {
    var row;
    for (var i = 0; i < this.rows; i++) {
        row = "";
        for (var j = 0; j < this.columns; j++) {
            row += this.playBoard[i][j].show() + " ";
        }
        console.log(row);
    }
}
// a function that opens all neighbourfields when they have no value including the borders where there is a number
Board.prototype.openFields = function (columnCoord, rowCoord) {
    if (this.playBoard[rowCoord][columnCoord].revealed == false) {
        // line below: this is an if to correct the number of flagged fields when the fields are revealed 
        if (this.playBoard[rowCoord][columnCoord].show() == this.playBoard[rowCoord][columnCoord].charCover[1]) this.flaggedByUser--;
        this.playBoard[rowCoord][columnCoord].revealed = true;
        this.revealedFields++;
        // here starts the revealing of the empty fields
        if (this.playBoard[rowCoord][columnCoord].show() == 0) {
            if (this.playBoard[rowCoord - 1] && this.playBoard[rowCoord - 1][columnCoord - 1]) this.openFields(columnCoord - 1, rowCoord - 1);
            if (this.playBoard[rowCoord - 1]) this.openFields(columnCoord, rowCoord - 1);
            if (this.playBoard[rowCoord - 1] && this.playBoard[rowCoord - 1][columnCoord + 1]) this.openFields(columnCoord + 1, rowCoord - 1);
            if (this.playBoard[rowCoord][columnCoord + 1]) this.openFields(columnCoord + 1, rowCoord);
            if (this.playBoard[rowCoord + 1] && this.playBoard[rowCoord + 1][columnCoord + 1]) this.openFields(columnCoord + 1, rowCoord + 1);
            if (this.playBoard[rowCoord + 1]) this.openFields(columnCoord, rowCoord + 1);
            if (this.playBoard[rowCoord + 1] && this.playBoard[rowCoord + 1][columnCoord - 1]) this.openFields(columnCoord - 1, rowCoord + 1);
            if (this.playBoard[rowCoord][columnCoord - 1]) this.openFields(columnCoord - 1, rowCoord);
        } else if (this.playBoard[rowCoord][columnCoord].show() == this.playBoard[rowCoord][columnCoord].charBomb) {
            this.gameIsOver();
        }
    }
    this.checkGameOver();
}
// a function that is triggered by a left click
Board.prototype.leftClick = function (columnCoord, rowCoord) {
    if (this.trackTime == false) {
        this.timeTracker();
        this.trackTime = true;
    };
    this.openFields(columnCoord, rowCoord);
    // enable for console //    this.visualize();
}
// a function that is triggered by a right click
Board.prototype.rightClick = function (columnCoord, rowCoord) {
    this.playBoard[rowCoord][columnCoord].flagged++;
    if (this.playBoard[rowCoord][columnCoord].show() == this.playBoard[rowCoord][columnCoord].charCover[1]) {
        this.flaggedByUser++;
        if (this.playBoard[rowCoord][columnCoord].isBomb) this.flaggedRight++;
    } else if (this.playBoard[rowCoord][columnCoord].show() == this.playBoard[rowCoord][columnCoord].charCover[2]) {
        this.flaggedByUser--;
        if (this.playBoard[rowCoord][columnCoord].isBomb) this.flaggedRight--;
    }
    this.remainingBombs = this.numBombs - this.flaggedByUser >= 0 ? this.numBombs - this.flaggedByUser : "you're paranoid!";
    this.checkGameOver();
    // enable for console //    this.visualize();
}
// a function that makes it possible to play via console
Board.prototype.inputCoords = function () {
    var columnCoord = 0, rowCoord = 0, input = "";
    while (this.gameOver == false && (input.toUpperCase() != "Q")) {
        input = toetsenbord.question("-- om te stoppen: Q --\n-- om rechtermuisklik uit te voeren: R --\n-- om linkermuisklik uit te voeren: L --");
        if (input.toUpperCase() == "L") {
            columnCoord = parseInt(toetsenbord.question("geef kolomnummer in:\t"));
            rowCoord = parseInt(toetsenbord.question("geef rijnummer in:\t"));
            //2 following lines can be commmented out depening on the way of input of the coords
            /**/columnCoord--;
            /**/rowCoord--;
            this.leftClick(columnCoord, rowCoord);
        } else if (input.toUpperCase() == "R") {
            columnCoord = parseInt(toetsenbord.question("geef kolomnummer in:\t"));
            rowCoord = parseInt(toetsenbord.question("geef rijnummer in:\t"));
            //2 following lines can be commmented out depening on the way of input of the coords
            /**/columnCoord--;
            /**/rowCoord--;
            this.rightClick(columnCoord, rowCoord);
        }
    }
}
// a function that opens all the fields on the playboard
Board.prototype.revealAllFields = function () {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.playBoard[i][j].revealed = true;
        }
    }
}
// a function that checks if the covered fields are all bombs // if they are the player wins the game
Board.prototype.checkGameOver = function () {
    if ((this.numberOfFields == this.revealedFields + this.numBombs) || (this.flaggedRight == this.numBombs && this.flaggedByUser == this.flaggedRight)) {
        // enable for console //    this.youWin();
        this.gameOver = true;
        this.youWinGame = true;
        this.revealAllFields();
    }
}
// a function that ends the game
Board.prototype.gameIsOver = function () {
    this.revealAllFields();
// enable for console //    console.log("\n\nG A M E   O V E R\nA A\nM   M\nE     E\n                L\nO         O     O\nV           V   S\nE             E E\nR       L O S E R\n\n\n");
    this.gameOver = true;
}
// a function that displays a YOU WIN message
Board.prototype.youWin = function () {
    console.log("                              _");
    console.log("                             (_)");
    console.log(" _   _  ___  _   _  __      ___ _ __");
    console.log("| | | |/ _ \\| | | | \\ \\ /\\ / / | '_ \\");
    console.log("| |_| | (_) | |_| |  \\ V  V /| | | | |");
    console.log(" \\__, |\\___/ \\__,_|   \\_/\\_/ |_|_| |_|");
    console.log("  __/ |");
    console.log(" |___/");
    console.log("");
}

// TESTING PROGRAM  /////////////////////////////////////////////////////////////////////////////////
/*
var playboard = new Board(parseInt(toetsenbord.question("geef aantal kolommen in:\t")),
                parseInt(toetsenbord.question("geef het aantal rijen in:\t")),
                parseInt(toetsenbord.question("geef het aantal bommen in:\t")));
playboard.createBoard();
playboard.giveRandomNumbersArray()
playboard.placeBombs();
playboard.placeNumbers();
playboard.visualize();
playboard.inputCoords();
*/