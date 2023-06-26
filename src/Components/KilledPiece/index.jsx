import "./index.css";
import x from "../../Utilities/Pieces";

export default function KilledPiece() {
    let chessPiece = JSON.parse(localStorage.getItem("PieceKilled"));
    let currElement = x.currElement;

  return (
    <div className="outPieces">
      <div className="blpiece">
        {chessPiece.map((piece, index) => {
          return currElement.get(piece).endsWith("b") ? (
              <img className="blImg" key={index} src={piece} />
          ) : (
            ""
          );
        })}
      </div>
      <div className="whpiece">
        {chessPiece.map((piece, index) => {
          return currElement.get(piece).endsWith("w") ? (
              <img className="whImg" key={index} src={piece} />
          ) : (
            ""
          );
        })}
      </div>
    </div>
  );
}