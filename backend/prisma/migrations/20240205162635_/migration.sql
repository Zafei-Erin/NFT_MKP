/*
  Warnings:

  - You are about to drop the column `nftId` on the `Sale` table. All the data in the column will be lost.
  - Added the required column `nftTokenId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_nftId_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "nftId",
ADD COLUMN     "nftTokenId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_nftTokenId_fkey" FOREIGN KEY ("nftTokenId") REFERENCES "Nft"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
