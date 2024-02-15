import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const getNFT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: parseInt(req.params.tokenId),
      },
      include: {
        offers: {
          include: {
            from: true,
          },
        },
        sales: true,
      },
    });
    res.status(200).json(nft);
  } catch (error) {
    next(error);
  }
};
