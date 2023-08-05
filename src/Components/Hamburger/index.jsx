import './index.css'
import Dark from "..\\public\\Assets\\DarkMode.png";
import Light from "..\\public\\Assets\\LightMode.png";

export default function Hamburger({ setGameOver, turn }) {
    return (
        <nav role="navigation">
            <img className="LightMode" src={Light} onClick={(e) => {
                let mode = (e.target.className == "NightMode" ? Light : Dark)

                e.target.className = (e.target.className == "NightMode" ? "LightMode" : "NightMode")
                e.target.src = mode;

                let background = document.getElementById("home")
                if (e.target.className == "NightMode") background.style = "background: rgb(35,35,35)"
                else background.style = "background-image: linear-gradient( rgb(48, 93, 83),rgb(116, 138, 112))"
            }} />
            <div id="menuToggle">
                <input type="checkbox" />
                <span></span>
                <span></span>
                <span></span>
                <ul id="menu">
                    <li>
                        <button
                            className="reset"
                            onClick={() => {
                                window.location.reload();
                        }}>Restart</button>
                    </li>
                    <li>
                        <button
                            className="reset"
                            onClick={() => {

                            }
                        }>Undo</button>
                    </li>
                    <li>
                        <button
                            className="reset"
                            onClick={(e) => {
                                if (turn == "w")
                                    setGameOver([true, "White Resign's", "b"]);
                                else 
                                    setGameOver([true, "Black Resign's", "w"]);    
                            }
                        }>Resign</button>
                    </li>
                    <li>
                        <button
                            className="reset"
                            onClick={() => {}
                        }>Draw</button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}