/*
  Warnings:

  - You are about to drop the column `nftId` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `nftTokenId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_nftId_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "nftId",
ADD COLUMN     "nftTokenId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_nftTokenId_fkey" FOREIGN KEY ("nftTokenId") REFERENCES "Nft"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
