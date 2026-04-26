import { Env } from "hono";

type Environment = Env & {
    Bindings: {
        DB: D1Database;
        USAJOBS_API_KEY: string;
        USAJOBS_EMAIL: string;
    };
};
