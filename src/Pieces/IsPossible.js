function sameColor(board, currElement, currentDrag, DropIdx1, DropIdx2) {
  const drop = currElement.get(board[DropIdx1][DropIdx2]);
  if (drop === null) return false;
  if (drop[drop.length - 1] === currentDrag[currentDrag.length - 1])
    return true;
  return false;
}

function RookMove(
  board,
  currElement,
  DragIdx1,
  DragIdx2,
  DropIdx1,
  DropIdx2
) {
  var i;
  if (DragIdx1 == DropIdx1) {
    // Horizontal move
    var dx = DragIdx2 < DropIdx2 ? 1 : -1;

    for (i = DragIdx2 + dx; i != DropIdx2; i += dx)
      if (currElement.get(board[DragIdx1][i]) != "null") return false;
  } else if (DragIdx2 == DropIdx2) {
    // Vertical move
    var dy = DragIdx1 < DropIdx1 ? 1 : -1;

    for (i = DragIdx1 + dy; i != DropIdx1; i += dy)
      if (currElement.get(board[i][DropIdx2]) != "null") return false;
  } else return false;
  return true;
}

function BishopMove(
  board,
  currElement,
  DragIdx1,
  DragIdx2,
  DropIdx1,
  DropIdx2
) {
  if (Math.abs(DragIdx1 - DropIdx1) == Math.abs(DragIdx2 - DropIdx2)) {
    var dx = DragIdx2 < DropIdx2 ? 1 : -1;
    var dy = DragIdx1 < DropIdx1 ? 1 : -1;
    var i = DragIdx1 + dy;
    var j = DragIdx2 + dx;
    for (; i != DropIdx1; i += dy, j += dx)
      if (currElement.get(board[i][j]) != "null") return false;
  } else return false;
  return true;
}

function isPossible(
  board,
  currElement,
  drag,
  DragIdx1,
  DragIdx2,
  DropIdx1,
  DropIdx2
) {
  if (sameColor(board, currElement, drag, DropIdx1, DropIdx2)) return false;

  if (drag === "rook_b" || drag == "rook_w") { // Rook movement check
    return RookMove(
      board,
      currElement,
      DragIdx1,
      DragIdx2,
      DropIdx1,
      DropIdx2
    );
  } else if (drag === "knight_b" || drag === "knight_w") { // Knight movement check
    if (
      Math.abs(DragIdx1 - DropIdx1) == 2 &&
      Math.abs(DragIdx2 - DropIdx2) == 1
    )
      return true;
    else if (
      Math.abs(DragIdx1 - DropIdx1) == 1 &&
      Math.abs(DragIdx2 - DropIdx2) == 2
    )
      return true;
  } else if (drag === "bishop_w" || drag === "bishop_b") { // Bishop movement check
    return BishopMove(
      board,
      currElement,
      DragIdx1,
      DragIdx2,
      DropIdx1,
      DropIdx2
    );
  } else if (drag === "queen_b" || drag === "queen_w") { // Queen movement check
    return (
      RookMove(
        board,
        currElement,
        DragIdx1,
        DragIdx2,
        DropIdx1,
        DropIdx2
      ) ||
      BishopMove(
        board,
        currElement,
        DragIdx1,
        DragIdx2,
        DropIdx1,
        DropIdx2
      )
    );
  } else if (drag === "king_b" || drag === "king_w") { // King movement check
    if (
      Math.abs(DragIdx1 - DropIdx1) <= 1 &&
      Math.abs(DragIdx2 - DropIdx2) <= 1
    )
      return true;
  } else if (drag === "pawn_w") {
    // Pawn movement check
    if (currElement.get(board[DropIdx1][DropIdx2]) === "null") {
      if (DragIdx2 == DropIdx2 && DragIdx1 == DropIdx1 + 1) return true;
      else if (
        DragIdx1 == 6 &&
        currElement.get(board[DragIdx1 - 1][DragIdx2]) === "null"
      ) {
        if (DragIdx2 == DropIdx2 && DragIdx1 == DropIdx1 + 2) return true;
      }
    } else if (Math.abs(DragIdx2 - DropIdx2) == 1 && DragIdx1 == DropIdx1 + 1)
      return true;
  } else if (drag === "pawn_b") {
// Pawn movement check
    if (currElement.get(board[DropIdx1][DropIdx2]) === "null") {
      if (DragIdx2 == DropIdx2 && DragIdx1 == DropIdx1 - 1) return true;
      else if (
        DragIdx1 == 1 &&
        currElement.get(board[DragIdx1 + 1][DragIdx2]) === "null"
      ) {
        if (DragIdx2 == DropIdx2 && DragIdx1 == DropIdx1 - 2) return true;
      }
    } else {
      if (Math.abs(DragIdx2 - DropIdx2) == 1 && DragIdx1 == DropIdx1 - 1)
        return true;
    }
  } else {
    console.log("error");
  }
}

export default isPossible;