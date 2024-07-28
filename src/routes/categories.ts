import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CategoryService } from "../service/category-service";
import { errorResponse, successResponse } from "../utils/response";
import { Category } from "@prisma/client";
import { CategoryValidation } from "../validation/category-validation";
import { authMiddleware } from "../middleware/authMiddleware";

const route = new Hono();
route.use(authMiddleware);

// Create categories
route.post("/", zValidator("json", CategoryValidation.create), async (c) => {
  try {
    const validatedCategoryData = c.req.valid("json");

    const newCategory = await CategoryService.create(validatedCategoryData);

    const categoryResponse = successResponse<Category>({
      data: newCategory,
      message: "Category created",
    });

    return c.json(categoryResponse, 201);
  } catch (error) {
    return c.json(
      errorResponse({ errors: error, message: "Failed to create product" })
    );
  }
});

// Get all category
route.get("/", async (c) => {
  try {
    const categories = await CategoryService.getCategories();

    const categoryResponse = successResponse<Category[]>({
      data: categories,
      message: "Fetched all categories",
    });

    return c.json(categoryResponse);
  } catch (error) {
    return c.json(
      errorResponse({ errors: error, message: "Failed to get categories" })
    );
  }
});

// Get category by slug
route.get(
  "/:categorySlug",
  zValidator("param", CategoryValidation.paramSlug),
  async (c) => {
    try {
      const { categorySlug } = c.req.valid("param");

      const category = await CategoryService.getCategory(categorySlug);

      const categoryResponse = successResponse<Category>({
        data: category,
        message: "success",
      });

      return c.json(categoryResponse);
    } catch (error) {
      return c.json(
        errorResponse({ errors: error, message: "Failed to get category" })
      );
    }
  }
);

// Update category by id
route.put(
  "/:categoryId",
  zValidator("param", CategoryValidation.paramId),
  zValidator("json", CategoryValidation.update),
  async (c) => {
    try {
      const { categoryId } = c.req.valid("param");
      const validatedCategoryData = c.req.valid("json");

      const updatedCategory = await CategoryService.update(
        categoryId,
        validatedCategoryData
      );

      const categoryResponse = successResponse<Category>({
        data: updatedCategory,
        message: "success",
      });

      return c.json(categoryResponse);
    } catch (error) {
      return c.json(
        errorResponse({ errors: error, message: "Failed to update category" })
      );
    }
  }
);

// Delete category by id
route.delete(
  "/:categoryId",
  zValidator("param", CategoryValidation.paramId),
  async (c) => {
    try {
      const { categoryId } = await c.req.valid("param");

      await CategoryService.deleteCategory(categoryId);

      const categoryResponse = successResponse({
        message: "Category deleted",
      });

      return c.json(categoryResponse);
    } catch (error) {
      return c.json(
        errorResponse({ errors: error, message: "Failed to delete category" })
      );
    }
  }
);

// Delete all category
route.delete("/", async (c) => {
  try {
    await CategoryService.deleteAllCategories();

    const categoryResponse = successResponse({
      message: "All category delete",
    });

    return c.json(categoryResponse);
  } catch (error) {
    return c.json(
      errorResponse({ errors: error, message: "Failed to delete all category" })
    );
  }
});

export default route;
