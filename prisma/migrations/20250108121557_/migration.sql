-- CreateTable
CREATE TABLE "gameHistory" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "playerColor" TEXT NOT NULL,
    "opponentId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gameHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gameHistory_playerId_idx" ON "gameHistory"("playerId");

-- AddForeignKey
ALTER TABLE "gameHistory" ADD CONSTRAINT "gameHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
