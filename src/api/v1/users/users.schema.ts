export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "user";
};

export function validateCreateUser(data: any): CreateUserInput {
  if (!data?.name || !data?.email || !data?.password) {
    throw new Error("Invalid payload");
  }

  return {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role === "admin" ? "admin" : "user",
  };
}

export function validateUpdateUser(data: any): UpdateUserInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payload");
  }

  const payload: UpdateUserInput = {};

  if (typeof data.name === "string") payload.name = data.name;
  if (typeof data.email === "string") payload.email = data.email;
  if (typeof data.password === "string") payload.password = data.password;
  if (data.role === "admin" || data.role === "user") payload.role = data.role;

  return payload;
}
