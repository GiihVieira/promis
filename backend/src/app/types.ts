import type { D1Database } from "@cloudflare/workers-types";

export type JwtUser = {
  sub: string;
  email: string;
  role: "admin" | "user";
};

export type Bindings = {
  DB: D1Database;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  JWT_SECRET: string;
};

export type Variables = {
  user: JwtUser;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
