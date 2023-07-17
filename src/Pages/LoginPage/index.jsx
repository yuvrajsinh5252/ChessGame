import React, { useEffect } from "react";
import "./index.css";
import { useState } from "react";
import loading from "..\\public\\Assets\\loading.gif";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ socket }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("joined", (data) => {
        navigate(`/ChessGame?room=${data.room}`);
        socket.emit('start', data);
    });
  }, []);

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