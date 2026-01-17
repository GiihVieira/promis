import type { D1Database } from "@cloudflare/workers-types";
import { verifyPassword } from "../../../shared/crypto";
import { signJWT } from "../../../shared/jwt";

const JWT_EXPIRATION = 60 * 60 * 8; // 8h

export async function authenticateUser(
  db: D1Database,
  email: string,
  password: string,
  jwtSecret: string
) {
  const user = await db
    .prepare(
      `
      SELECT *
      FROM users
      WHERE email = ? AND is_active = 1
      LIMIT 1
    `
    )
    .bind(email)
    .first<any>();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await verifyPassword(
    password,
    user.id, // usamos id como salt
    user.password_hash
  );

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = await signJWT(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    JWT_EXPIRATION
  );


  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
