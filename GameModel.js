export class Game {
    constructor({ squares = [], blackPieces = [], redPieces = [], capturedBlack = [], capturedRed = [], turn = true } = {}) {
        this.squares = squares;
        this.blackPieces = blackPieces;
        this.redPieces = redPieces;
        this.capturedBlack = capturedBlack;
        this.capturedRed = capturedRed;
        this.turn = turn; // True means it is black's turn
    }

    buildBoard() {
        const squares = new Array(32).fill(null).map(() => new Square(null, [], [])); // Fills the array with individual square classes 
        for (let i = 0; i < 32; i++) {
            let extremity = (i % 8 == 3) || (i % 8 == 4);
            let firstRow = i < 4;
            let lastRow = i + 4 >= 32;
            if (extremity && !firstRow && !lastRow) {
                squares[i].backwardSquares.push(squares[i - 4]);
                squares[i].forwardSquares.push(squares[i + 4]);
            } else if (!extremity && !firstRow && !lastRow) {
                squares[i].backwardSquares.push(squares[i - 4], squares[i - 5]);
                squares[i].forwardSquares.push(squares[i + 4], squares[i + 5]);
            } else if (extremity && !firstRow && lastRow) { // square 28
                squares[i].backwardSquares.push(squares[i - 4]);
                squares[i].forwardSquares.push(squares[i - 4]);
            } else if (!extremity && !firstRow && lastRow) {
                squares[i].backwardSquares.push(squares[i - 4], squares[i - 5]);
                squares[i].forwardSquares.push(squares[i - 4], squares[i - 5]);
            } else if (!extremity && firstRow && !lastRow) {
                squares[i].backwardSquares.push(squares[i + 4], squares[i + 5]);
                squares[i].forwardSquares.push(squares[i + 4], squares[i + 5]);
            } else { // square 3
                squares[i].backwardSquares.push(squares[i + 4]);
                squares[i].forwardSquares.push(squares[i + 4]);
            }
        }

        const blackPieces = [];
        for (let i = 0; i < 12; i++) {
            let blackPiece = new Piece(squares[i], [], true);
            blackPieces.push(blackPiece);
            squares[i].currentPiece = blackPiece;
        }

        const redPieces = [];
        for (let i = 20; i < 32; i++) {
            let redPiece = new Piece(squares[i], [], false)
            redPieces.push(redPiece);
            squares[i].currentPiece = redPiece;
        }

        this.squares = squares;
        this.blackPieces = blackPieces;
        this.redPieces = redPieces;
        this.capturedBlack = []; 
        this.capturedRed = []; 
        this.turn = true;

        return this;
    }

    clearBoard() {
        this.squares = new Array(32).fill(null).map(() => new Square(null, [], []));
    }
}

export class Piece {
    constructor(currentSquare, availableMoves, black, isKing, isCaptured) {
        this.currentSquare = currentSquare;
        this.availableMoves = availableMoves;
        this.black = black; // True means the piece is black
        this.isKing = isKing;
        this.isCaptured = isCaptured;
    }
}

export class Square {
    constructor(currentPiece, backwardSquares, forwardSquares) {
        this.currentPiece = currentPiece;
        this.backwardSquares = backwardSquares;
        this.forwardSquares = forwardSquares;
    }
}

export class Move {
    constructor(movingPiece, rating, travelSquares) {
        this.movingPiece = movingPiece;
        this.rating = rating; // Rating is based on the number of pieces captured
        this.travelSquares = travelSquares;
    }
}