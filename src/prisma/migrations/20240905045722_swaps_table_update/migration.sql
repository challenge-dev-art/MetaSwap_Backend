/*
  Warnings:

  - Added the required column `state` to the `Swaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `swaps` ADD COLUMN `state` ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL;
