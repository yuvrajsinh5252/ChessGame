import "./index.css";
import { useState } from "react";
import x from "../../Pieces/index.jsx";
import { useEffect } from "react";
import isPossible from "../../Pieces/IsPossible";

function IsEqual(x , y) {
  if (x.length != y.length) return false;
  for (let i in x) if (x[i] != y[i]) return false;
  return true;
}

function ChessBoard({ board, setBoard }) {
  const [over, setOver] = useState([-1, -1]);
  const [currentDrag, setCurrentDrag] = useState([-1, -1]);
  const [availableSpc, setAvailableSpc] = useState(new Set());
  const [show, setShow] = useState(false);
  const { pieces } = x;
  const { currElement } = x;

  useEffect(() => {
    var temp = localStorage.getItem("board");
    if (!temp) {
      var temp_board = [];
      for (let i = 0; i < 8; i++) {
        let temp = [];
        for (let j = 0; j < 8; j++) temp.push(pieces[i][j]);
        temp_board.push(temp);
      }
      setBoard(temp_board);
    } else setBoard(JSON.parse(temp));
  }, []);

  useEffect(() => {
    let n = 8;

    let drag2 = currentDrag[1];
    let drag1 = currentDrag[0];

    if (drag1 == -1 || drag2 == -1) return;
    let temp = new Set();

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (
          isPossible(
            board,
            currElement,
            currElement.get(board[drag1][drag2]),
            drag1,
            drag2,
            i,
            j
          )
        ) {
          temp.add([i, j]);
        }
      }
    }
    setAvailableSpc(temp);
  }, [currentDrag]);

  return (
    <>
      <div className="chessboard">
        <div className="border">
          {board.map((row, idx) => {
            return (
              <div className="rows" key={idx}>
                {row.map((el, idx2) => {
                  return (
                    <div
                      onClick={() => {
                        setShow(!show);
                        setCurrentDrag([idx, idx2]);
                      }}
                      onDragStart={(e) => {
                        setShow(true);
                        setCurrentDrag([idx, idx2]);
                      }}
                      onDragEnd={() => {
                        setShow(false);

                        let i = currentDrag[0];
                        let j = currentDrag[1];
                        let a = over[0];
                        let b = over[1];

                        if (a == -1 || b == -1 || i == -1 || j == -1) return;

                        var temp = JSON.parse(JSON.stringify(board));

                        if (
                          isPossible(
                            board,
                            currElement,
                            currElement.get(board[i][j]),
                            i,
                            j,
                            a,
                            b
                          )
                        ) {
                          temp[i][j] = null;
                          temp[a][b] = board[i][j];
                        }

                        localStorage.setItem("board", JSON.stringify(temp));
                        setBoard(temp);
                        setCurrentDrag([-1, -1]);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setOver([idx, idx2]);
                      }}
                      key={idx2}
                      className={
                        ((idx + idx2) % 2 == 0 ? "white" : "black") + " " +
                        ([...availableSpc].some((item) => IsEqual(item, [idx,idx2])) && show
                          ? "green" : "")
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
            );
          })}
        </div>
        <button
          className="reset"
          onClick={() => {
            setBoard(pieces);
            localStorage.setItem("board", JSON.stringify(pieces));
          }}
        >
          New Game
        </button>
      </div>
    </>
  );
}

export default ChessBoard;