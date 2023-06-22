import "./index.css";
import React, { useEffect, useRef } from "react";

function ShowMoves() {
  const Moves = JSON.parse(localStorage.getItem("Notation") || "[]");
  const lastElem = useRef();

  useEffect(() => {
    if (lastElem.current)
    lastElem.current.scrollIntoView({behavior: "smooth"});
  });

  return (
    <>
      <div className="player">
        <div className="showMove">
          <div className="player1">
            <div className="profile1">
              <div className="time"></div>
            </div>
          </div><hr />
          <div className="moves_container">
            <div className="turn">
              <div className="bturn">White</div>
              <div className="wturn">Black</div>
            </div>
            <div className="notation">
            {Moves.Moves.map((move, index) => {
              return [index, move];
            })
              .map((x) => {
                const e = (
                  <>
                    <div className="moveNumber">{x[0] + 1}</div>
                    <div className="move_gap">
                      <div className="moveName1">{x[1]}</div>
                      <div className="moveName2">{x[1]}</div>
                    </div>
                  </>
                );
                if (x[0] === Moves.Moves.length - 1) {
                  return (
                    <div ref={lastElem} key={x[0]} className="move">
                      {e}
                    </div>
                  );
                }
                return (
                  <div key={x[0]} className="move">
                    {e}
                  </div>
                );
              })}
          </div>
          </div>
          <hr />
          <div className="player2">
            <div className="profile2">
              <div className="time"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowMoves;
