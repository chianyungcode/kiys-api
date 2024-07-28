import { z } from "zod";

export namespace CategoryValidation {
  export const create = z.object({
    name: z.string().min(1),
    slug: z.string().toLowerCase(),
    description: z.string(),
  });

  export const paramId = z.object({
    categoryId: z.string().uuid(),
  });

  export const paramSlug = z.object({
    categorySlug: z.string().toLowerCase(),
  });

  export const update = CategoryValidation.create;
}
