import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const buyNFT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenId = parseInt(req.params.tokenId);
    const { price, date, ownerAddr } = req.body;

    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: tokenId,
      },
    });

    if (!nft) {
      throw Error("cannot find this nft");
    }

    const sale = await prisma.sale.create({
      data: {
        price: parseFloat(price),
        date: new Date(date),
        nftTokenId: tokenId,
      },
    });

    const upadatedNft = await prisma.nft.update({
      where: {
        tokenId: tokenId,
      },
      data: {
        listed: false,
        owner: {
          connectOrCreate: {
            where: {
              address: ownerAddr,
            },
            create: {
              address: ownerAddr,
            },
          },
        },
      },
    });
    res.status(201).json(upadatedNft);
  } catch (error) {
    next(error);
  }
};
