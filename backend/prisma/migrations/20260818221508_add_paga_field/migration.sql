-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "frequencia" TEXT,
    "parcelas" INTEGER,
    "parcelaAtual" INTEGER,
    "grupoParcelasId" TEXT,
    "paga" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transacao" ("categoria", "createdAt", "data", "descricao", "frequencia", "grupoParcelasId", "id", "parcelaAtual", "parcelas", "recorrente", "tipo", "updatedAt", "userId", "valor") SELECT "categoria", "createdAt", "data", "descricao", "frequencia", "grupoParcelasId", "id", "parcelaAtual", "parcelas", "recorrente", "tipo", "updatedAt", "userId", "valor" FROM "Transacao";
DROP TABLE "Transacao";
ALTER TABLE "new_Transacao" RENAME TO "Transacao";
CREATE INDEX "Transacao_userId_idx" ON "Transacao"("userId");
CREATE INDEX "Transacao_data_idx" ON "Transacao"("data");
CREATE INDEX "Transacao_grupoParcelasId_idx" ON "Transacao"("grupoParcelasId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
