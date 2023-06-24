import './index.css'
import x from "../../Utilities/Pieces"
import Dark from "..\\public\\Assets\\DarkMode.png";
import Light from "..\\public\\Assets\\LightMode.png";

export default function Hamburger({ setBoard }) {
    const { pieces } = x;
    let undo = JSON.parse(localStorage.getItem("Undo"))

    return (
        <nav role="navigation">
            <img className="NightMode" src={Dark} onClick={(e) => {
                let mode = (e.target.className == "NightMode" ? Light : Dark)

                e.target.className = (e.target.className == "NightMode" ? "LightMode" : "NightMode")
                document.getElementsByClassName(e.target.className)[0].src = mode;

                let background = document.getElementsByClassName("home")[0]
                if (e.target.className == "NightMode") background.style = "background: rgb(35,35,35)"
                else background.style = "background-image: linear-gradient( rgb(48, 93, 83),rgb(116, 138, 112))"
            }} />
            <div id="menuToggle">
                <input type="checkbox" />
                <span></span>
                <span></span>
                <span></span>
                <ul id="menu">
                    <a href="#"><li>
                        <button
                            className="reset"
                            onClick={() => {
                                localStorage.setItem("board", JSON.stringify(pieces)); 
                                localStorage.setItem("HistMove", JSON.stringify([-1,-1,-1,-1]));
                                localStorage.setItem("Notation", JSON.stringify({Moves: []}));
                                localStorage.setItem("EpMove", JSON.stringify(new Array(4).fill(-1)));
                                localStorage.setItem("kingTouched", JSON.stringify(new Array(8).fill(false)));
                                localStorage.setItem("rookTouched", JSON.stringify(new Array(8).fill(new Array(8).fill(false))));
                                localStorage.setItem("PieceKilled", JSON.stringify([]));
                                localStorage.setItem("turn", JSON.stringify("w"));
                                localStorage.setItem("check", JSON.stringify([false,[-1,-1]]));
                                localStorage.setItem("gameOver", JSON.stringify([false, "", ""]));
                                window.location.reload();
                        }}>Restart</button>
                    </li></a>
                    <a href="#"><li>
                        <button
                            className="reset"
                            onClick={() => {}
                        }>Redo</button>
                    </li></a>
                    <a href="#"><li>
                        <button
                            className="reset"
                            onClick={() => {
                                setBoard(undo);
                            }
                        }>Undo</button>
                    </li></a>
                    <a href="#"><li>
                        <button
                            className="reset"
                            onClick={() => {}
                        }>Resign</button>
                    </li></a>
                    <a href="#"><li>
                        <button
                            className="reset"
                            onClick={() => {}
                        }>Draw</button>
                    </li></a>
                </ul>
            </div>
        </nav>
    )
}