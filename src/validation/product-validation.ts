import { z } from "zod";

export namespace ProductValidation {
  const MAX_FILE_SIZE = 1024 * 1024 * 5;
  const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

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

  export const image = z.object({
    image: z
      .any()
      .refine(
        (file) => file?.size <= MAX_FILE_SIZE,
        `Maximum file size is 5MB.`
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type.split("/")[1]),
        "Only accept .jpg, .jpeg, .png and .webp."
      ),
  });

  export const queryParam = z.object({
    page: z.string().default("1"),
    limit: z.string().default("10"),
  });

  export const paramId = z.object({
    productId: z.string().uuid(),
  });

  export const paramSlug = z.object({
    productSlug: z.string().toLowerCase(),
  });
}
