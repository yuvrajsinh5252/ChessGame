import './index.css'

export default function Hamburger({ turn, socket,room, setBtnClicked, btnClicked }) {
    return (
        <nav role="navigation">
            <img className="LightMode" src="/Assets/LightMode.png" onClick={(e) => {
                let mode = (e.target.className == "NightMode" ? "/Assets/LightMode.png" : "/Assets/DarkMode.png")

                e.target.className = (e.target.className == "NightMode" ? "LightMode" : "NightMode")
                e.target.src = mode;

                let background = document.getElementById("home")
                if (e.target.className == "NightMode") background.style = "background: rgb(35,35,35)"
                else background.style = "background-image: linear-gradient( rgb(48, 93, 83),rgb(116, 138, 112))"
            }} />
            <div className='yourTurn'>
                <span>You're</span>
                <div className={"color " + " " + (room[1] == "w" ? "whiteTurn" : "blackTurn")}></div>
            </div>
            <div id="menuToggle">
                <input type="checkbox" />
                <span></span>
                <span></span>
                <span></span>
                <ul id="menu">
                    <li>
                        <button
                            disabled={btnClicked}
                            className="reset"
                            onClick={(e) => {
                                socket.emit("resign", { room: room, resign: (turn == "w" ? "White Resign's" : "Black Resign's"), win: (room[1] == "w" ? "black Win's" : "White Wins;") });
                                setBtnClicked(true);
                            }
                        }>Resign</button>
                    </li>
                    <li>
                        <button
                            className="reset"
                            disabled={btnClicked}
                            onClick={() => {
                                socket.emit("draw", { room: room, draw: "ask" });
                                setBtnClicked(true);
                            }
                        }>Draw</button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}