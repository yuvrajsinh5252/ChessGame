/*
  Warnings:

  - You are about to drop the column `isCheckmate` on the `game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "game" DROP COLUMN "isCheckmate",
ADD COLUMN     "winner" TEXT DEFAULT 'none';
