import { Piece } from "@/types/chess";

export function ChessPiece({ type, position }: Piece) {
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
