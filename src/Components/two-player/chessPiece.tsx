import { Piece } from "@/types/chess";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ChessPiece({
  type,
  position,
  lastMove,
  currentPlayer,
  highlight,
  setSelectedPiece,
  movingPiece,
}: Piece) {
  const [isMoving, setIsMoving] = useState(false);
  const pieceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      movingPiece?.fromRow === position.row &&
      movingPiece?.fromCol === position.col
    ) {
      setIsMoving(true);
      const timeout = setTimeout(() => setIsMoving(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [movingPiece, position]);

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
    } else {
      return null;
    }
  }

  const color = type === type.toUpperCase() ? "white" : "black";
  const pieceImage = `/${color}/${type}.png`;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (color === currentPlayer) setSelectedPiece(position);
    e.dataTransfer.setData("text/plain", `${position.row},${position.col}`);
  };

  const translateX =
    lastMove?.toCol !== undefined ? (lastMove.toCol - position.col) * 100 : 0;
  const translateY =
    lastMove?.toRow !== undefined ? (lastMove.toRow - position.row) * 100 : 0;

  return (
    <div
      ref={pieceRef}
      className={`w-16 h-16 cursor-pointer max-sm:h-10 max-sm:w-10 ${
        highlight ? "bg-red-500/50" : ""
      } ${
        lastMove?.fromRow === position.row &&
        lastMove?.fromCol === position.col &&
        !isMoving
          ? "bg-blue-400/50"
          : ""
      } ${
        lastMove?.toRow === position.row &&
        lastMove?.toCol === position.col &&
        !isMoving
          ? "bg-blue-400/50"
          : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      style={{
        transition:
          lastMove?.fromRow === position.row &&
          lastMove?.fromCol === position.col &&
          isMoving
            ? "transform 0.3s ease"
            : "none",
        transform:
          lastMove?.fromRow === position.row &&
          lastMove?.fromCol === position.col &&
          isMoving
            ? `translate(${translateX}%, ${translateY}%)`
            : "none",
      }}
    >
      <Image
        src={pieceImage}
        alt={`${color} ${type}`}
        width={64}
        height={64}
        className="w-full h-full"
      />
    </div>
  );
}
