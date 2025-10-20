export class Game {
    constructor({ squares = [], blackPieces = [], redPieces = [], capturedBlack = [], capturedRed = [], mustPlaysBlack = [], mustPlaysRed = [], turn = true } = {}) {
        this.squares = squares;
        this.blackPieces = blackPieces;
        this.redPieces = redPieces;
        this.capturedBlack = capturedBlack;
        this.capturedRed = capturedRed;
        this.mustPlaysBlack = mustPlaysBlack;
        this.mustPlaysRed = mustPlaysRed;
        this.turn = turn; // True means it is black's turn
    }

    buildBoard() {
        const squares = new Array(32).fill(null).map(() => new Square(null, [], [])); // Fills the array with individual square classes 
        let row = 0;
        for (let i = 0; i < 32; i++) {
            let extremity = (i % 8 == 3) || (i % 8 == 4);
            let firstRow = i < 4;
            let lastRow = i + 4 >= 32;
            let increment = row % 2 == 0 ? 4 : 3;

            if (extremity && !firstRow && !lastRow) {
                squares[i].backwardSquares.push(squares[i - increment]);
                squares[i].forwardSquares.push(squares[i + increment]);
            } else if (!extremity && !firstRow && !lastRow) {
                squares[i].backwardSquares.push(squares[i - increment], squares[i - increment - 1]);
                squares[i].forwardSquares.push(squares[i + increment], squares[i + increment + 1]);
            } else if (extremity && !firstRow && lastRow) { // square 28
                squares[i].backwardSquares.push(squares[i - increment]);
                squares[i].forwardSquares.push(squares[i - increment]);
                squares[i].endingRow = true;
            } else if (!extremity && !firstRow && lastRow) {
                increment = 4;
                squares[i].backwardSquares.push(squares[i - increment], squares[i - increment - 1]);
                squares[i].forwardSquares.push(squares[i - increment], squares[i - increment - 1]);
                squares[i].endingRow = true;
            } else if (!extremity && firstRow && !lastRow) {
                squares[i].backwardSquares.push(squares[i + increment], squares[i + increment + 1]);
                squares[i].forwardSquares.push(squares[i + increment], squares[i + increment + 1]);
                squares[i].endingRow = true;
            } else { // square 3
                squares[i].backwardSquares.push(squares[i + increment]);
                squares[i].forwardSquares.push(squares[i + increment]);
                squares[i].endingRow = true;
            }

            squares[i].index = i;
            if ((i + 1) % 4 === 0) row++;
        }

        const blackPieces = [];
        const redPieces = [];

        /*
        const blackPawnIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const redPawnIndices = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]; */

        const blackPawnIndices = [8, 10, 15, 19];
        const redPawnIndices   = [14, 21, 23, 25, 27, 30, 22];

        for (let i = 0; i < 32; i++) {
            const square = squares[i];
            if (blackPawnIndices.includes(i)) {
                const piece = new Piece(square, new Set(), true, false, false); 
                square.currentPiece = piece;
                blackPieces.push(piece);
            } else if (redPawnIndices.includes(i)) {
                const piece = new Piece(square, new Set(), false, false, false);
                square.currentPiece = piece;
                redPieces.push(piece);
            }
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
        this.availableMoves = availableMoves; // Set
        this.black = black; // True means the piece is black
        this.isKing = isKing;
        this.isCaptured = isCaptured;
    }

    calculateMoves() {
        if (this.currentSquare && !this.isCaptured) {
            if (this.black) {
                for (let i = 0; i < this.currentSquare.forwardSquares.length; i++) {
                    if (this.currentSquare.forwardSquares[i].currentPiece && !this.currentSquare.forwardSquares[i].currentPiece.black) { // Forward square is occupied
                        if (!this.currentSquare.forwardSquares[i].forwardSquares[i]) { continue; }
                        console.log("Attempting Chain...");
                        const squareStack = [this.currentSquare.forwardSquares[i].forwardSquares[i]];
                        const visitedSquares = [this.currentSquare.forwardSquares[i]];
                        const searchOutput = [this.currentSquare, this.currentSquare.forwardSquares[i]];
                        let unoccupied = true;
                        let parentSquare;
                        while (squareStack.length > 0) {
                            const x = squareStack.pop();
                            searchOutput.push(x);

                            console.log("Current square at: " + x.index + " Unoccupied: " + unoccupied);

                            if (unoccupied && !x.currentPiece || !parentSquare) {
                                unoccupied = false;
                                parentSquare = x;
                                x.forwardSquares.forEach((y) => {
                                    const condition = y.currentPiece && y.currentPiece.black ? false : true;
                                    console.log("Hey: " + condition);
                                    if (!visitedSquares.includes(y) && condition) {
                                        console.log("Adding children square: " + y.index);
                                        squareStack.push(y);
                                        visitedSquares.push(y);
                                    }
                                });
                            } else if (!unoccupied && x.currentPiece) {
                                unoccupied = true;
                                console.log("Adding sole child at: " + x.forwardSquares[parentSquare.forwardSquares.indexOf(x)] + "With parent at: " + parentSquare.index);
                                squareStack.push(x.forwardSquares[parentSquare.forwardSquares.indexOf(x)]);
                                visitedSquares.push(x.forwardSquares[parentSquare.forwardSquares.indexOf(x)]);
                            } else { // Chain broken
                                parentSquare = null;
                                if (!x.currentPiece && squareStack.length <= 0) { // Avoid including the root
                                    console.log("Chain broken at: " + x.index);
                                    const move = new Move(this, 0, [...searchOutput]);
                                    move.calculateRating();
                                    this.availableMoves.add(move);
                                } else if (squareStack.length > 0) { searchOutput.pop(); }

                                continue;
                            }

                            console.log(searchOutput);

                            if (x.endingRow) {
                                if (x.currentPiece) { searchOutput.pop(); }
                                parentSquare = null;
                                console.log("Last square at: " + x.index);
                                const move = new Move(this, 0, [...searchOutput]);
                                move.calculateRating();
                                this.availableMoves.add(move);
                                searchOutput.pop();
                                while (squareStack.length > 1) { squareStack.pop(); }
                                while (searchOutput.length > 3) { searchOutput.pop(); }
                            }
                        }
                    } else if (!this.currentSquare.forwardSquares[i].currentPiece) { // Forward square is empty
                        console.log("Empty child");
                        let move = new Move(this, 0, [this.currentSquare, this.currentSquare.forwardSquares[i]]);
                        move.calculateRating();
                        this.availableMoves.add(move);
                    }
                }
            }
        }

        console.log(this.availableMoves);
    }
}

export class Square {
    constructor(currentPiece, backwardSquares, forwardSquares, endingRow, index) {
        this.currentPiece = currentPiece;
        this.backwardSquares = backwardSquares;
        this.forwardSquares = forwardSquares;
        this.endingRow = endingRow ? endingRow : false;
        this.index = index;
    }
}

export class Move {
    constructor(movingPiece, rating, travelSquares) {
        this.movingPiece = movingPiece;
        this.rating = rating; // Rating is based on the number of pieces captured
        this.travelSquares = travelSquares;
    }

    calculateRating() {
        this.rating = 0;
        for (let i = 1; i < this.travelSquares.length; i++) {
            if (this.travelSquares[i].currentPiece) {
                this.rating++;
                console.log("Captured a piece!");
            }
        }
    }
}