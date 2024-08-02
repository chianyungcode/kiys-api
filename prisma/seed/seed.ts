import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { users } from "../data/user";
import { categories } from "../data/category";
import { products } from "../data/product";
import { orders } from "../data/order";
import { orderItems } from "../data/order-item";
import { argon2id } from "../../src/lib/oslo";

async function main() {
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.product.deleteMany();
  await prisma.order.deleteMany();

  // Seed users
  for (const user of users) {
    const newUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        password: await argon2id.hash(user.password),
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      },
    });

    console.log(newUser);
  }

  // Seed categories
  for (const category of categories) {
    const newCategory = await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });

    console.log(newCategory);
  }

  // Seed products
  for (const product of products) {
    const {
      id,
      name,
      description,
      sku,
      slug,
      isArchived,
      isFeatured,
      categoryId,
      price,
    } = product;

    const newProduct = await prisma.product.create({
      data: {
        id,
        name,
        description,
        sku,
        slug,
        isArchived,
        isFeatured,
        categoryId,
        price,
      },
    });

    console.log(newProduct);
  }

  // Seed orders
  for (const order of orders) {
    const { id, isPaid, userId, totalPrice } = order;

    // Periksa apakah user ada
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.error(
        `User dengan ID ${userId} tidak ditemukan untuk order ${id}`
      );
      continue; // Lewati order ini
    }

    try {
      const newOrder = await prisma.order.create({
        data: {
          id,
          userId: userId,
          isPaid,
          totalPrice,
        },
      });
      console.log(`Order berhasil dibuat:`, newOrder);
    } catch (error) {
      console.error(`Gagal membuat order ${id}:`, error);
    }
  }

  // Seed order items
  for (const orderItem of orderItems) {
    const { orderId, productId, quantity } = orderItem;

    const newOrderItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
      },
    });

    console.log(newOrderItem);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
