import { z } from "zod";
import { ProductValidation } from "../validation/product-validation";
import { prisma } from "../../prisma/client";

export namespace ProductService {
  export const create = async (
    product: z.infer<typeof ProductValidation.create>
  ) => {
    const {
      name,
      slug,
      sku,
      description,
      price,
      isArchived,
      isFeatured,
      categoryId,
    } = product;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description,
        price,
        isArchived,
        isFeatured,
        categoryId,
      },
    });

    return newProduct;
  };

  export const update = async (
    id: string,
    product: z.infer<typeof ProductValidation.update>
  ) => {
    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: product,
    });

    return updatedProduct;
  };

  export const getProduct = async (productId: string) => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
      },
    });

    return product;
  };
  export const getAllProducts = async ({
    page,
    limit,
  }: z.infer<typeof ProductValidation.queryParam>) => {
    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  };

  export const deleteProduct = async (productId: string) => {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  };

  export const deleteAllProducts = async () => {
    await prisma.product.deleteMany();
  };
}
