export type Bindings = {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  DB: D1Database;
  JWT_SECRET: string;
};

export type AppEnv = {
  Bindings: Bindings;
};
