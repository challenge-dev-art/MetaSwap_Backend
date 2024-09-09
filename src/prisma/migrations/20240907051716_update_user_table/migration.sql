/*
  Warnings:

  - Added the required column `adminPermission` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPermission` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userRole` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `adminPermission` ENUM('UNBLOCK', 'BLOCK') NOT NULL,
    ADD COLUMN `userPermission` ENUM('UNBLOCK', 'BLOCK') NOT NULL,
    ADD COLUMN `userRole` ENUM('USER', 'ADMIN', 'SUPER') NOT NULL;
