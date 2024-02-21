import { z } from "zod";

export const GetNFTRequest = z.object({
  take: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
  sortBy: z.enum(["tokenId", "price"]).optional(),
  sortDir: z.enum(["desc", "asc"]).optional(),
  filterBy: z.enum(["listed"]).optional(),
  filterBool: z.coerce.boolean().optional(),
});
export type GetNFTRequest = z.infer<typeof GetNFTRequest>;
