import "./index.css";
import {React, useState} from "react";
import Chessboard from "../../Components/ChessBoard";
import ShowMoves from "../../Components/Move";
import PawnPromote from "../../Components/PawnPromote";
import GameoOver from "../../Components/GameOver";
import Hamburger from "../../Components/Hamburger";
import KilledPiece from "../../Components/KilledPiece";

function Home( {socket} ) {
  const [board, setBoard] = useState([]);
  const [over, setOver] = useState([-1, -1]);
  const [currentDrag, setCurrentDrag] = useState([-1, -1]);
  const [availableSpc, setAvailableSpc] = useState(new Set());
  const [show, setShow] = useState(false);
  const [kill, setKill] = useState(new Set());
  const [pawnPromote, setPawnPromote] = useState([false, "white"]);
  const [turn, setTurn] = useState("w");
  const [check, setCheck] = useState([false,[-1,-1]]);
  const [gameOver, setGameOver] = useState([false, "", ""]);
  const [prevMove, setPrevMove] = useState([-1,-1,-1,-1]);
  const [notation, setNotation] = useState({Moves: []});
  const [piecesKilled, setPiecesKilled] = useState([]);
  const [room, setRoom] = useState([]); // [room , id]
  const [btnClicked, setBtnClicked] = useState(false);

  return (
    <div id="home">
      <Hamburger {...{turn, socket, room, setBtnClicked, btnClicked}} />
      <ShowMoves {...{turn, setGameOver, socket, notation, piecesKilled}} />
      <PawnPromote
        {...{pawnPromote, over, socket, room}}
      />
      <div className="chess">
        <Chessboard
            {...{board, setBoard, check, setCheck, over, setOver, currentDrag, setCurrentDrag, availableSpc, setAvailableSpc, show, setShow, turn, setTurn, kill, setKill, setPawnPromote, setGameOver, prevMove, setPrevMove, prevMove, socket, setNotation, setPiecesKilled, pawnPromote, room, setRoom, btnClicked, setBtnClicked}}>
        <GameoOver {...{gameOver, socket, room}} />
        </Chessboard>
      </div>
      <KilledPiece piecesKilled = {piecesKilled}/>
    </div>
  );
}

export default Home;