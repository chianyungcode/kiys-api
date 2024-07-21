import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import auth from "./routes/auth";
import categories from "./routes/categories";
import products from "./routes/products";

const app = new Hono().basePath("/api");
app.use(logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

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
