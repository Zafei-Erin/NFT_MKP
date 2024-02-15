import { NextFunction, Request, Response, Router } from "express";

import { prisma } from "../../prisma";
import { GetNFTRequest } from "../../apitypes/nft";

const DEFAULT_PARAMS = {
  take: 10,
  skip: 0,
  sortBy: "tokenId",
  sortDir: "desc",
  filterBool: false,
};

export const getNFTs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = GetNFTRequest.parse(req.query);
  const queryWithDefault = { ...DEFAULT_PARAMS, ...query };

  const sortBy = queryWithDefault.sortBy;
  const filterBy = queryWithDefault.filterBy;
  try {
    const nfts = await prisma.nft.findMany({
      take: queryWithDefault.take,
      skip: queryWithDefault.skip,
      orderBy: {
        [sortBy]: queryWithDefault.sortDir,
      },
      where: {
        ...(filterBy
          ? {
              [filterBy]: queryWithDefault.filterBool,
            }
          : {}),
      },
    });
    res.status(200).json(nfts);
  } catch (error) {
    next(error);
  }
};
