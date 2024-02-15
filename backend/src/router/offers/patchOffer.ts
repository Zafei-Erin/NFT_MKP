import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";
import { Offer } from "../../apitypes/offer";

export const patchOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newOffer = Offer.parse(req.body);
    const { id } = req.params;
    const updatedOffer = await prisma.offer.update({
      where: { id: parseInt(id) },
      data: {
        ...newOffer,
      },
    });
    res.status(201).json(updatedOffer);
  } catch (error) {
    next(error);
  }
};
