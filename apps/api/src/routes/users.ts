import { Hono } from "hono";
import { getUsers, createUser } from "../db/queries";
import getApp from "../app";

export const usersRoute = getApp();
usersRoute.get("/", async (c) => {
  const users = await getUsers(c.env.DB);
  return c.json(users);
});

usersRoute.post("/", async (c) => {
  const body = await c.req.json();

  const result = await createUser(c.env.DB, {
    email: body.email,
    passwordHash: body.passwordHash,
    role: body.role === undefined ? "candidate" : body.role,
  });

  return c.json({
    message: "User created successfully",
    user: result[0],
  });
});