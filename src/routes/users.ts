import { Hono } from "hono";
import { UserService } from "../service/user-service";
import { errorResponse, successResponse } from "../utils/response";
import { User } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { UserValidation } from "../validation/user-validation";

const route = new Hono();

// Get all users
// TODO Disini harus ada pengecekan bahwa user yang mengakses ini harus admin
// TODO Tambahkan ketika user yang dicari tidak ada harus ada balikkan apa
route.get("/", zValidator("query", UserValidation.queryParam), async (c) => {
  try {
    const { page, limit } = c.req.valid("query");

    const users = await UserService.getAllUsers({ page, limit });
    const totalData = await UserService.getUsersCount();

    const userResponse = successResponse<User[]>({
      message: "Users fetched successfully",
      data: users,
      pagination: {
        totalData,
        page,
        limit,
        totalPages: Math.ceil(totalData / limit),
      },
    });

    return c.json(userResponse);
  } catch (error) {
    console.error(error);
    return c.json(
      errorResponse({
        errors: "failed to fetch users",
        message: "Failed to fetch users",
      })
    );
  }
});

// Get spesific users
route.get("/:id", zValidator("param", UserValidation.paramId), async (c) => {
  try {
    const { id } = c.req.valid("param");

    const user = await UserService.getUser(id);

    if (!user) {
      return c.json("User not found");
    }

    const userResponse = successResponse<User>({
      message: "User fetched successfully",
      data: user,
    });

    return c.json(userResponse);
  } catch (error) {
    console.error(error);
    return c.json(
      errorResponse({
        errors: "failed to fetch users",
        message: "Failed to fetch users",
      })
    );
  }
});

// Update user
route.put(
  "/:id",
  zValidator("param", UserValidation.paramId),
  zValidator("json", UserValidation.update),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const validatedUserData = c.req.valid("json");

      const updatedUser = await UserService.update(id, validatedUserData);

      const userResponse = successResponse<User>({
        message: "Success update the data",
        data: updatedUser,
      });

      return c.json(userResponse);
    } catch (error) {
      console.error(error);
      return c.json(
        errorResponse({
          errors: "Failed to update data",
          message: "Failed to update data",
        })
      );
    }
  }
);

// Delete User
route.delete("/:id", zValidator("param", UserValidation.paramId), async (c) => {
  try {
    const { id } = c.req.valid("param");

    await UserService.delete(id);

    const userResponse = await successResponse({
      message: "User deleted",
    });

    return c.json(userResponse);
  } catch (error) {
    console.error(error);
    return c.json(
      errorResponse({
        errors: "Failed to delete data",
        message: "Failed to delete data",
      })
    );
  }
});

// Delete Users
route.delete("/", async (c) => {
  try {
    await UserService.deleteAll();
  } catch (error) {
    return c.json(
      errorResponse({
        errors: "Failed to delete all users",
        message: "Failed to delete all users",
      })
    );
  }
});

export default route;
