import { z } from "zod";
import { ProductValidation } from "../validation/product-validation";
import { OrderValidation } from "../validation/order-validation";
import { prisma } from "../../prisma/client";

export class OrderService {
  static async create(order: z.infer<typeof OrderValidation.create>) {
    try {
      const newOrder = await prisma.order.create({
        data: {
          userId: order.userId,
          isPaid: false,
          orderItems: {
            create: {
              product: {
                connect: {
                  id: order.productId,
                },
              },
            },
          },
        },
      });

      return newOrder;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Zod Validation Error ${error.message}`);
      }
      throw new Error("Failed to create order");
    }
  }
}
