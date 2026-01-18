export type UserRole = "admin" | "user";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  cro?: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  cro?: string;
};

/**
 * Validate and normalize payload for user creation.
 */
export function validateCreateUser(data: any): CreateUserInput {
  if (
    !data ||
    typeof data.name !== "string" ||
    typeof data.email !== "string" ||
    typeof data.password !== "string"
  ) {
    throw new Error("Invalid payload");
  }

  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: data.role === "admin" ? "admin" : "user",
    cro:
      typeof data.cro === "string" && data.cro.trim()
        ? data.cro.trim()
        : undefined,
  };
}

/**
 * Validate and normalize payload for user update.
 */
export function validateUpdateUser(data: any): UpdateUserInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payload");
  }

  const payload: UpdateUserInput = {};

  if (typeof data.name === "string") {
    payload.name = data.name.trim();
  }

  if (typeof data.email === "string") {
    payload.email = data.email.trim().toLowerCase();
  }

  if (typeof data.password === "string") {
    payload.password = data.password;
  }

  if (data.role === "admin" || data.role === "user") {
    payload.role = data.role;
  }

  if (typeof data.cro === "string") {
    payload.cro = data.cro.trim() || undefined;
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("No valid fields to update");
  }

  return payload;
}
