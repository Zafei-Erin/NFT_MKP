import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const postNFT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nft = await prisma.nft.create({
      data: {
        tokenId: parseInt(req.body.tokenId),
        uri: req.body.uri,
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: parseFloat(req.body.price),
        creator: {
          connectOrCreate: {
            where: {
              address: req.body.creatorAddress,
            },
            create: {
              address: req.body.creatorAddress,
            },
          },
        },
        owner: {
          connectOrCreate: {
            where: {
              address: req.body.ownerAddress,
            },
            create: {
              address: req.body.ownerAddress,
            },
          },
        },
      },
    });
    res.status(201).json(nft);
  } catch (error) {
    next(error);
  }
};
