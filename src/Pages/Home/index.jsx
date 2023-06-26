import "./index.css";
import React from "react";
import { useState } from "react";
import Chessboard from "../../Components/ChessBoard";
import ShowMoves from "../../Components/Move";
import PawnPromote from "../../Components/PawnPromote";
import GameoOver from "../../Components/GameOver";
import Hamburger from "../../Components/Hamburger";
import KilledPiece from "../../Components/KilledPiece";

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
  const [prevMove, setPrevMove] = useState([-1,-1,-1,-1]);
  const [timer, setTimer] = useState([[10,0],[10,0]]);

  return (
    <div className="home">
      <Hamburger {...{setBoard, setGameOver, setTurn, setCheck, turn, setPrevMove }} />
      <ShowMoves {...{timer, setTimer, turn, setGameOver}} />
      <PawnPromote
        {...{pawnPromote, setPawnPromote, board, setBoard, over, setCheck}}
      />
      <div className="chess">
        <Chessboard
            {...{board, setBoard, check, setCheck, over, setOver, currentDrag, setCurrentDrag, availableSpc, setAvailableSpc, show, setShow, turn, setTurn, kill, setKill, pawnPromote, setPawnPromote, kingTouched, setKingTouched, rookTouched, setRookTouched, setGameOver, prevMove, setPrevMove, prevMove}}>
        <GameoOver {...{gameOver}} />
        </Chessboard>
      </div>
      <KilledPiece />
    </div>
  );
}

export default Home;