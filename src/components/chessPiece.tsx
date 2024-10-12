import { Piece } from "@/types/chess";

export function ChessPiece({
  type,
  position,
  lastMove,
  currentPlayer,
  highlight,
  setSelectedPiece,
}: Piece) {
  if (!type) {
    if (
      lastMove?.fromRow === position.row &&
      lastMove?.fromCol === position.col
    ) {
      return (
        <div className="w-16 h-16 max-sm:h-10 max-sm:w-10 bg-blue-400/50" />
      );
    }

    if (highlight) {
      return (
        <div className="w-6 h-6 max-sm:h-4 max-sm:w-4 rounded-full bg-black bg-opacity-30" />
      );
    } else return null;
  }

  const color = type === type.toUpperCase() ? "white" : "black";
  const pieceImage = `/${color}/${type}.png`;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (color === currentPlayer) setSelectedPiece(position);
    e.dataTransfer.setData("text/plain", `${position.row},${position.col}`);
  };

  return (
    <div
      className={
        "w-16 h-16 cursor-pointer max-sm:h-10 max-sm:w-10 " +
        (highlight ? "bg-red-500/50 " : "") +
        (lastMove?.fromRow == position.row && lastMove?.fromCol == position.col
          ? "bg-blue-400/50"
          : "") +
        (lastMove?.toRow == position.row && lastMove?.toCol == position.col
          ? "bg-blue-400/50"
          : "")
      }
      draggable
      onDragStart={handleDragStart}
    >
      <img
        src={pieceImage}
        alt={`${color} ${type}`}
        className="w-full h-full"
      />
    </div>
  );
}
