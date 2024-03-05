import { NextFunction, Request, Response } from "express";
import { GetOffersRequest } from "@zafei/nft_mkp_types";
import { prisma } from "../../prisma";

const DEFAULT_PARAMS = {
  skip: 0,
  take: 6,
  sortBy: "createAt",
  sortDir: "desc",
};

export const getOffersByNFT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tokenId } = req.params;
    const query = GetOffersRequest.parse(req.query);
    const queryWithDefault = { ...DEFAULT_PARAMS, ...query };

    const sortBy = queryWithDefault.sortBy;

    const offers = await prisma.offer.findMany({
      where: {
        nftTokenId: parseInt(tokenId),
      },
      skip: queryWithDefault.skip,
      take: queryWithDefault.take,
      orderBy: {
        [sortBy]: queryWithDefault.sortDir,
      },
    });

    const total = await prisma.offer.count();

    res.status(200).json({ offers, total });
  } catch (error) {
    next(error);
  }
};
