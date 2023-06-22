import { IsEqual } from "../../Components/ChessBoard";
import { defendCheck, IsCheck } from "../CheckMate";

function DragComplete(board, setBoard, currentDrag, over, setShow, currElement, kingTouched, setKingTouched, rookTouched, setRookTouched, setPawnPromote, turn, setTurn, pawnPromote, setCheck, check, setGameOver) {
  let noatation = JSON.parse(localStorage.getItem("Notation"))
  setShow(false);

  let i = currentDrag[0];
  let j = currentDrag[1];
  let a = over[0];
  let b = over[1];
  let pos = [i, j, a, b];
  let killNote = "";
  let noting = false;
  
  let temp = JSON.parse(JSON.stringify(board));
  
  let obj = (currElement.get(temp[pos[0]][pos[1]]).startsWith("pawn") ? '' : currElement.get(temp[pos[0]][pos[1]])[0].toUpperCase())
  let EnPassantMove = JSON.parse(localStorage.getItem("EpMove"))

  if (i == a && j == b) return false;

  let possibleMoves = defendCheck(board, currElement, turn, pos[0], pos[1], true);  
  let possible = false;
  for (const move of possibleMoves) {
    if (IsEqual(move, [pos[2], pos[3]])) {
      possible = true;
      break;
    }
  }

  if (
    currElement.get(board[i][j]).startsWith("pawn") &&
    (a == 0 || a == 7) && possible
  ) {
    let color = currElement.get(board[i][j]).endsWith("b") ? "black" : "white";
    setPawnPromote([true, color]);
  }

  if (IsEqual(pos, EnPassantMove)) {
    let x = (turn == "w" ? 1 : -1);
    temp[pos[2] + x][pos[3]] = null;
    noatation.Moves.push(`${String.fromCharCode(j + 97)}x${String.fromCharCode(b + 97)}${8-a}`);
    noting = true;
  }

  if (possible) {
    if (temp[a][b] != null) killNote = 'x';
    temp[a][b] = board[i][j];
    temp[i][j] = null;

    if (currElement.get(board[i][j]).startsWith("king")) {
      if (!kingTouched[i]) {
        if (b == 6) {
          temp[i][5] = temp[i][7];
          temp[i][7] = null;
          noatation.Moves.push("O-O");
          noting = true;
        } else if (b == 2) {
          temp[i][3] = temp[i][0];
          temp[i][0] = null;
          noatation.Moves.push("O-O-O");
          noting = true;
        }
        kingTouched[i] = true;
        setKingTouched(kingTouched);
      }
    }

    if (currElement.get(board[i][j]).startsWith("rook")) {
      if (!rookTouched[i][j]) {
        rookTouched[i][j] = true;
        setRookTouched(rookTouched);
      }
    }
    if (!pawnPromote[0]) {
      setTurn(turn == "w" ? "b" : "w");
      localStorage.setItem("turn", JSON.stringify(turn == "w" ? "b" : "w"))
    }
  }
  localStorage.setItem("board", JSON.stringify(temp));
  localStorage.setItem("kingTouched", JSON.stringify(kingTouched));
  localStorage.setItem("rookTouched", JSON.stringify(rookTouched));
  localStorage.setItem("HistMove", JSON.stringify(pos));
  setBoard(temp);

  let kingPos = IsCheck(temp, currElement, turn);
  let kingPos2 = IsCheck(temp, currElement, turn == "w" ? "b" : "w");
  let king = (kingPos[0] != -1 ? kingPos : kingPos2);

  if (king[0] != -1) {
    check = [true, king];
    setCheck([true, king]);
  }
  else setCheck([false, [-1, -1]]);

  if (!noting && possible) noatation.Moves.push(`${obj+killNote+String.fromCharCode(j + 97)+(8-i)+(check[0] ? '+' : '')}`);
  localStorage.setItem("Notation", JSON.stringify(noatation))
  
  let IsGameOver = new Set();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (currElement.get(board[i][j]) != "null") {
        let temp1 = defendCheck(temp, currElement, (turn == 'w' ? 'b' : 'w'), i, j);
        if (temp1.size != 0) IsGameOver.add([i, j])
      }
    }
  }

  if (IsGameOver.size == 0) {
    if (check[0]) {
      setGameOver([true, "CheckMate", turn]);
    } else {
      setGameOver([true, "Draw", turn]);
    }
  }
  return possible;
}

export default DragComplete;