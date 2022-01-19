-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userIdentifier` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `hireDate` DATETIME(3) NULL,
    `idCardNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('GERANT', 'FINANCIER', 'ADMINISTRATEUR', 'ADMIN_SYSTEM', 'SOUS_GERANT', 'VENDEUR') NOT NULL DEFAULT 'ADMIN_SYSTEM',
    `shopIdentifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_userIdentifier_key`(`userIdentifier`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopIdentifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `openDate` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `location` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Shop_shopIdentifier_key`(`shopIdentifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountName` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `accountingClass` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Accounts_accountName_key`(`accountName`),
    UNIQUE INDEX `Accounts_accountNumber_key`(`accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `debit` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `credit` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `exchangeRate` DECIMAL(65, 30) NOT NULL DEFAULT 1.0,
    `currency` VARCHAR(255) NOT NULL DEFAULT 'USD',
    `accountNumber` VARCHAR(191) NOT NULL,
    `journalEntryId` INTEGER NOT NULL,
    `bookAccountNumber` VARCHAR(191) NOT NULL,
    `shopIdentifier` VARCHAR(191) NOT NULL,
    `voided` BOOLEAN NOT NULL DEFAULT false,
    `voidedReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `bookAccountNumber` VARCHAR(191) NOT NULL,
    `voided` BOOLEAN NOT NULL DEFAULT false,
    `voidedReason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `bookAccountNumber` VARCHAR(191) NOT NULL,
    `quotedCurrency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `shopIdentifier` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Book_name_key`(`name`),
    UNIQUE INDEX `Book_bookAccountNumber_key`(`bookAccountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_shopIdentifier_fkey` FOREIGN KEY (`shopIdentifier`) REFERENCES `Shop`(`shopIdentifier`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountNumber_fkey` FOREIGN KEY (`accountNumber`) REFERENCES `Accounts`(`accountNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_journalEntryId_fkey` FOREIGN KEY (`journalEntryId`) REFERENCES `JournalEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_bookAccountNumber_fkey` FOREIGN KEY (`bookAccountNumber`) REFERENCES `Book`(`bookAccountNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_shopIdentifier_fkey` FOREIGN KEY (`shopIdentifier`) REFERENCES `Shop`(`shopIdentifier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_bookAccountNumber_fkey` FOREIGN KEY (`bookAccountNumber`) REFERENCES `Book`(`bookAccountNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_shopIdentifier_fkey` FOREIGN KEY (`shopIdentifier`) REFERENCES `Shop`(`shopIdentifier`) ON DELETE RESTRICT ON UPDATE CASCADE;
