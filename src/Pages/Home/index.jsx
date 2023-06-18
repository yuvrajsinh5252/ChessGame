import React from "react";
import { useState } from "react";
import "./index.css";
import Chessboard from "../../Components/ChessBoard";
import ShowMoves from "../../Components/Move";
import PawnPromote from "../../Components/PawnPromote";
import GameoOver from "../../Components/GameOver";

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

  return (
    <div className="home">
      <ShowMoves
        setBoard={setBoard}
        setShow={setShow}
        setCheck={setCheck}
        setKingTouched={setKingTouched}
        setRookTouched={setRookTouched}
      />
      <PawnPromote
        openIt={pawnPromote}
        setPawnPromote={setPawnPromote}
        board={board}
        setBoard={setBoard}
        index={over}
      />
      <div className="chess">
        <Chessboard
            board={board}
            setBoard={setBoard}
            check={check}
            setCheck={setCheck}
            over={over}
            setOver={setOver}
            currentDrag={currentDrag}
            setCurrentDrag={setCurrentDrag}
            availableSpc={availableSpc}
            setAvailableSpc={setAvailableSpc}
            show={show}
            setShow={setShow}
            turn={turn}
            setTurn={setTurn}
            kill={kill}
            setKill={setKill}
            pawnPromote={pawnPromote}
            setPawnPromote={setPawnPromote}
            kingTouched={kingTouched}
            setKingTouched={setKingTouched}
            rookTouched={rookTouched}
            setRookTouched={setRookTouched}
            setGameOver={setGameOver}
        />
        <GameoOver 
            gameOver={gameOver}
        />
      </div>
    </div>
  );
}

export default Home;
