import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";
import { GetOffersRequest } from "../../apitypes/offer";

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
        nftId: parseInt(tokenId),
      },
      skip: queryWithDefault.skip,
      take: queryWithDefault.take,
      orderBy: {
        [sortBy]: sortBy,
      },
    });
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};
