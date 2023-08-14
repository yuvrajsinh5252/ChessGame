import React, { useEffect } from "react";
import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ socket }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("joined", (data) => {
        navigate(`/ChessGame?room=${data.room}`);
        socket.emit('start', data);
    });
    socket.on("err", (data) => {
      setMessage(data.message);
      if (data.message != "")  setWaiting(false);
    });
  }, [socket]);

  return (
    <div className="LoginPage">
      <div className="ChessImages">
        <img src="/Assets/SideImage1.png" alt="png" className="side1" />
        <img src="/Assets/SideImage2.png" alt="png" className="side2"/>
      </div>
      <div className="Login">
        <form action="#" onSubmit={
          (e) => {
            e.preventDefault();
          }
        }>
          <div className="user">
            <h1>Enter your username</h1>
            <input 
              onChange={
                (e) => setName(e.target.value)
              }
              maxLength = "10"
              id="user1" type="text" placeholder="Username"/>
          </div>
          <div className="JoinRoom">
            <input type="submit" 
              disabled={(name !== "" && room !== "" ? false : true) || waiting}
              onClick={()=> {
                if (name[0] !== null) {
                  socket.emit("join", {name, room});
                  let elm = document.getElementsByClassName("search")[0];
                  if (elm != null) {
                    elm.style.visibility = "visible";
                  }
                  setMessage("");
                  setWaiting(true)
                }            
              }}
              id="button"
              value="Join Room"
            />
            <input 
              onChange={
                (e) => setRoom(e.target.value)
              }
              maxLength = "12"
              id="room" type="text" placeholder="room code..."/>
          </div>

          {message == "" ? 
            <div className="search">
              <h2>Waiting for other user to join</h2>
              <img src="/Assets/loading.gif" />
            </div> : 
            <div className="errmessage">{message}</div>
          }
        </form>
      </div>
      
    </div>
  );
}