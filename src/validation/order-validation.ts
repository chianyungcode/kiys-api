import { z } from "zod";

export const OrderValidation = {
  create: z.object({
    isPaid: z.boolean().default(false),
    userId: z.string().uuid(),
    orderItems: z.array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number(),
      })
    ),
  }),
  getByUserId: z.object({
    userId: z.string().uuid(),
  }),
};
