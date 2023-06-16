import isPossible from "../Pieces/IsPossible";
import { IsEqual } from "../../Pages/ChessBoard";

function DragComplete(board, setBoard, currentDrag, setCurrentDrag, over, setShow, currElement, kingTouched, setKingTouched, rookTouched, setRookTouched, setPawnPromote, turn, setTurn, pawnPromote) {
  setShow(false);

  let i = currentDrag[0];
  let j = currentDrag[1];
  let a = over[0];
  let b = over[1];
  let pos = [i,j,a,b];

  if (a == -1 || b == -1 || i == -1 || j == -1) return <></>;

  if (
    currElement.get(board[i][j]).startsWith("pawn") &&
    (a == 0 || a == 7) &&
    isPossible(board,currElement,pos,kingTouched,rookTouched)
  ) {
    let color = currElement.get(board[i][j]).endsWith("b") ? "black" : "white";
    setPawnPromote([true, color]);
  }

  var temp = JSON.parse(JSON.stringify(board));
  var EnPassantMove = JSON.parse(localStorage.getItem("EpMove"))

  if (IsEqual(pos, EnPassantMove)) {
    let x = (turn == "w" ? 1 : -1);
    temp[pos[2] + x][pos[3]] = null;
  }  

  if (
    isPossible(board,currElement,pos,kingTouched,rookTouched)
  ) {
    temp[i][j] = null;
    temp[a][b] = board[i][j];


    if (currElement.get(board[i][j]).startsWith("king")) {
      if (!kingTouched[i]) {
        if (b == 6) {
          temp[i][5] = temp[i][7];
          temp[i][7] = null;
        } else if (b == 2) {
          temp[i][3] = temp[i][0];
          temp[i][0] = null;
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
  setBoard(temp);
  setCurrentDrag([-1, -1]);

  return <></>
}

export default DragComplete;