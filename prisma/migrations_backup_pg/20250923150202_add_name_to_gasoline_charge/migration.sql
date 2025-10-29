/*
  Warnings:

  - Added the required column `name` to the `Gasoline_charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gasoline_charge" ADD COLUMN     "name" TEXT NOT NULL;
