/*
  Warnings:

  - Added the required column `distance` to the `navigations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "navigations" ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL;
