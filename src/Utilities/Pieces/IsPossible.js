import { IsEqual } from "../../Components/ChessBoard";
import { IsCheck } from "../CheckMate";

export function EnPassant( board, currElement, pos) {
  let color = (currElement.get(board[pos[0]][pos[1]]) === "pawn_w" ? "pawn_b" : "pawn_w");
  let temp = (color === "pawn_w" ? 1 : -1);

  if (currElement.get(board[pos[2]][pos[3] + 1]) === color) return [pos[2], pos[3] + 1, pos[0] + temp, pos[1]];
  if (currElement.get(board[pos[2]][pos[3] - 1]) === color) return [pos[2], pos[3] - 1, pos[0] + temp, pos[1]];
  return [-1,-1,-1,-1];
}

function sameColor(board, currElement, currentDrag, pos) {
  const drop = currElement.get(board[pos[2]][pos[3]]);
  if (drop === null || currentDrag.length == 0) return false;
  if (drop[drop.length - 1] === currentDrag[currentDrag.length - 1])
    return true;
  return false;
}

function castle(currElement, board, pos, kingTouched, rookTouched) {
  let index = 0, color = "w";
  if (currElement.get(board[pos[0]][pos[1]]) === "king_w") {index = 7;color = "w";} 
  else {index = 0;color = "b";}

  if (kingTouched[index]) return false;

  if (currElement.get(board[pos[0]][pos[1]]) === "king_" + color && pos[0] == index && pos[1] == 4) {
    if (
      currElement.get(board[index][0]) === "rook_" + color &&
      currElement.get(board[index][1]) === "null" &&
      !rookTouched[index][0] &&
      pos[2] == index && pos[3] == 2
      ) return true;
    else if (
      currElement.get(board[index][7]) === "rook_" + color &&
      currElement.get(board[index][6]) === "null" &&
      !rookTouched[index][7] &&
      pos[2] == index && pos[3] == 6
      ) return true;
    return false;
  }
}

function PawnMove(board, currElement, pos, checkEnpassant) {
  let EnPassantPawn = JSON.parse(localStorage.getItem("EpMove"));

  let temp = (currElement.get(board[pos[0]][pos[1]]) === "pawn_w" ? 1 : -1);
  let row = (currElement.get(board[pos[0]][pos[1]]) === "pawn_w" ? 6 : 1);

  if (currElement.get(board[pos[2]][pos[3]]) === "null") {
    if (pos[1] == pos[3] && pos[0] == pos[2] + temp) { // one Step forward
      localStorage.setItem("EpMove", JSON.stringify(EnPassantPawn));
      return true;
    }
    else if (
    pos[0] == row &&
    currElement.get(board[pos[0] - temp][pos[1]]) === "null") {
      if (pos[1] == pos[3] && pos[0] == pos[2] + (temp * 2)) { // two step forward
        EnPassantPawn = EnPassant(board, currElement, pos);
        if (checkEnpassant)
        localStorage.setItem("EpMove", JSON.stringify(EnPassantPawn))
        return true;
      }
    } else if (IsEqual(EnPassantPawn, pos)) {
      localStorage.setItem("EpMove", JSON.stringify(EnPassantPawn));
      return true;
    }
  } else if ((Math.abs(pos[1] - pos[3]) == 1 && pos[0] == pos[2] + temp)) return true; // diagonalKil
}

function RookMove(board,currElement,pos) {
  var i;
  if (pos[0] == pos[2]) {
    // Horizontal move
    var dx = pos[1] < pos[3] ? 1 : -1;

    for (i = pos[1] + dx; i != pos[3]; i += dx)
      if (currElement.get(board[pos[0]][i]) != "null") return false;
  } else if (pos[1] == pos[3]) {
    // Vertical move
    var dy = pos[0] < pos[2] ? 1 : -1;

    for (i = pos[0] + dy; i != pos[2]; i += dy)
      if (currElement.get(board[i][pos[3]]) != "null") return false;
  } else return false;
  return true;
}

function BishopMove(board,currElement,pos) {
  if (Math.abs(pos[0] - pos[2]) == Math.abs(pos[1] - pos[3])) {
    var dx = pos[1] < pos[3] ? 1 : -1;
    var dy = pos[0] < pos[2] ? 1 : -1;
    var i = pos[0] + dy;
    var j = pos[1] + dx;
    for (; i != pos[2]; i += dy, j += dx)
      if (currElement.get(board[i][j]) != "null") return false;
  } else return false;
  return true;
}

// Game logic for checking if a move is possible
function isPossible(board,currElement,pos,kingTouched, rookTouched, checkEnpassant) {
  let drag = currElement.get(board[pos[0]][pos[1]])
  if (sameColor(board, currElement, drag, pos)) return false;

  if (drag === "rook_b" || drag == "rook_w") { // Rook movement check
    return RookMove(board,currElement,pos);
  } 
  else if (drag === "knight_b" || drag === "knight_w") { // Knight movement check
    if (
      (Math.abs(pos[0] - pos[2]) == 2 && Math.abs(pos[1] - pos[3]) == 1) || 
      Math.abs(pos[0] - pos[2]) == 1 && Math.abs(pos[1] - pos[3]) == 2
    ) return true;
  } 
  else if (drag === "bishop_w" || drag === "bishop_b") { // Bishop movement check
    return BishopMove(board,currElement,pos);
  } 
  else if (drag === "queen_b" || drag === "queen_w") { // Queen movement check
    return (
      RookMove(board, currElement, pos) ||
      BishopMove(board, currElement, pos)
    );
  } 
  else if (drag === "king_b" || drag === "king_w") { // King movement check
    if (
      (Math.abs(pos[0] - pos[2]) <= 1 &&
      Math.abs(pos[1] - pos[3]) <= 1 ) ||
      castle(currElement, board, pos,kingTouched, rookTouched)
    ) {
      let tempBoard = JSON.parse(JSON.stringify(board));
      tempBoard[pos[2]][pos[3]] = board[pos[0]][pos[1]];
      tempBoard[pos[0]][pos[1]] = null;
      if (IsCheck(tempBoard, currElement, (drag.at(-1) == 'w' ? 'b' : 'w'))[0] != -1) return false;
      return true;
    }
  } 
  else if (currElement.get(board[pos[0]][pos[1]]).startsWith("pawn")) { // Pawn movement check
    return PawnMove(board, currElement, pos, checkEnpassant);
  } 
}

export default isPossible;