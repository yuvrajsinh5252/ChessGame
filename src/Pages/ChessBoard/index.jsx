import "./index.css";
import { useState } from "react";
import pieces from "../../Pieces";
import { useEffect } from "react";

function ChessBoard({ board, setBoard }) {
  // const [board, setBoard] = useState([]);
  const [over, setOver] = useState([-1, -1]);
  const [currentDrag, setCurrentDrag] = useState([-1, -1]);

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
                      onDragStart={(e) => {
                        setCurrentDrag([idx, idx2]);
                      }}
                      onDragEnd={() => {
                        let i = currentDrag[0];
                        let j = currentDrag[1];
                        let a = over[0];
                        let b = over[1];

                        if (a == -1 || b == -1 || i == -1 || j == -1) return;

                        var temp = JSON.parse(JSON.stringify(board));

                        if (true) {
                          temp[i][j] = board[a][b];
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
                      className={(idx + idx2) % 2 == 0 ? "white" : "black"}
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
          }}
        >
          New Game
        </button>
      </div>
    </>
  );
}

export default ChessBoard;
