-- CreateTable
CREATE TABLE `ColorSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `primaryColor` VARCHAR(191) NOT NULL,
    `secondaryColor` VARCHAR(191) NOT NULL,
    `buttonColor` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
