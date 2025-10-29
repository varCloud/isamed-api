/*
  Warnings:

  - You are about to drop the column `extras` on the `Per_diem` table. All the data in the column will be lost.
  - You are about to drop the column `gasoline` on the `Per_diem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Per_diem" DROP COLUMN "extras",
DROP COLUMN "gasoline";

-- CreateTable
CREATE TABLE "Gasoline_charge" (
    "id" SERIAL NOT NULL,
    "per_diem_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gasoline_charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extra_expense" (
    "id" SERIAL NOT NULL,
    "per_diem_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Extra_expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Gasoline_charge_per_diem_id_idx" ON "Gasoline_charge"("per_diem_id");

-- CreateIndex
CREATE INDEX "Extra_expense_per_diem_id_idx" ON "Extra_expense"("per_diem_id");

-- AddForeignKey
ALTER TABLE "Gasoline_charge" ADD CONSTRAINT "Gasoline_charge_per_diem_fkey" FOREIGN KEY ("per_diem_id") REFERENCES "Per_diem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extra_expense" ADD CONSTRAINT "Extra_expense_per_diem_fkey" FOREIGN KEY ("per_diem_id") REFERENCES "Per_diem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
