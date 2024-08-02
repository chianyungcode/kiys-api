import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { OrderValidation } from "../validation/order-validation";
import { OrderService } from "../service/order-service";
import { successResponse } from "../utils/response";
import { type Order } from "@prisma/client";

const route = new Hono();

// Create order
route.post("/", zValidator("json", OrderValidation.create), async (c) => {
  try {
    const validatedOrderData = c.req.valid("json");

    const newOrder = await OrderService.create(validatedOrderData);

    const orderResponse = successResponse({
      message: "Success create order",
      data: newOrder,
    });

    return c.json(orderResponse, 201);
  } catch (error) {}
});

// Get order by user id
route.get(
  "/:userId",
  zValidator("param", OrderValidation.getByUserId),
  async (c) => {
    try {
      const { userId } = c.req.valid("param");

      const order = await OrderService.getByUserId(userId);

      const orderResponse = successResponse<Order[]>({
        message: "Success get order by user id",
        data: order,
      });

      return c.json(orderResponse);
    } catch (error) {
      console.log(error);
    }
  }
);

// Get order

export default route;
