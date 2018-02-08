'use strict';
var startTimer = false;
// when the document is ready
$('document').ready(function(){
    $('#btnsweeper').click(function(){
        var columns = parseInt($('#columnInput').val());
        var rows = parseInt($('#rowInput').val());
        var bombs = parseInt($('#bombsInput').val());
        startTimer = false
        createPlayBoard(columns, rows, bombs);
    })
})
// this is a global variable that prevents the game of having more playboards
// by setting it global, the playboard-object is overwritten by the new one
var playboard=null;
// a function that creates the minesweeper playboard
function createPlayBoard(columns, rows, bombs){
    playboard = new Board(columns, rows, bombs);
    playboard.createBoard();
    playboard.giveRandomNumbersArray()
    playboard.placeBombs();
    playboard.placeNumbers();
    refreshTable(playboard);
    prepareForClicks(playboard);
    $("#gameDataRemainingBombs").html("Bombs remaining: <span></span>");
    $("#gameDataRemainingBombs>span").html(playboard.remainingBombs);
    $("#gameDataWinLose").html("Status: <span></span>");
    $("#gameDataTime").html("Time played: <span id='timetracker'></span>");
    var showSpendTimeOfBoard = setInterval(function(){
         $('#gameDataTime>span').text(playboard.timeSpend);
         if(playboard.gameOver) clearInterval(showSpendTimeOfBoard);
    },1000)
}
// a function that returns the tbody of the playboard
function returnTableBody(object){
    var tbody = document.createElement("tbody");
    for(var i = 0; i<object.rows;i++){
        var tr = document.createElement("tr");
        for(var j=0;j<object.columns;j++){
            var td = document.createElement("td");
            td.innerText=object.playBoard[i][j].show();
            if(td.innerText==0)td.innerText="";
            $(td).addClass("playField");
            $(td).attr({"data-rowCoord":object.playBoard[i][j].rowCoord, "data-columnCoord":object.playBoard[i][j].columnCoord});
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    return tbody;
}
// a function that creates clickable fields and sets the actions for left and right clicking
// and checks if the game is won or lost
function prepareForClicks(object){
    if(!object.gameOver){
        // lines below prevents a menu when right clicking
        $('#minesweeperTable').contextmenu(function() {
            return false;
        });
        // lines below sets the actions for clicking
        $('#minesweeperTable .playField').mousedown(function(event){
            switch (event.which) {
                case 1:
                case 2: object.leftClick(parseInt($(this).attr("data-columnCoord")),parseInt($(this).attr("data-rowCoord")));
                        break;
                case 3: object.rightClick(parseInt($(this).attr("data-columnCoord")),parseInt($(this).attr("data-rowCoord")));
                        break;
            }
            $('#gameDataRemainingBombs>span').html(object.remainingBombs);
            refreshTable(object);
        });
    } else {
        var winLoseMessage = object.youWinGame == true?"<span class='label label-success'>You win!</span>":"<span class='label label-danger'>You lose!</span>";
        $("#gameDataWinLose>span").html(winLoseMessage);
    }
}
// a function that refreshes the table in the html
function refreshTable(object){
        $('#minesweeperTable').html(returnTableBody(object));
        prepareForClicks(object);
}