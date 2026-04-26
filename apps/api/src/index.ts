import getApp from "./app";
import { cors } from "hono/cors";

import { usersRoute } from "./routes/users";
import { candidatesRoute } from "./routes/candidates";
import { jobsRoute } from "./routes/jobs";

const app = getApp();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

app.get("/", (c) => {
  return c.text("Skill Bridge backend is running!");
});

app.route("/users", usersRoute);
app.route("/candidates", candidatesRoute);
app.route("/jobs", jobsRoute);

export default app;
