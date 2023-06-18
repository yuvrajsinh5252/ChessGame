import "./index.css";
import x from "../../Utilities/Pieces/index.jsx";
import { useEffect } from "react";
import DragComplete from "../../Utilities/DragComplete";
import { IsCheck, defendCheck } from "../../Utilities/CheckMate";

if (!localStorage.getItem("EpMove")) localStorage.setItem("EpMove", JSON.stringify(new Array(4).fill(-1)));

export function IsEqual(x , y) {
  if (x.length != y.length) return false;
  for (let i in x) if (x[i] != y[i]) return false;
  return true;
}

function ChessBoard({ board, setBoard,check, setCheck, over, setOver, currentDrag, setCurrentDrag, availableSpc, setAvailableSpc, show, setShow, turn, setTurn, kill, setKill, pawnPromote, setPawnPromote, kingTouched, setKingTouched, rookTouched, setRookTouched, setGameOver }) {

  const { pieces, currElement } = x;

  useEffect(() => { // Setting up the board
    var temp = localStorage.getItem("board");
    var kingTouched = localStorage.getItem("kingTouched");
    var rookTouched = localStorage.getItem("rookTouched");
    var turns = localStorage.getItem("turn");

    if (!temp) {
      var temp_board = [];
      for (let i = 0; i < 8; i++) {
        let temp = [];
        for (let j = 0; j < 8; j++) temp.push(pieces[i][j]);
        temp_board.push(temp);
      }
      setBoard(temp_board)
    
    } else setBoard(JSON.parse(temp));

    if (kingTouched) setKingTouched(JSON.parse(kingTouched));
    if (rookTouched) setRookTouched(JSON.parse(rookTouched));
    if (turns) setTurn(JSON.parse(turns));
  }, []);

  useEffect(() => { // highLighting Moves
    let n = 8;
    let drag1 = currentDrag[0];
    let drag2 = currentDrag[1];
    let temp = new Set();
    let temp2 = new Set();

    if (drag1 == -1 || drag2 == -1) return;
    if (!currElement.get(board[drag1][drag2]).endsWith(turn)) return; 

    temp = defendCheck(board, currElement, turn, drag1, drag2);
    for (const move of temp) {
      if (currElement.get(board[move[0]][move[1]]) != "null") {
        temp2.add(move);
      }
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
      let pos = [drag1, drag2, i, j]

      var EnPassantMove = JSON.parse(localStorage.getItem("EpMove"));
      if (IsEqual(EnPassantMove, pos)) temp2.add([pos[2], pos[3]])
      }
    }
    setKill(temp2);
    setAvailableSpc(temp);
  }, [currentDrag]);

  return (
    <>
      <div className="chessboard">
        <div className="border">
          {board.map((row, idx) => {
            return (
              <div key={idx}>
              <div className="idx">{idx}</div>
              <div className="idx1">{idx}</div>
              <div className="rows">
                {row.map((el, idx2) => {
                  return (
                    <div key={idx2}>
                    <div className="container" key={JSON.stringify(el)}>
                      {idx == 0 ? <div className="alpha1">{String.fromCharCode(97 + idx2)}</div> : <></>}
                    <div
                      onClick={() => {
                        setCurrentDrag([idx, idx2]);
                        if (!currElement.get(board[idx][idx2]).endsWith(turn)) return;
                        setTimeout(() => {setShow(true)}, 50)
                      }}
                      onDragStart={(e) => {
                        setCurrentDrag([idx,idx2]);
                        if (!currElement.get(board[idx][idx2]).endsWith(turn)) return;
                        setTimeout(() => {setShow(true)}, 50)
                      }}
                      onDragEnd={() => {
                        if (!currElement.get(board[idx][idx2]).endsWith(turn)) return;
                        let temp = DragComplete(
                          board, setBoard, currentDrag, over, setShow, currElement,
                          kingTouched, setKingTouched, rookTouched, setRookTouched, setPawnPromote,
                          turn, setTurn, availableSpc, pawnPromote
                          )

                          if (temp[0][0] == -1) return;
                          let kingPos = IsCheck(temp, currElement, turn);
                          let kingPos2 = IsCheck(temp, currElement, turn == "w" ? "b" : "w");
                          let king = (kingPos[0] != -1 ? kingPos : kingPos2)

                          if (king[0] != -1) setCheck([true, king]);
                          else setCheck([false,[-1,-1]]);

                          let IsGameOver = new Set();
                          for (let i = 0; i < 8; i++) {
                            for (let j = 0; j < 8; j++) {
                              if (currElement.get(board[i][j]) != "null") {
                                let temp1 = defendCheck(temp, currElement, (turn == 'w' ? 'b' : 'w'), i, j);
                                if (temp1.size != 0) IsGameOver.add([i,j])
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
                          setCurrentDrag([-1, -1]);                          
                        }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setOver([idx, idx2]);
                      }}
                      key={idx2}
                      className={
                        ((idx + idx2) % 2 == 0 ? "white" : "black") + " " +
                        ([...kill].some((item) => IsEqual(item, [idx,idx2])) && show
                          ? "red" : "") + " " +
                        (IsEqual(check[1], [idx,idx2]) ? "check" : "")
                      }
                    >
                      {board[idx][idx2] ? (
                        <img src={board[idx][idx2]} className="drag" />
                      ) : (
                        <div 
                        className={([...availableSpc].some((item) => IsEqual(item, [idx,idx2])) && show
                          ? "green" : "")}
                        ></div>
                      )}
                    </div>
                    <div className="container">{idx == 7 ? <div className="alpha2">{String.fromCharCode(97 + idx2)}</div> : <></>}</div>
                    </div>
                    </div>
                  );
                })} 
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ChessBoard;