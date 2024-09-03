const gameBoard = function gameBoard () {

    let board = [];
    const initBoard = ()=>{
        for(let i=0; i<3; i++) {
            board[i]=[];
            for(let j=0; j<3; j++){
                board[i].push(cell());
            }
        }
    }

    initBoard()
    const getBoard = ()=> board;
    const resetBoard = ()=> {
        board =[]
        initBoard()
    }

    return {getBoard, resetBoard};
}();

function cell () {
    let mark = ""
    const setMark = function (icon) {
        mark = icon;
    }
    const getMark = ()=> mark;
    
    return {
        getMark, setMark
    }
}

function player (name, marker) {
    let playerName = name;
    const getName = ()=> playerName;
    const getMarker = ()=> marker;
    const setName= (nuName)=> playerName = nuName; 
    
    return {
        getName, getMarker, setName
    }
}

const player01 = player ("Player01", "X");
const player02 = player ("Player02", "O");

const game = function gameController () {

    let gameEnd = false;
    let getGameEnd = ()=> gameEnd;

    let gameResult = "";
    let getGameResult = ()=> gameResult;

    let activePlayer = player01; //default active player
    const getActivePlayer = ()=> activePlayer;
    const updateActivePlayer = ()=> {
        if (activePlayer == player01) { 
            activePlayer= player02} else {
            activePlayer= player01
        }
    }

    const checkValid = (cell)=> {
        if (cell.getMark() == "") {
            return true;
        } else {return false}
    }

    const changeMark = (cell, player)=> {
        if (checkValid(cell)) {
            cell.setMark(player.getMarker())
        }
    }

    function checkWin () {

        let board = gameBoard.getBoard();

        //win in row
        for(let i =0; i<3; i++){
            if (board[i][0].getMark() == board[i][1].getMark() && board[i][1].getMark() == board[i][2].getMark() && board[i][0].getMark() != "") {
                gameResult = `Row win! in row ${i+1} for ${activePlayer.getName()}`;
                gameEnd = true;
                return
            };
        }

        //win in column
        for(let j =0; j<3; j++){
            if (board[0][j].getMark() == board[1][j].getMark() && board[1][j].getMark() == board[2][j].getMark() && board[0][j].getMark() != "") {
                gameResult = `Column win! in column ${j+1} for ${activePlayer.getName()}`;
                gameEnd = true;
                return true
            };
        }

        //diagonal
        if ((board[0][2].getMark() == board[1][1].getMark() && board[1][1].getMark() == board[2][0].getMark() && board[0][2].getMark() != "") || 
        (board[0][0].getMark() == board[1][1].getMark() && board[1][1].getMark() == board[2][2].getMark() && board[0][0].getMark() != "")) {
            gameResult = `Win in diagonal line for ${activePlayer.getName()}`;
            gameEnd = true;
            return true
        }

        //tie
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++){
                if (board[i][j].getMark() == ""){
                return
                }
            }
        }
        gameResult = "its a tie"//no past conditions satisfied and no cell empty, so its a tie
        gameEnd = true;
    }

    const resetGameFlow = ()=> {
        gameEnd = false;
        gameResult = ""
        activePlayer = player01;
    }; 

    return {
        getActivePlayer, updateActivePlayer, checkValid, changeMark, checkWin, getGameEnd, getGameResult, resetGameFlow
    }
}();

const firstPage = function firstPage (){
    const body = document.querySelector("body")
    const submitBtn = document.querySelector(".submit")
    const container = document.querySelector(".container")
    submitBtn.addEventListener("click", ()=>{
        let p1Name = document.querySelector("#P1name")
        let p2Name = document.querySelector("#P2name")
        player01.setName(p1Name.value)
        player02.setName(p2Name.value)
        body.removeChild(container)
        domControl()
    })
}();

const domControl = function domControl (){
    const anon = document.querySelector(".anon")
    anon.textContent = `It's ${game.getActivePlayer().getName()}'s Turn!`

    const gridContainer = document.querySelector(".grid")
    const grid = document.createElement("div")

    gridContainer.appendChild(grid)
    const endDialog = document.createElement("dialog")
    endDialog.className = "endGame"
    const resetBtn = document.createElement("button")
    resetBtn.className = "resetBtn"
    resetBtn.innerText = "reset"

    let board = []
    for(let i=0; i<3; i++) {
        board[i]=[];
        let newRow = document.createElement("div")
        newRow.className = `row`
        grid.appendChild(newRow)
        for(let j=0; j<3; j++){
            let newCell = document.createElement("div")
            newCell.className = "cell"
            newCell.id = `[${i}][${j}]`
            newRow.appendChild(newCell);
            board[i].push(newCell);
            newCell.addEventListener("click", ()=>{
                game.changeMark(gameBoard.getBoard()[i][j], game.getActivePlayer())
                if (newCell.textContent == "") {
                    newCell.innerText = game.getActivePlayer().getMarker()}
                game.checkWin()
                if (game.getGameEnd()) {
                    console.log(game.getGameResult())
                    endDialog.innerHTML = `
                    <h2>${game.getGameResult()}</h2>
                    `
                    endDialog.appendChild(resetBtn)
                    gridContainer.appendChild(endDialog)
                    endDialog.showModal()
                }
                game.updateActivePlayer()
                anon.textContent = `It's ${game.getActivePlayer().getName()}'s Turn!`
            })
        }
    }

    resetBtn.addEventListener("click", ()=> {
        gameBoard.resetBoard()
        game.resetGameFlow()
        endDialog.close()
        gridContainer.removeChild(grid)
        domControl()
    })
};
