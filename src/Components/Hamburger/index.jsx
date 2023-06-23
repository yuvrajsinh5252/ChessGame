import './index.css'
import x from "../../Utilities/Pieces"

export default function Hamburger({ setBoard }) {
    const { pieces } = x;
    let undo = JSON.parse(localStorage.getItem("Undo"))

    return (
        <nav role="navigation">
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