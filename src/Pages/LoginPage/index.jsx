import React, { useEffect } from "react";
import "./index.css";
import { useState } from "react";
import loading from "..\\public\\Assets\\loading.gif";
import SideImage1 from "..\\public\\Assets\\SideImage1.png";
import SideImage2 from "..\\public\\Assets\\SideImage2.png";
import Logo from "..\\public\\Assets\\Logo.jpg";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ socket }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("joined", (data) => {
        navigate(`/ChessGame?room=${data.room}`);
        socket.emit('start', data);
    });
  }, []);

  return (
    <div className="LoginPage">
      <div className="ChessImages">
        <img src={SideImage1} alt="png" className="side1" />
        <img src={SideImage2} alt="png" className="side2"/>
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
                  document.getElementsByClassName("search")[0].style.visibility = "visible";
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
          <div className="search">
            <h2>Waiting for other user to join</h2>
            <img src={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}