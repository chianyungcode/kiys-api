import { z } from "zod";

export namespace UserValidation {
  export const register = z
    .object({
      firstName: z.string().min(1, { message: "Minimum 1 character" }),
      lastName: z.string().min(1, { message: "Minimum 1 character" }),
      email: z.string().email(),
      password: z
        .string()
        .regex(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:\'",.<>\/?]).{8,}$/,
          {
            message:
              "Password must contain at least one digit number, one lowercase and one uppercase letter, one special character, and be at least 8 characters long",
          }
        ),
      confirmPassword: z.string().min(8),
      address: z.string(),
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: "Password doesn't match",
        path: ["confirmPassword"],
      }
    );

  // TODO(refactor) : Harusnya disini bisa referensikan dari UserValidation.register kemudian di omit property yang tidak perlu
  export const update = z.object({
    firstName: z.string().min(1, { message: "Minimum 1 character" }),
    lastName: z.string().min(1, { message: "Minimum 1 character" }),
    address: z.string().min(1),
  });

  export const login = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  export const queryParam = z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
  });

  export const paramId = z.object({
    id: z.string().uuid(),
  });
}
