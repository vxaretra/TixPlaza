-- CreateTable
CREATE TABLE `_CategoriesMasterToTicket` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoriesMasterToTicket_AB_unique`(`A`, `B`),
    INDEX `_CategoriesMasterToTicket_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoriesMasterToTicket` ADD CONSTRAINT `_CategoriesMasterToTicket_A_fkey` FOREIGN KEY (`A`) REFERENCES `CategoriesMaster`(`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoriesMasterToTicket` ADD CONSTRAINT `_CategoriesMasterToTicket_B_fkey` FOREIGN KEY (`B`) REFERENCES `Ticket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
