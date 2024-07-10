import { Hono } from "hono";
import { logger } from "hono/logger";
import users from "./routes/users";
import products from "./routes/products";
const app = new Hono().basePath("/api");
app.use(logger());

app.get("/", (c) => {
  console.log(process.env.DATABASE_URL);

  return c.text("Hello Hono! ");
});

app.route("/auth", users);
app.route("/protected", products);

export default {
  port: process.env.APP_PORT || "3000",
  fetch: app.fetch,
};
