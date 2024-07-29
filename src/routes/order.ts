import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { OrderValidation } from "../validation/order-validation";
import { OrderService } from "../service/order-service";
import { successResponse } from "../utils/response";
import { type Order } from "@prisma/client";

const route = new Hono();

route.post("/orders", zValidator("json", OrderValidation.create), async (c) => {
  try {
    const validatedOrderData = c.req.valid("json");

    const newOrder = await OrderService.create(validatedOrderData);

    const orderResponse = successResponse<Order>({
      message: "Success create order",
      data: newOrder,
    });

    return c.json(orderResponse, 201);
  } catch (error) {}
});
