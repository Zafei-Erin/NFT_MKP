import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const getCreated = async (
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
      .createdNFTs({
        include: {
          sales: true,
        },
      });
      
    res.status(200).json(nfts);
  } catch (error) {
    next(error);
  }
};
