import React from "react";
import { useState } from "react";
import "./index.css";
import Chessboard from "../../Components/ChessBoard";
import ShowMoves from "../../Components/Move";
import PawnPromote from "../../Components/PawnPromote";
import GameoOver from "../../Components/GameOver";
import x from "../../Utilities/Pieces"

function Home() {
  const [board, setBoard] = useState([]);
  const [over, setOver] = useState([-1, -1]);
  const [currentDrag, setCurrentDrag] = useState([-1, -1]);
  const [availableSpc, setAvailableSpc] = useState(new Set());
  const [show, setShow] = useState(false);
  const [kill, setKill] = useState(new Set());
  const [pawnPromote, setPawnPromote] = useState([false, "white"]);
  const [kingTouched, setKingTouched] = useState(new Array(8).fill(false));
  const [rookTouched, setRookTouched] = useState(new Array(8).fill(new Array(8).fill(false)));
  const [turn, setTurn] = useState("w");
  const [check, setCheck] = useState([false,[-1,-1]]);
  const [gameOver, setGameOver] = useState([false, "", ""]);

  const{pieces} = x;

  return (
    <div className="home">
      <ShowMoves {...setBoard}/>
      <PawnPromote
        {...{pawnPromote, setPawnPromote, board, setBoard, over, setCheck}}
      />
      <div className="chess">
        <Chessboard
            {...{board, setBoard, check, setCheck, over, setOver, currentDrag, setCurrentDrag, availableSpc, setAvailableSpc, show, setShow, turn, setTurn, kill, setKill, pawnPromote, setPawnPromote, kingTouched, setKingTouched, rookTouched, setRookTouched, setGameOver}}
        >
          <button
                className="reset"
                onClick={() => {
                    setBoard(pieces);
                    localStorage.setItem("board", JSON.stringify(pieces)); 
                    localStorage.setItem("HistMove", JSON.stringify([-1,-1,-1,-1]));
                    localStorage.setItem("Notation", JSON.stringify({Moves: []}));
                    window.location.reload();
                }}
          >Restart</button>
        </Chessboard>
        <GameoOver {...{gameOver}}/>
      </div>
    </div>
  );
}

export default Home;