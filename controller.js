import { Game, Piece, Square, Move } from "./GameModel.js";

let mainBoard = new Game().buildBoard();

function drawBoard() {
    console.log(mainBoard.squares);
    for (let i = 0; i < mainBoard.squares.length; i++) {
        let squarePiece = mainBoard.squares[i].currentPiece;
        let squareElement = document.getElementById("" + i);
        while (squareElement.firstChild) { squareElement.firstChild.remove(); }
        if (squarePiece) {
            let pieceImage = document.createElement("img");
            pieceImage.src = squarePiece.black ? "./Sprites/blackpawn.png" : "./Sprites/redpawn.png";
            pieceImage.alt = "checkerspiece";
            squareElement.appendChild(pieceImage);
        }
    }

    mainBoard.squares[8].currentPiece.calculateMoves();
}

window.addEventListener("DOMContentLoaded", () => {
    drawBoard();
});