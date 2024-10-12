import { Piece } from "@/types/chess";

export function ChessPiece({
  type,
  position,
  currentPlayer,
  highlight,
  setSelectedPiece,
}: Piece) {
  if (!type) {
    if (highlight) {
      return <div className="w-6 h-6 rounded-full bg-black bg-opacity-30" />;
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
        "w-16 h-16 cursor-pointer " +
        (highlight ? "ring-2 z-50 ring-red-500" : "")
      }
      draggable
      onDragStart={handleDragStart}
    >
      <img
        src={pieceImage}
        alt={`${color} ${type}`}
        className="w-full</div> h-full"
      />
    </div>
  );
}
