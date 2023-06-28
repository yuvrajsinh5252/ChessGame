import React, { useEffect } from "react";
import "./index.css";
import { useState } from "react";
import loading from "..\\public\\Assets\\loading.gif";

export default function LoginPage({ socket }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("start", (data) => {
      let players = data.game.users;
      console.log(players)

      window.location.href = `/ChessGame?room=${data.room}`
      document.getElementById("player1").innerHTML = players[0];
      document.getElementById("player2").innerHTML = players[1];
    });
  },[])

  return (
    <div className="Login">
      <div className="user">
        <h1>Enter your username</h1>
        <input onChange={(e) => setName(e.target.value)} id="user1" type="text" placeholder="Username"/>
      </div>
      <div className="JoinRoom">
        <button 
          disabled={name !== "" && room !== "" ? false : true}
          onClick={()=> {
            if (name[0] !== null) {
              socket.emit("join", {name, room});
              document.getElementsByClassName("search")[0].style.visibility = "visible";
            }            
          }}
        >Join Room</button>
        <input onChange={(e) => setRoom(e.target.value)} id="room" type="text" placeholder="room code..."/>
      </div>
      <div className="search">
        <h2>Waiting for other user to join</h2>
        <img src={loading} />
      </div>
    </div>
  );
}