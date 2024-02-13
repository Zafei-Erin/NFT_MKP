import { z } from "zod";

export const Offer = z.object({
  id: z.coerce.number(),
  price: z.coerce.number(),
  createAt: z.coerce.date(),
  expireAt: z.coerce.date(),
  fromAddress: z.coerce.string(),
  nftId: z.coerce.number(),
});

export type Offer = z.infer<typeof Offer>;
