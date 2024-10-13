/*
  Warnings:

  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatRoomId_fkey";

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "players" TEXT[],
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
    "chatRoomId" TEXT,
    "roomId" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
