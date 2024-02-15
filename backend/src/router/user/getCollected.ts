import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const getCollected = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nfts = await prisma.user
      .findUnique({
        where: {
          address: req.params.address,
        },
      })
      .ownNFTs();
    res.status(200).json(nfts);
  } catch (error) {
    next(error);
  }
};
