// import getApp from './app'

// const app = getApp();

// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })

// export default app

import getApp from "./app";

import { usersRoute } from "./routes/users";
import { candidatesRoute } from "./routes/candidates";
import { jobsRoute } from "./routes/jobs";

const app = getApp();

app.get("/", (c) => {
  return c.text("Skill Bridge backend is running!");
});

app.route("/users", usersRoute);
app.route("/candidates", candidatesRoute);
app.route("/jobs", jobsRoute);

export default app;
