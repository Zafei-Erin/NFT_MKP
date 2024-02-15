import { Router } from "express";
import { buyNFT, getNFT, getNFTs, patchNFT, postNFT } from "./nfts";
import { getCollected, getCreated, getOffered } from "./user";
import { deleteOffer, getOffersByNFT, patchOffer, postOffer } from "./offers";

const router = Router();

router.get("/test", (req, res) => {
  res.status(200).json({ message: "API is working 11" });
});

router.get("/nfts", getNFTs);
router.get("/nfts/:tokenId", getNFT);
router.get("/user/:address/created", getCreated);
router.get("/user/:address/collected", getCollected);
router.get("/user/:address/offered", getOffered);
router.get("/offers/:tokenId", getOffersByNFT);

router.post("/nfts", postNFT);
router.post("/offers", postOffer);

router.patch("/nfts/:tokenId", patchNFT);
router.patch("/nfts/buy/:tokenId", buyNFT);
router.patch("/offers/:id", patchOffer);

router.delete("/offers/:id", deleteOffer);

export default router;
