-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_nftId_fkey";

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
