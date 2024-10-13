-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "board" TEXT NOT NULL,
    "currentPlayer" TEXT NOT NULL,
    "whiteTime" INTEGER NOT NULL DEFAULT 600,
    "blackTime" INTEGER NOT NULL DEFAULT 600,
    "lastMove" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
