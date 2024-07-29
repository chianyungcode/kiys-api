import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import auth from "./routes/auth";
import categories from "./routes/categories";
import products from "./routes/products";

const app = new Hono();

app.use(logger());
app.use(
  "api/*",
  cors({
    origin: ["http://localhost:5173", "https://kiys.chianyung.dev"],
    allowHeaders: ["Content-Type", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "PUT", "DELETE"],
    exposeHeaders: ["Content-Type", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({
    endpoint: {
      docs: "https://apidog.com/apidoc/shared-e07763a2-ce23-4c65-84bf-21a23da59f53",
    },
  });
});

app.route("/api/auth", auth);
app.route("api/categories", categories);
app.route("api/products", products);

export default {
  port: process.env.APP_PORT || "3000",
  fetch: app.fetch,
};
