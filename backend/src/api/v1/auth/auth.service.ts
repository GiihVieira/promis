import type { D1Database } from "@cloudflare/workers-types";
import { verifyPassword } from "../../../shared/crypto";
const SESSION_EXPIRATION = 60 * 60 * 8; // 8h

export async function authenticateUser(
  db: D1Database,
  login: string,
  password: string,
  _jwtSecret?: string
) {
  const user = await db
    .prepare(
      `
      SELECT *
      FROM users
      WHERE (LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?)) AND is_active = 1
      LIMIT 1
    `
    )
    .bind(login, login)
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

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function createSession(
  db: D1Database,
  userId: string
) {
  const id = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = new Date(
    now + SESSION_EXPIRATION * 1000
  ).toISOString();

  await db
    .prepare(
      `
      INSERT INTO sessions (
        id,
        user_id,
        created_at,
        expires_at
      ) VALUES (?, ?, ?, ?)
    `
    )
    .bind(id, userId, new Date(now).toISOString(), expiresAt)
    .run();

  return {
    id,
    expiresAt,
    maxAgeSeconds: SESSION_EXPIRATION,
  };
}

export async function revokeSession(
  db: D1Database,
  sessionId: string
) {
  await db
    .prepare(
      `
      UPDATE sessions
      SET revoked_at = ?
      WHERE id = ?
    `
    )
    .bind(new Date().toISOString(), sessionId)
    .run();
}
