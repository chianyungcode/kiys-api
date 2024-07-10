import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware";

const route = new Hono();
route.use(authMiddleware);

route.get("/", (c) => {
  return c.json({ message: "Ini adalah rute terproteksi" });
});

export default route;
