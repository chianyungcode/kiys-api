import { type User } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { UserValidation } from "../validation/user-validation";
import { z } from "zod";
import { argon2id } from "../lib/oslo";

export class UserService {
  static async register(user: z.infer<typeof UserValidation.register>) {
    const hashedPassword = await argon2id.hash(user.password);

    const newUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        address: user.address,
      },
    });

    return newUser;
  }

  static async update(
    id: string,
    updatedUser: z.infer<typeof UserValidation.update>
  ) {
    const { firstName, lastName, address } = updatedUser;

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        address,
      },
    });

    return user;
  }

  static async delete(id: string) {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  static async deleteAll() {
    await prisma.user.deleteMany();
  }
  static async findUserByEmail(email: string) {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return userExists;
  }

  static async getAllUsers(
    pagination: z.infer<typeof UserValidation.queryParam>
  ) {
    const users = await prisma.user.findMany({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  }

  static async getUser(id: string) {
    const user = prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  static async getUsersCount() {
    const users = await prisma.user.count();

    return users;
  }
}
