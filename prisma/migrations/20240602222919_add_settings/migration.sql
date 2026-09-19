-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `whiteLogo` VARCHAR(191) NULL,
    `blackLogo` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `whatsappNumber` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `settingsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SocialLink` ADD CONSTRAINT `SocialLink_settingsId_fkey` FOREIGN KEY (`settingsId`) REFERENCES `Settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
