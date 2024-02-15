import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const postOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const offer = await prisma.offer.create({
      data: {
        price: req.body.price,
        createAt: req.body.createAt,
        expireAt: req.body.expireAt,
        from: {
          connectOrCreate: {
            where: {
              address: req.body.fromAddress,
            },
            create: {
              address: req.body.fromAddress,
            },
          },
        },
        nft: {
          connect: {
            tokenId: req.body.nftId,
          },
        },
      },
    });
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};
