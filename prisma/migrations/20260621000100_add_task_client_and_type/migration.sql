ALTER TABLE "Task" ADD COLUMN "clientId" TEXT;
ALTER TABLE "Task" ADD COLUMN "type" TEXT;

ALTER TABLE "Task" ADD CONSTRAINT "Task_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Task_clientId_idx" ON "Task"("clientId");
