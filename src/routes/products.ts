import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ProductValidation } from "../validation/product-validation";
import { ProductService } from "../service/product-service";
import { errorResponse, successResponse } from "../utils/response";
import { Product } from "@prisma/client";
import { uploadWithR2 } from "../lib/cloudflare-r2";

const route = new Hono();
// route.use(authMiddleware);

// Create product
route.post("/", zValidator("json", ProductValidation.create), async (c) => {
  try {
    const validatedProductData = c.req.valid("json");

    const newProduct = await ProductService.create(validatedProductData);

    const productResponse = successResponse<Product>({
      message: "Product created",
      data: newProduct,
    });

    return c.json(productResponse);
  } catch (error) {
    console.error(error);

    return c.json(
      errorResponse({
        errors: "Failed to create product",
        message: "Failed to create product",
      })
    );
  }
});

// Get all products
route.get("/", zValidator("query", ProductValidation.queryParam), async (c) => {
  try {
    const { page, limit } = c.req.valid("query");

    const products = await ProductService.getAllProducts({ page, limit });

    const productResponse = successResponse<Product[]>({
      message: "Products fetched successfully",
      data: products,
    });

    return c.json(productResponse);
  } catch (error) {
    console.error(error);

    return c.json(
      errorResponse({
        errors: "Failed to get products",
        message: "Failed to get products",
      })
    );
  }
});

// Get product by id
route.get(
  "/:productId",
  zValidator("param", ProductValidation.paramId),
  async (c) => {
    try {
      const { productId } = c.req.valid("param");

      const product = await ProductService.getProduct(productId);

      const productResponse = successResponse<Product>({
        message: "Product found",
        data: product,
      });

      return c.json(productResponse);
    } catch (error) {
      console.error(error);

      return c.json(
        errorResponse({
          errors: "Failed to get product",
          message: "Failed to get product",
        })
      );
    }
  }
);

// Update product by id
route.put(
  "/:productId",
  zValidator("param", ProductValidation.paramId),
  zValidator("json", ProductValidation.update),
  async (c) => {
    try {
      const { productId } = c.req.valid("param");
      const validatedProductData = c.req.valid("json");

      const updatedProduct = await ProductService.update(
        productId,
        validatedProductData
      );

      const productResponse = successResponse<Product>({
        message: "Product updated",
        data: updatedProduct,
      });

      return c.json(productResponse);
    } catch (error) {
      console.error(error);

      return c.json(
        errorResponse({
          errors: "Failed to update product",
          message: "Failed to update product",
        })
      );
    }
  }
);

// Delete product by id
route.delete(
  "/:productId",
  zValidator("param", ProductValidation.paramId),
  async (c) => {
    try {
      const { productId } = c.req.valid("param");

      await ProductService.deleteProduct(productId);

      const productResponse = successResponse({
        message: "Product deleted",
      });

      return c.json(productResponse);
    } catch (error) {
      console.error(error);

      return c.json(
        errorResponse({
          errors: "Failed to delete product",
          message: "Failed to delete product",
        })
      );
    }
  }
);

// Delete all products
route.delete("/", async (c) => {
  try {
    await ProductService.deleteAllProducts();

    const productResponse = successResponse({
      message: "All product deleted",
    });

    return c.json(productResponse);
  } catch (error) {
    console.error(error);

    return c.json(
      errorResponse({
        errors: "Failed to delete all product",
        message: "Failed to delete all product",
      })
    );
  }
});

// Image upload product
route.post(
  "/:productId/upload",
  zValidator("param", ProductValidation.paramId),
  async (c) => {
    try {
      const { productId } = c.req.valid("param");
      const formData = await c.req.parseBody({ all: true });

      const uploadedFiles = formData["fileName"];

      if (typeof uploadedFiles === "string" || !Array.isArray(uploadedFiles)) {
        throw new Error("Invalid format: Expected array of files");
      }

      const uploadedImagesData = await uploadWithR2(
        uploadedFiles as File[],
        productId
      );

      const updatedProduct = await ProductService.imageUpload(
        productId,
        uploadedImagesData
      );

      const uploadResponse = successResponse({
        message: "Upload successfully",
        data: updatedProduct,
      });

      return c.json(uploadResponse);
    } catch (error) {
      console.error(error);

      return c.json(
        errorResponse({
          errors: "Failed to upload image",
          message: "Failed to upload image",
        })
      );
    }
  }
);

export default route;
