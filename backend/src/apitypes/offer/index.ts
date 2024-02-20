import { z } from "zod";

export const Offer = z.object({
  id: z.coerce.number(),
  price: z.coerce.number(),
  createAt: z.coerce.date(),
  expireAt: z.coerce.date(),
  fromAddress: z.coerce.string(),
  nftTokenId: z.coerce.number(),
});
export type Offer = z.infer<typeof Offer>;

export const GetOffersRequest = z.object({
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
  sortBy: z.enum(["id", "price", "createAt", "expireAt"]).optional(),
  sortDir: z.enum(["desc", "asc"]).optional(),
});
export type GetOffersRequest = z.infer<typeof GetOffersRequest>;
