import './index.css'
import x from "../../Utilities/Pieces"
import Dark from "..\\public\\Assets\\DarkMode.png";
import Light from "..\\public\\Assets\\LightMode.png";

export default function Hamburger({ setBoard, setGameOver, setTurn, setCheck, turn, setPrevMove }) {
    const { pieces } = x;
    let undo = JSON.parse(localStorage.getItem("Undo"))
    let chessPiece = JSON.parse(localStorage.getItem("PieceKilled"));
    let board = JSON.parse(localStorage.getItem("board"));
    let prevMove = JSON.parse(localStorage.getItem("HistMove"));
    let notation = JSON.parse(localStorage.getItem("Notation"));

    return (
        <nav role="navigation">
            <img className="LightMode" src={Light} onClick={(e) => {
                let mode = (e.target.className == "NightMode" ? Light : Dark)

                e.target.className = (e.target.className == "NightMode" ? "LightMode" : "NightMode")
                e.target.src = mode;

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
                    <li>
                        <button
                            className="reset"
                            onClick={() => {
                                localStorage.setItem("board", JSON.stringify(pieces)); 
                                localStorage.setItem("HistMove", JSON.stringify([-1,-1,-1,-1]));
                                localStorage.setItem("Notation", JSON.stringify({Moves: []}));
                                localStorage.setItem("EpMove", JSON.stringify(new Array(4).fill(-1)));
                                localStorage.setItem("kingTouched", JSON.stringify(new Array(8).fill(false)));
                                localStorage.setItem("rookTouched", JSON.stringify(new Array(8).fill(new Array(8).fill(false))));
                                localStorage.setItem("Undo", JSON.stringify(pieces))
                                localStorage.setItem("PieceKilled", JSON.stringify([]));
                                localStorage.setItem("turn", JSON.stringify("w"));
                                localStorage.setItem("check", JSON.stringify([false,[-1,-1]]));
                                localStorage.setItem("gameOver", JSON.stringify([false, "", ""]));
                                window.location.reload();
                        }}>Restart</button>
                    </li>
                    <li>
                        <button
                            className="reset"
                            onClick={() => {
                                if (JSON.stringify(board) == JSON.stringify(undo)) return;
                                setBoard(undo);
                                setTurn(turn == "w" ? "b" : "w");
                                setCheck([false, [-1,-1]]);
                                setGameOver([false, "", ""]);
                                if (board[prevMove[2]][prevMove[3]] != null) {
                                    chessPiece.pop();
                                }
                                notation.Moves.pop();
                                setPrevMove([-1,-1,-1,-1])
                                localStorage.setItem("Notation", JSON.stringify(notation));
                                localStorage.setItem("HistMove", JSON.stringify([-1,-1,-1,-1]));
                                localStorage.setItem("board", JSON.stringify(undo));
                                localStorage.setItem("PieceKilled", JSON.stringify(chessPiece));
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