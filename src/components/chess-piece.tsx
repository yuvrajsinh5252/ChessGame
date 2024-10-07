import { Piece } from "@/types/chess";

export function ChessPiece({ type, position, highlight }: Piece) {
  if (!type) {
    if (highlight) {
      return (
        <div
          className="w-8 h-8 rounded-full bg-blue-500 bg-opacity-50"
        />
      );
    } else return null;
  }

  const color = type === type.toUpperCase() ? "white" : "black";
  const pieceImage = `/${color}/${type}.png`;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", `${position.row},${position.col}`);
  };

  return (
    <div
      className="w-16 h-16 cursor-pointer"
      draggable
      onDragStart={handleDragStart}
    >
      <img src={pieceImage} alt={`${color} ${type}`} className="w-full h-full" />
    </div>
  );
}
