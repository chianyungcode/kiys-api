import { z } from "zod";

export namespace OrderValidation {
  export const create = z.object({
    isPaid: z.boolean().default(false),
    userId: z.string().uuid(),
    productId: z.string().uuid(),
  });
}
