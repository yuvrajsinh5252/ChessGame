import "./index.css";
import React, { useEffect, useRef } from "react";
import x from "../../Utilities/Pieces";
import { useState } from "react";

function ShowMoves({ turn, setGameOver, socket}) {
  const Moves = JSON.parse(localStorage.getItem("Notation") || "[]");
  const lastElem = useRef();
  let chessPiece = JSON.parse(localStorage.getItem("PieceKilled"));
  let currElement = x.currElement;
  const [players, setPlayers] = useState("");
  
  const [timer, setTimer] = useState([[10,0],[10,0]]);

  useEffect(() => {
    socket.on('started', (data) => {
        setPlayers(data.game.users);
    })
  }, [])

  useEffect(() => {
    if (lastElem.current)
    lastElem.current.scrollIntoView({behavior: "smooth"});
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (turn == "b") {
        if (timer[0][1] === 0) {
          if (timer[0][0] === 0) setGameOver([true, "Time Over", "w"])
          else setTimer([[timer[0][0] - 1, 59], [timer[1][0], timer[1][1]]]);
        }
        else setTimer([[timer[0][0], timer[0][1] - 1], [timer[1][0], timer[1][1]]]);
      } 
      else {
        if (timer[1][1] === 0) {
          if (timer[1][0] === 0) setGameOver([true, "Time Over", "b"])
          else setTimer([[timer[0][0], timer[0][1]], [timer[1][0] - 1, 59]]);
        }
        else setTimer([[timer[0][0], timer[0][1]], [timer[1][0], timer[1][1] - 1]]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer])

  return (
    <>
      <div className="player">
        <div className="showMove">
          <div className={(turn == "w" ? "changeTurn" : "") + " " + "player1"}>
            <img src="https://rb.gy/8p6c4" className="profile1" />
            <div className="nameTag">
              <div className="name2">{players[0]}</div>
              <div className="rating1">1400<span>+(43)</span></div>
            </div>
            <div className="time">
              {timer[0][0] < 10 ? <>0</> : <></>}
              {timer[0][0]}<div className="colon">:</div>
              {timer[0][1] < 10 ? <>0</> : <></>}
              {timer[0][1]}
            </div>
          </div>
          <div className="piecesPoints1">
            {chessPiece.map((piece, index) => {
              return currElement.get(piece).endsWith("w") ? (<img className="points" key={index} src={piece} />) : ("");
            })}
          </div>
          <hr />
          
          <div className="turn">
            <div className="bturn">White</div>
            <div className="wturn">Black</div>
          </div>
          <div className="gap"></div>
          
          <div className="moves_container">
            <div className="notation">
            {Moves.Moves.map((move, index) => {
              return [index, move];
            })
              .map((x) => {
                const e = (
                  <>
                    <div className="moveNumber">{x[0] % 2 == 0 ? <>{Math.round(x[0] / 2) + 1}</> : <></>}</div>
                    <div className="moveName1">{x[1]}</div>
                  </>
                );
                if (x[0] === Moves.Moves.length - 1) {
                  return (
                    <div ref={lastElem} key={x[0]} className="move">{e}</div>
                  );
                }
                return (
                  <div key={x[0]} className="move">{e}</div>
                );
              })}
          </div>
          </div>
          <hr />
          <div className={(turn == "b" ? "changeTurn" : "") + " " + "player2"}>
            <img src="https://rb.gy/qk8n0" className="profile2" />
              <div className="nameTag">
                <div className="name2">{players[1]}</div>
                <div className="rating2">1400<span>+(43)</span></div>
              </div>
              <div className="time1">
                {timer[1][0] < 10 ? <>0</> : <></>}
                {timer[1][0]} <div className="colon">:</div>
                {timer[1][1] < 10 ? <>0</> : <></>}
                {timer[1][1]}
              </div>
          </div>
          <div className="piecesPoints2">
            {chessPiece.map((piece, index) => {
              return currElement.get(piece).endsWith("b") ? (<img className="points" key={index} src={piece} />) : ("");
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowMoves;