import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { CategoryValidation } from "../validation/category-validation";
import { ProductValidation } from "../validation/product-validation";
import { z } from "zod";

export class CategoryService {
  static async create(category: z.infer<typeof CategoryValidation.create>) {
    const { name, slug, description } = category;

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    return newCategory;
  }

  static async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    return categories;
  }

  static async getCategory(slug: string) {
    const category = await prisma.category.findUniqueOrThrow({
      where: {
        slug,
      },
    });

    return category;
  }

  static async update(
    id: string,
    updatedCategory: z.infer<typeof CategoryValidation.update>
  ) {
    const category = await prisma.category.update({
      where: { id },
      data: updatedCategory,
    });

    return category;
  }

  static async deleteCategory(id: string) {
    await prisma.category.delete({
      where: {
        id,
      },
    });
  }

  static async deleteAllCategories() {
    await prisma.category.deleteMany();
  }
}
