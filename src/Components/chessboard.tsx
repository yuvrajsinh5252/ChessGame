"use client";

import { useChessStore } from "@/store/useChessStore";
import { ChessPiece } from "./chessPiece";
import { useEffect, useState } from "react";
import useStore from "@/lib/hooks/useStore";
import { initialBoard } from "@/utils/initialSetup";
import { LoadingBoard } from "./loadingBoard";

export default function ChessBoard() {
  const store = useStore(useChessStore, (state) => state);
  const isLoading = !store;
  const {
    board,
    movePiece,
    isValidMove,
    isKingInCheck,
    currentPlayer,
    lastMove,
  } = store! || {
    board: initialBoard,
    movePiece: () => false,
    isValidMove: () => false,
    isKingInCheck: "noCheck",
    currentPlayer: "white",
  };
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // drag and drop handlers
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    toRow: number,
    toCol: number
  ) => {
    e.preventDefault();
    const [fromRow, fromCol] = e.dataTransfer
      .getData("text")
      .split(",")
      .map(Number);
    movePiece(fromRow, fromCol, toRow, toCol);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // remove selected piece if the current player changes
  useEffect(() => {
    setSelectedPiece(null);
  }, [currentPlayer]);

  const handlePieceClick = (row: number, col: number) => {
    if (board && !board[row][col]) return;
    if (
      currentPlayer === "black" &&
      board[row][col] === board[row][col]?.toUpperCase()
    )
      return;
    if (
      currentPlayer === "white" &&
      board[row][col] === board[row][col]?.toLowerCase()
    )
      return;

    setSelectedPiece((prev) => {
      if (!prev) return { row, col };
      if (prev.row === row && prev.col === col) return null;
      if (isValidMove(prev.row, prev.col, row, col)) {
        movePiece(prev.row, prev.col, row, col);
        return null;
      }
      return { row, col };
    });
  };

  const handleSquareClick = (row: number, col: number) => {
    if (
      selectedPiece &&
      isValidMove(selectedPiece.row, selectedPiece.col, row, col)
    ) {
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
      setSelectedPiece(null);
    } else handlePieceClick(row, col);
  };

  if (isLoading) return <LoadingBoard />;

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div
        className={`grid grid-cols-8 gap-0 border-2 rounded-lg relative ${
          currentPlayer === "black" ? "rotate-180" : ""
        }`}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 max-sm:h-10 max-sm:w-10 flex items-center justify-center
              ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-500"}
              ${rowIndex === 0 && colIndex === 0 ? "rounded-tl-lg" : ""}
              ${rowIndex === 0 && colIndex === 7 ? "rounded-tr-lg" : ""}
              ${rowIndex === 7 && colIndex === 0 ? "rounded-bl-lg" : ""}
              ${rowIndex === 7 && colIndex === 7 ? "rounded-br-lg" : ""}
              ${
                selectedPiece?.row === rowIndex &&
                selectedPiece?.col === colIndex
                  ? "bg-gradient-to-br from-blue-300 to-blue-600"
                  : ""
              }
              ${
                board[rowIndex][colIndex] === isKingInCheck
                  ? "bg-gradient-to-br from-red-500 to-red-700"
                  : ""
              }
              ${currentPlayer === "black" ? "rotate-180" : ""}
            `}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onDragOver={handleDragOver}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {
                <ChessPiece
                  type={piece}
                  currentPlayer={currentPlayer}
                  lastMove={lastMove}
                  position={{ row: rowIndex, col: colIndex }}
                  highlight={
                    !!selectedPiece &&
                    isValidMove(
                      selectedPiece?.row,
                      selectedPiece?.col,
                      rowIndex,
                      colIndex
                    )
                  }
                  setSelectedPiece={setSelectedPiece}
                />
              }
            </div>
          ))
        )}
        {/* Add symbolic notation */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`row-${index}`}
              className={`absolute left-0 w-4 h-16 max-sm:h-11 max-sm:w-3 flex items-center justify-center text-[8px] max-sm:text-[6px] text-black ${
                currentPlayer === "black" ? "rotate-180" : ""
              }`}
              style={{ top: `${index * 12.5 - 4}%` }}
            >
              {8 - index}
            </div>
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`col-${index}`}
              className={`absolute bottom-0 w-16 h-4 max-sm:h-3 max-sm:w-11 flex items-center justify-center text-[8px] max-sm:text-[6px] text-black ${
                currentPlayer === "black" ? "rotate-180" : ""
              }`}
              style={{ left: `${index * 12.5 - 5}%` }}
            >
              {String.fromCharCode(97 + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}