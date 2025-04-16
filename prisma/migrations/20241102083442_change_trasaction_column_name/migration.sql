/*
  Warnings:

  - You are about to rename the column `subTotal` on the `transaction` table.

*/
-- AlterTable
ALTER TABLE `transaction` RENAME COLUMN `subTotal` TO `total`;
