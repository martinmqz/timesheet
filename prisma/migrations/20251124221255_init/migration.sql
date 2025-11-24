/*
  Warnings:

  - You are about to alter the column `rate` on the `Timesheet` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_timesheetId_fkey";

-- DropForeignKey
ALTER TABLE "Timesheet" DROP CONSTRAINT "Timesheet_userId_fkey";

-- AlterTable
ALTER TABLE "Timesheet" ALTER COLUMN "rate" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "LineItem_timesheetId_idx" ON "LineItem"("timesheetId");

-- CreateIndex
CREATE INDEX "Timesheet_userId_idx" ON "Timesheet"("userId");

-- AddForeignKey
ALTER TABLE "Timesheet" ADD CONSTRAINT "Timesheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
