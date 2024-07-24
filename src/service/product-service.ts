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

  export const imageUpload = async (productId: string, urls: string[]) => {
    const images = await Promise.all(
      urls.map((imageUrl) =>
        prisma.image.create({
          data: {
            productId,
            url: imageUrl,
          },
        })
      )
    );

    return images;
  };

  export const getProduct = async (productId: string) => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
      },
    });

    return product;
  };

  // TODO: Disini harusnya bisa findUnique karena field slug unique pada prisma schema. Ada keanehan
  export const getProductBySlug = async (productSlug: string) => {
    const product = await prisma.product.findFirst({
      where: {
        slug: productSlug,
      },
      include: {
        images: true,
        category: true,
      },
    });

    return product;
  };

  export const getAllProducts = async ({
    page,
    limit,
  }: z.infer<typeof ProductValidation.queryParam>) => {
    const pageNumber = Number.parseInt(page, 10);
    const limitNumber = Number.parseInt(limit, 10);

    const products = await prisma.product.findMany({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        category: true,
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
