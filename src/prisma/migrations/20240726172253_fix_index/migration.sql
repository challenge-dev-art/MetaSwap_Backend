-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `telegramUserId` BIGINT UNSIGNED NOT NULL,
    `telegramUsername` VARCHAR(191) NULL,
    `telegramPhoto` VARCHAR(191) NULL,
    `telegramPhotoMime` VARCHAR(191) NULL,
    `firstName` VARCHAR(64) NOT NULL,
    `lastName` VARCHAR(64) NULL,
    `language` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `priceCurrency` VARCHAR(191) NULL,
    `totpSecret` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_publicId_key`(`publicId`),
    UNIQUE INDEX `User_telegramUserId_key`(`telegramUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailUpdateRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `secretCode` VARCHAR(191) NOT NULL,
    `finalized` BOOLEAN NOT NULL DEFAULT false,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EmailUpdateRequest_userId_secretCode_idx`(`userId`, `secretCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('VERIFIED', 'NON_VERIFIED', 'PENDING') NOT NULL,
    `progress` TINYINT UNSIGNED NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Verification_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `docId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currencyId` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,

    UNIQUE INDEX `Asset_ownerId_currencyId_key`(`ownerId`, `currencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FrozenAmount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `currencyId` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `unfrozen` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FrozenAmount_userId_currencyId_idx`(`userId`, `currencyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FreezeTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `frozenAmountId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FreezeTransaction_frozenAmountId_key`(`frozenAmountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnfreezeTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `frozenAmountId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UnfreezeTransaction_frozenAmountId_key`(`frozenAmountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('DEPOSIT', 'PAYOUT', 'SWAP', 'INTERNAL_TRANSFER_OUTPUT', 'INTERNAL_TRANSFER_INPUT') NOT NULL,
    `userId` INTEGER NOT NULL,
    `currencyIdInput` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NULL,
    `currencyIdOutput` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InternalTransferTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userOutputId` INTEGER NOT NULL,
    `userInputId` INTEGER NOT NULL,
    `currencyId` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `transactionOutputId` INTEGER NOT NULL,
    `transactionInputId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deposit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `currencyId` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `amount` DOUBLE NULL,
    `fee` DOUBLE NULL,
    `totalDebitAmount` DOUBLE NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `transactionId` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `idempotencyKey` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `valueMin` DOUBLE NOT NULL,
    `state` ENUM('PENDING_PAYMENT', 'MEM_POOL_FOUND', 'PAID', 'PENDING_INTERVENTION', 'CANCEL', 'ARCHIVED', 'DECLINED', 'COMPLETED', 'PENDING_COMPLIANCE_CHECK', 'EXPIRED') NOT NULL,
    `finalized` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Deposit_transactionId_key`(`transactionId`),
    UNIQUE INDEX `Deposit_idempotencyKey_key`(`idempotencyKey`),
    UNIQUE INDEX `Deposit_externalId_key`(`externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `transactionId` INTEGER NOT NULL,
    `depositAddress` VARCHAR(191) NOT NULL,
    `idempotencyKey` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `frozenAmountId` INTEGER NOT NULL,
    `currencyId` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `comment` VARCHAR(200) NOT NULL,
    `state` ENUM('CREATION_IN_PROGRESS', 'PENDING_CONFIRMATION', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELED') NOT NULL,
    `finalized` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Payout_transactionId_key`(`transactionId`),
    UNIQUE INDEX `Payout_idempotencyKey_key`(`idempotencyKey`),
    UNIQUE INDEX `Payout_externalId_key`(`externalId`),
    UNIQUE INDEX `Payout_frozenAmountId_key`(`frozenAmountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalypsoPayoutUpdate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `body` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CalypsoPayoutUpdate_externalId_idx`(`externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalypsoInvoiceUpdate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `body` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CalypsoInvoiceUpdate_externalId_idx`(`externalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalypsoPayoutEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventType` ENUM('PAYOUT_CHANGE_STATUS', 'PAYOUT_CONFIRMED', 'PAYOUT_VALIDATION_ERROR') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Autoconvert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currencyIdFrom` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `currencyIdTo` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BotSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,

    UNIQUE INDEX `BotSession_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmailUpdateRequest` ADD CONSTRAINT `EmailUpdateRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verification` ADD CONSTRAINT `Verification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerificationRequest` ADD CONSTRAINT `VerificationRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FrozenAmount` ADD CONSTRAINT `FrozenAmount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreezeTransaction` ADD CONSTRAINT `FreezeTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreezeTransaction` ADD CONSTRAINT `FreezeTransaction_frozenAmountId_fkey` FOREIGN KEY (`frozenAmountId`) REFERENCES `FrozenAmount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnfreezeTransaction` ADD CONSTRAINT `UnfreezeTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnfreezeTransaction` ADD CONSTRAINT `UnfreezeTransaction_frozenAmountId_fkey` FOREIGN KEY (`frozenAmountId`) REFERENCES `FrozenAmount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalTransferTransaction` ADD CONSTRAINT `InternalTransferTransaction_userOutputId_fkey` FOREIGN KEY (`userOutputId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalTransferTransaction` ADD CONSTRAINT `InternalTransferTransaction_userInputId_fkey` FOREIGN KEY (`userInputId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalTransferTransaction` ADD CONSTRAINT `InternalTransferTransaction_transactionOutputId_fkey` FOREIGN KEY (`transactionOutputId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalTransferTransaction` ADD CONSTRAINT `InternalTransferTransaction_transactionInputId_fkey` FOREIGN KEY (`transactionInputId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deposit` ADD CONSTRAINT `Deposit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deposit` ADD CONSTRAINT `Deposit_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payout` ADD CONSTRAINT `Payout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payout` ADD CONSTRAINT `Payout_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payout` ADD CONSTRAINT `Payout_frozenAmountId_fkey` FOREIGN KEY (`frozenAmountId`) REFERENCES `FrozenAmount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Autoconvert` ADD CONSTRAINT `Autoconvert_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
