-- AlterTable
ALTER TABLE "Nft" ALTER COLUMN "tokenId" DROP DEFAULT;
DROP SEQUENCE "Nft_tokenId_seq";
