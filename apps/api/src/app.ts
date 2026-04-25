import { Hono } from "hono";
import { Environment } from "./bindings";

export default function getApp() {
    return new Hono<Environment>();
}