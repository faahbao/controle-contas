/*
  Warnings:

  - You are about to drop the column `userId` on the `Categoria` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transacao" ADD COLUMN "grupoParcelasId" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Categoria" ("createdAt", "id", "nome", "tipo", "updatedAt") SELECT "createdAt", "id", "nome", "tipo", "updatedAt" FROM "Categoria";
DROP TABLE "Categoria";
ALTER TABLE "new_Categoria" RENAME TO "Categoria";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "Transacao_userId_idx" ON "Transacao"("userId");

-- CreateIndex
CREATE INDEX "Transacao_data_idx" ON "Transacao"("data");

-- CreateIndex
CREATE INDEX "Transacao_grupoParcelasId_idx" ON "Transacao"("grupoParcelasId");
