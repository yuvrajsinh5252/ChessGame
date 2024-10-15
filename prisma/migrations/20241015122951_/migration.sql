/*
  Warnings:

  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "player" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "name" TEXT,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
