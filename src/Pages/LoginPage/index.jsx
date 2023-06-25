import React from "react";
import "./index.css";
import loading from "..\\public\\Assets\\loading.gif";

export default function LoginPage() {
  return (
    <div className="Login">
      <div className="user">
        <h1>Enter your username</h1>
        <input type="text" placeholder="Username"/>
      </div>
      <div className="JoinRoom">
        <button>Join Room</button>
        <input type="text" placeholder="room code..."/>
      </div>
      <div className="search">
        <h2>Waiting for other user to join</h2>
        <img src={loading} />
      </div>
    </div>
  );
}