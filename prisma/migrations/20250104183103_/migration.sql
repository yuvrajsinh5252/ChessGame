/*
  Warnings:

  - You are about to alter the column `content` on the `ChatMessage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `userId` on the `ChatMessage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `userName` on the `ChatMessage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "content" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "userId" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "userName" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE INDEX "ChatMessage_roomId_idx" ON "ChatMessage"("roomId");

-- CreateIndex
CREATE INDEX "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt");
