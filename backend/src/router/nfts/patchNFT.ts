import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const patchNFT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenId = parseInt(req.params.tokenId);
    const { userAddr, ...rest } = req.body;
    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: tokenId,
      },
    });
    const owner = nft !== null ? nft.ownerAddress : "";
    const creator = nft !== null ? nft.creatorAddress : "";

    if (owner === "" || creator === "") {
      throw new Error("User not found");
    }

    // if (owner !== "0x0000000000000000000000000000000000000000") {
    //   console.log("owner: ", owner);
    //   if (userAddr.toLowerCase() !== owner.toLowerCase()) {
    //     throw new Error("Permission denied");
    //   }
    // } else {
    //   console.log("creator: ", creator);
    //   if (userAddr.toLowerCase() !== creator.toLowerCase()) {
    //     throw new Error("Permission denied");
    //   }
    // }

    let formattedRest = rest;
    if (rest.price) {
      formattedRest = {
        ...rest,
        price: parseFloat(rest.price),
      };
    }

    // bug here
    const upadatedNft = await prisma.nft.update({
      where: {
        tokenId: tokenId,
      },
      data: {
        ...formattedRest,
      },
    });

    res.status(201).json(upadatedNft);
  } catch (error) {
    next(error);
  }
};
