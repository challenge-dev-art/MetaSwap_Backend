/*
  Warnings:

  - A unique constraint covering the columns `[verificationRequestId]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Verification` ADD COLUMN `verificationError` VARCHAR(191) NULL,
    ADD COLUMN `verificationRequestId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Verification_verificationRequestId_key` ON `Verification`(`verificationRequestId`);

-- AddForeignKey
ALTER TABLE `Verification` ADD CONSTRAINT `Verification_verificationRequestId_fkey` FOREIGN KEY (`verificationRequestId`) REFERENCES `VerificationRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
