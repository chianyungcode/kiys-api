import { z } from "zod";
import { OrderValidation } from "../validation/order-validation";
import { prisma } from "../../prisma/client";

export class OrderService {
  static async create(order: z.infer<typeof OrderValidation.create>) {
    try {
      // TODO: Check if order is not paid , orderItems added
      const existingOrder = await prisma.order.findFirst({
        where: {
          userId: order.userId,
          isPaid: false,
        },
      });

      if (existingOrder) {
        // Get existing order items
        const existingOrderItems = await prisma.orderItem.findMany({
          where: { orderId: existingOrder.id },
        });

        // Array for storing update operation and create operation
        const updateOperations = [];
        const createOperations = [];

        // Proses setiap orderItem baru
        for (const newItem of order.orderItems) {
          const existingItem = existingOrderItems.find(
            (item) => item.productId === newItem.productId
          );

          if (existingItem) {
            // Update quantity if productId already exist
            updateOperations.push(
              prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + newItem.quantity },
              })
            );
          } else {
            // create new orderItem if productId not exists
            createOperations.push(
              prisma.orderItem.create({
                data: {
                  orderId: existingOrder.id,
                  productId: newItem.productId,
                  quantity: newItem.quantity,
                },
              })
            );
          }
        }

        // Running all operation
        await prisma.$transaction([...updateOperations, ...createOperations]);

        // Take updated order and return it
        const updatedOrder = await prisma.order.findUnique({
          where: { id: existingOrder.id },
          include: { orderItems: true },
        });

        return updatedOrder;
      } else {
        const newOrder = await prisma.order.create({
          data: {
            userId: order.userId,
            isPaid: false,
            orderItems: {
              create: order.orderItems.map((orderItem) => ({
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
          include: {
            orderItems: true,
          },
        });
        return newOrder;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Zod Validation Error ${error.message}`);
      }
      throw new Error("Failed to create order");
    }
  }

  static async getByUserId(userId: string) {
    try {
      const order = await prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          orderItems: true,
        },
      });

      return order;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Zod Validation Error ${error.message}`);
      }
      throw new Error("Failed get order");
    }
  }
}
