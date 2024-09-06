-- CreateTable
CREATE TABLE `Swaps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sourceCurrency` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `destinationCurrency` ENUM('BTC', 'ETH', 'USDT_TRX', 'USDT', 'LTC', 'TRX') NOT NULL,
    `sourceAmount` INTEGER NOT NULL,
    `destinationAmount` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `hashId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL,

    INDEX `Swaps_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Swaps` ADD CONSTRAINT `Swaps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
