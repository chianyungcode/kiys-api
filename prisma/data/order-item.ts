import { orders } from "./order";
import { products } from "./product";

interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
}

const productIds = products.map((product) => ({
  id: product.id,
}));

const orderIds = orders.map((order) => ({
  id: order.id,
}));

const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const orderItems: OrderItem[] = Array.from({ length: 10 }, () => ({
  orderId: orderIds[getRandomNumber(orderIds.length)].id,
  productId: productIds[getRandomNumber(productIds.length)].id,
  quantity: getRandomNumber(10) + 1,
}));
