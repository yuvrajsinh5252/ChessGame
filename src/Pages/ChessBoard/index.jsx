import "./index.css";
import { useState } from "react";
import x from "../../Utilities/Pieces/index.jsx";
import { useEffect } from "react";
import isPossible from "../../Utilities/Pieces/IsPossible";
import PawnPromote from "../../Components/PawnPromote";
import DragComplete from "../../Utilities/DragComplete";

if (!localStorage.getItem("EpMove")) localStorage.setItem("EpMove", JSON.stringify(new Array(4).fill(-1)));

let alpha = [];
for (let i = 0; i < 8; i++) {
    alpha.push(String.fromCharCode(97 + i))
}

export function IsEqual(x , y) {
  if (x.length != y.length) return false;
  for (let i in x) if (x[i] != y[i]) return false;
  return true;
}

function ChessBoard({ board, setBoard }) {
  const { pieces, currElement } = x;
  const [over, setOver] = useState([-1, -1]);
  const [currentDrag, setCurrentDrag] = useState([-1, -1]);
  const [availableSpc, setAvailableSpc] = useState(new Set());
  const [show, setShow] = useState(false);
  const [kill, setKill] = useState(new Set());
  const [pawnPromote, setPawnPromote] = useState([false,"white"]); 
  const [kingTouched, setKingTouched] = useState(new Array(8).fill(false));
  const [rookTouched, setRookTouched] = useState(new Array(8).fill(new Array(8).fill(false)));
  const [turn, setTurn] = useState("w");

  useEffect(() => {
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

  useEffect(() => {
    let n = 8;

    let drag2 = currentDrag[1];
    let drag1 = currentDrag[0];

    if (drag1 == -1 || drag2 == -1) return;
    if (!currElement.get(board[drag1][drag2]).endsWith(turn)) return;

    let temp = new Set();
    let temp2 = new Set();

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
      let pos = [drag1, drag2, i, j]
        if (isPossible(board,currElement,pos,kingTouched,rookTouched)) {
          temp.add([i, j]);
          if (currElement.get(board[i][j]) !== "null") {
            temp2.add([i, j]);
          } 
        } 

        var EnPassantMove = JSON.parse(localStorage.getItem("EpMove"));
        if (IsEqual(EnPassantMove, pos)) temp2.add([pos[2], pos[3]])
      }
    }
    setKill(temp2);
    setAvailableSpc(temp);
  }, [currentDrag]);

  return (
    <>
      <PawnPromote openIt={pawnPromote} setPawnPromote={setPawnPromote} board={board} setBoard={setBoard} index={over} />
      <div className="chessboard">
      <div className="col1">{alpha.map((el, id) => <div key={id} className="alpha-border">{el}</div>)}</div>
      <div className="col2">{alpha.map((el, id) => <div key={id} className="alpha-border">{el}</div>)}</div>
        <div className="border">
          {board.map((row, idx) => {
            return (
              <div key={idx}>
              <div className="idx">{idx}</div>
              <div className="idx1">{idx}</div>
              <div className="rows" key={idx}>
                {row.map((el, idx2) => {
                  return (
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
                        DragComplete(
                          board, setBoard, currentDrag, setCurrentDrag, over, setShow, currElement,
                          kingTouched, setKingTouched, rookTouched, setRookTouched, setPawnPromote,
                          turn, setTurn, availableSpc, pawnPromote
                          )
                        }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setOver([idx, idx2]);
                      }}
                      key={idx2}
                      className={
                        ((idx + idx2) % 2 == 0 ? "white" : "black") + " " +
                        ([...availableSpc].some((item) => IsEqual(item, [idx,idx2])) && show
                          ? "green" : "") + " " +
                        ([...kill].some((item) => IsEqual(item, [idx,idx2])) && show
                          ? "red" : "")
                      }
                    >
                      {board[idx][idx2] ? (
                        <img src={board[idx][idx2]} className="drag" />
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })} 
              </div>
              </div>
            );
          })}
        </div>
        <button
          className="reset"
          onClick={() => {
          setBoard(pieces);
          setShow(false);
          setKingTouched(new Array(10).fill(false));
          setRookTouched(new Array(10).fill(new Array(10).fill(false)));
          localStorage.setItem("board", JSON.stringify(pieces));
          }}
        >Restart</button>
      </div>
    </>
  );
}

export default ChessBoard;