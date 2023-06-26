import isPossible from "../Pieces/IsPossible";

let rook = new Array(8).fill(new Array(8).fill(false));
let king = new Array(8).fill(false); 

export function defendCheck(board, currElement, turn, drag1, drag2, checkEnpassant = false) {
    let possibleMoves = new Set();

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isPossible(board, currElement, [drag1, drag2, i, j], king, rook, checkEnpassant)) {
                let tempBoard = JSON.parse(JSON.stringify(board));

                if (currElement.get(tempBoard[i][j]).startsWith("king")) continue;

                tempBoard[i][j] = board[drag1][drag2];
                if (currElement.get(board[i][j]) == "null") tempBoard[drag1][drag2] = board[i][j];       
                else tempBoard[drag1][drag2] = null;
                if (IsCheck(tempBoard, currElement, (turn == 'w' ? 'b' : 'w'))[0] == -1) possibleMoves.add([i, j]);
            }
        }
    }
    return possibleMoves;
}

export function IsCheck(board, currElement, turn) {
    let kingPos = []

    for (let k = 0; k < 2; k++) {
        let temp = (turn === 'w' ? 'b' : 'w');
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (currElement.get(board[i][j]) == ("king_" + temp)) {
                    kingPos = [i,j];
                }   
            }
        }
        if (kingPos.length != 0) break;
    }
    

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (currElement.get(board[i][j]).endsWith(turn)) {
                if (isPossible(board, currElement, [i, j, kingPos[0], kingPos[1]], king, rook)) return kingPos;
            }
        }
    }
    return [-1,-1];
}