import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const getOffered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const offers = await prisma.user
      .findUnique({
        where: {
          address: req.params.address,
        },
      })
      .offers({
        include: {
          nft: true,
        },
      });

    if (offers === null) {
      res.status(200).json([]);
    }
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};
