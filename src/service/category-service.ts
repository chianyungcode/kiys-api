import { prisma } from "../../prisma/client";
import { CategoryValidation } from "../validation/category-validation";
import { z } from "zod";

export class CategoryService {
  /**
   * Creates a new category.
   *
   * @param category - The category data to create.
   * @returns The newly created category.
   */
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

  /**
   * Retrieves all categories including their products and images.
   *
   * @returns A list of categories with their associated products and images.
   */
  static async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            images: true,
          },
        },
      },
    });

    return categories;
  }

  /**
   * Retrieves a category by its slug, including its products and images.
   *
   * @param slug - The unique slug of the category to retrieve.
   * @returns A promise that resolves to the category with its associated products and images.
   * @throws {Prisma.PrismaClientKnownRequestError} If the category is not found.
   */
  static async getCategory(slug: string) {
    const category = await prisma.category.findUniqueOrThrow({
      where: {
        slug,
      },
      include: {
        products: {
          include: {
            images: true,
          },
        },
      },
    });

    return category;
  }

  /**
   * Updates an existing category.
   *
   * @param id - The ID of the category to update.
   * @param updatedCategory - The updated category data.
   * @returns The updated category.
   */
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

  /**
   * Deletes a category by its ID.
   *
   * @param id - The ID of the category to delete.
   */
  static async deleteCategory(id: string) {
    await prisma.category.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Deletes all categories.
   */
  static async deleteAllCategories() {
    await prisma.category.deleteMany();
  }
}
