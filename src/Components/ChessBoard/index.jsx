import "./index.css";
import x from "../../Utilities/Pieces/index.jsx";
import { useEffect } from "react";

const { pieces, currElement } = x;

export function IsEqual(x, y) {
  if (x.length != y.length) return false;
  for (let i in x) if (x[i] != y[i]) return false;
  return true;
}

function ChessBoard({ board, setBoard, check, setCheck, over, setOver, currentDrag, setCurrentDrag, availableSpc, setAvailableSpc, show, setShow, turn, setTurn, kill, setKill, setPawnPromote, setGameOver, children, prevMove, setPrevMove, socket, setNotation, setPiecesKilled, pawnPromote, room, setRoom, btnClicked, setBtnClicked }) {

  useEffect(() => { // Setting up the board
    var temp_board = [];
    for (let i = 0; i < 8; i++) {
      let temp = [];
      for (let j = 0; j < 8; j++) temp.push(pieces[i][j]);
      temp_board.push(temp);
      setBoard(temp_board)
    }
  }, []);

  // socket events
  useEffect(() => {
    socket.on("getRoom", data => {
      setRoom(data);
      room = data;
    });
    socket.on("pawnPromote", data => setPawnPromote(data));
    socket.on("MatchDraw", data => {
      setBtnClicked(true);
      if (data[0] == "ask") {
        if ((data[1][1] != room[1])) {
          setGameOver([true, "Draw", "1/2-1/2"]);
        }
      } else if (data[0] == "true") {
        setGameOver([true, "MatchDraw", "1/2-1/2"]);
      } else if (data[0] == "false") {
        setGameOver([false, "Draw", "1/2-1/2"]);
        setBtnClicked(false);
      }
    });
    socket.on('resigned', data => {
      setGameOver(data);
      setBtnClicked(true);
    })

    socket.on("pawnPromoted", (data) => {
      setBoard(data.board);
      setCheck(data.check);
      setPawnPromote([false, "white"]);
      setTurn(data.turn);
    });

    socket.on("highlighted", (data) => {
      if (Array.isArray(data.ThreatendSpc)) {
        data.ThreatendSpc = new Set(data.ThreatendSpc);
      }
      if (Array.isArray(data.availableSpc)) {
        data.availableSpc = new Set(data.availableSpc);
      }
      setAvailableSpc(data.availableSpc);
      setKill(data.ThreatendSpc);
    });

    socket.on("moved", (data) => {
      setBoard(data.board);
      setTurn(data.turn);
      setCheck(data.check);
      setKill(data.kill);
      setPrevMove(data.prevMove);
      setGameOver(data.gameOver);
      if (room[1] == turn) setPawnPromote(data.pawnPromote);
      setNotation(data.notation);
      setPiecesKilled(data.kill);
    });
  }, [socket]);
  // socket events ends

  console.log("room:", room);

  return (
    <>
      <div className="chessboard">
        <div className={"border" + " " + (room[1] == 'b' ? 'rotate' : "")}>
          {board.map((row, idx) => {
            return (
              <div key={idx}>
                <div className={"idx" + " " + (room[1] == "b" ? "rotate" : "")}>{8 - idx}</div>
                <div className="rows">
                  {row.map((el, idx2) => {
                    return (
                      <div key={idx2}>
                        <div className="cont" key={JSON.stringify(el)}>
                          <div
                            onClick={() => {
                              if (pawnPromote[0] || room[1] != turn) return;
                              if ([...availableSpc].some((e) => { return IsEqual(e, [idx, idx2]) })) {
                                setOver([idx, idx2]);
                                if (currElement.get(board[idx][idx2]).endsWith(turn)) return;
                                let pos = [currentDrag[0], currentDrag[1], idx, idx2];

                                socket.emit("move", {
                                  room: room,
                                  currElement: JSON.stringify(Array.from(currElement)),
                                  pos: pos,
                                  board: JSON.stringify(board),
                                });
                                setAvailableSpc(new Set());
                                setShow(false);
                              } else {
                                setAvailableSpc(new Set());
                                if (!currElement.get(board[idx][idx2]).endsWith(turn) || room[1] != turn || btnClicked) return;
                                setCurrentDrag([idx, idx2]);
                                socket.emit("highlight", {
                                  room: room,
                                  currElement: JSON.stringify(Array.from(currElement)),
                                  board: JSON.stringify(board),
                                  currentDrag: [idx, idx2],
                                });
                                setShow(true);
                              }
                            }}
                            onDragStart={(e) => {
                              setAvailableSpc(new Set());
                              if (!currElement.get(board[idx][idx2]).endsWith(turn) || pawnPromote[0] || room[1] != turn || btnClicked) return;
                              setCurrentDrag([idx, idx2]);
                              socket.emit("highlight", {
                                room: room,
                                currElement: JSON.stringify(Array.from(currElement)),
                                board: JSON.stringify(board),
                                currentDrag: [idx, idx2],
                              });
                              setShow(true);
                            }}
                            onDragEnd={() => {
                              setShow(false);
                              if (!currElement.get(board[idx][idx2]).endsWith(turn) || room[1] != turn) return;
                              let pos = [currentDrag[0], currentDrag[1], over[0], over[1]];

                              socket.emit("move", {
                                room: room,
                                currElement: JSON.stringify(Array.from(currElement)),
                                pos: pos,
                                board: JSON.stringify(board),
                              });
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setOver([idx, idx2]);
                            }}
                            key={idx2}
                            className={
                              (room[1] == "b" ? "rotate" : "")
                              + " " +
                              ((idx + idx2) % 2 == 0 ? "white" : "black")
                              + " " +
                              ([...kill].some((item) => IsEqual(item, [idx, idx2])) && show ? "red" : "")
                              + " " +
                              (IsEqual(check[1], [idx, idx2]) ? "check" : "")
                              + " " +
                              (IsEqual([prevMove[0], prevMove[1]], [idx, idx2]) ?
                                ((idx % 2 != 0 && idx2 % 2 == 0) || (idx % 2 == 0 && idx2 % 2 != 0) ? "selWhite" : "over") : "")
                              + " " +
                              (IsEqual([prevMove[2], prevMove[3]], [idx, idx2]) ?
                                ((idx % 2 != 0 && idx2 % 2 == 0) || (idx % 2 == 0 && idx2 % 2 != 0) ? "selWhite" : "select") : "")
                            }
                          >
                            {board[idx][idx2] ? (
                              <img src={board[idx][idx2]} className="drag" />
                            ) : (
                              <div
                                className={([...availableSpc].some((item) => IsEqual(item, [idx, idx2])) && show
                                  ? "green" : "")}
                              ></div>
                            )}
                          </div>
                          <div className={"container" + " " + (room[1] == "b" ? "rotate" : "")}>
                            {idx == 7 ? <div className="alpha2">{String.fromCharCode(97 + idx2)}</div> : <></>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {children}
      </div>
    </>
  );
}

export default ChessBoard;