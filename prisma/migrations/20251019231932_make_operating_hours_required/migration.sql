/*
  Warnings:

  - Made the column `operatingHours` on table `bars` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bars" ALTER COLUMN "operatingHours" SET NOT NULL;
