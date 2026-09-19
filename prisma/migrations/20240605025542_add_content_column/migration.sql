/*
  Warnings:

  - Added the required column `content` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Service` ADD COLUMN `content` LONGTEXT NOT NULL,
    ADD COLUMN `galleryImages` VARCHAR(191) NULL,
    MODIFY `description` TEXT NOT NULL;
