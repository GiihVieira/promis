import type { D1Database } from "@cloudflare/workers-types";
import { hashPassword } from "../../../shared/crypto";

export async function createUser(
  db: D1Database,
  data: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
  }
) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const passwordHash = await hashPassword(data.password, id);

  await db
    .prepare(
      `
      INSERT INTO users (
        id, name, email, password_hash, role, is_active, created_at
      )
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `
    )
    .bind(
      id,
      data.name,
      data.email,
      passwordHash,
      data.role,
      now
    )
    .run();

  return { id };
}

export async function listUsers(db: D1Database) {
  const result = await db
    .prepare(
      `
      SELECT id, name, email, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
    `
    )
    .all();

  return result.results;
}

export async function getUserById(db: D1Database, id: string) {
  return db
    .prepare(
      `
      SELECT id, name, email, role, is_active, created_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `
    )
    .bind(id)
    .first();
}

export async function updateUser(
  db: D1Database,
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
  }
) {
  if (data.password) {
    const passwordHash = await hashPassword(data.password, id);

    await db
      .prepare(
        `
        UPDATE users
        SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          password_hash = ?,
          role = COALESCE(?, role)
        WHERE id = ?
      `
      )
      .bind(
        data.name ?? null,
        data.email ?? null,
        passwordHash,
        data.role ?? null,
        id
      )
      .run();

    return;
  }

  await db
    .prepare(
      `
      UPDATE users
      SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        role = COALESCE(?, role)
      WHERE id = ?
    `
    )
    .bind(
      data.name ?? null,
      data.email ?? null,
      data.role ?? null,
      id
    )
    .run();
}

export async function deactivateUser(db: D1Database, id: string) {
  await db
    .prepare(
      `
      UPDATE users
      SET is_active = 0
      WHERE id = ?
    `
    )
    .bind(id)
    .run();
}

export async function reactivateUser(db: D1Database, id: string) {
  await db
    .prepare(
      `
      UPDATE users
      SET is_active = 1
      WHERE id = ?
    `
    )
    .bind(id)
    .run();
}
