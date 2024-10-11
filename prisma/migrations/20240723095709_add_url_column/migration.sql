/*
  Warnings:

  - Added the required column `url` to the `TicketMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticketmedia` ADD COLUMN `url` VARCHAR(191) NOT NULL;
