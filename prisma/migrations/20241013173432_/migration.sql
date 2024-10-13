/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_roomId_fkey";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "Room";

-- CreateTable
CREATE TABLE "game" (
    "roomId" TEXT NOT NULL,
    "players" INTEGER[],
    "board" TEXT NOT NULL,
    "currentPlayer" TEXT NOT NULL,
    "kingCheckOrMoved" TEXT NOT NULL,
    "rookMoved" TEXT NOT NULL,
    "eliminatedPiece" TEXT NOT NULL,
    "isKingInCheck" BOOLEAN NOT NULL DEFAULT false,
    "isCheckmate" BOOLEAN NOT NULL DEFAULT false,
    "canPawnPromote" BOOLEAN NOT NULL DEFAULT false,
    "whiteTime" INTEGER NOT NULL DEFAULT 600,
    "blackTime" INTEGER NOT NULL DEFAULT 600,
    "lastMove" TEXT,

    CONSTRAINT "game_pkey" PRIMARY KEY ("roomId")
);
