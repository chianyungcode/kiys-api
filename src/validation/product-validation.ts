import { z } from "zod";

export namespace ProductValidation {
  export const create = z.object({
    name: z.string().min(1, { message: "Minimum 1 character" }),
    slug: z.string().toLowerCase(),
    sku: z.string(),
    description: z.string(),
    price: z.number(),
    isArchived: z.boolean(),
    isFeatured: z.boolean(),
    categoryId: z.string(),
  });

  export const update = ProductValidation.create;

  // export const images = z.object({
  //   url: z.string().url(),
  //   productId: z.string().uuid(),
  // });

  export const queryParam = z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
  });

  export const paramId = z.object({
    productId: z.string().uuid(),
  });
}
