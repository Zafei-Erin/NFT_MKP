import { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma";

export const deleteOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const removedOffer = await prisma.offer.delete({
      where: { id: id },
    });
    res.status(201).json(removedOffer);
  } catch (error) {
    next(error);
  }
};
