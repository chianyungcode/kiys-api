import { Hono } from "hono";
import { logger } from "hono/logger";

import auth from "./routes/auth";
import categories from "./routes/categories";
import products from "./routes/products";

const app = new Hono().basePath("/api");
app.use(logger());

app.get("/", (c) => {
  console.log(process.env.DATABASE_URL);

  return c.text("Hello Hono! ");
});

app.route("/auth", auth);
app.route("/categories", categories);
app.route("/products", products);

export default {
  port: process.env.APP_PORT || "3000",
  fetch: app.fetch,
};
