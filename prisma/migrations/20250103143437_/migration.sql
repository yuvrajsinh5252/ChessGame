/*
  Warnings:

  - You are about to drop the column `losses` on the `stats` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stats" DROP COLUMN "losses",
DROP COLUMN "wins";
