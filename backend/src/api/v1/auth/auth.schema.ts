export type LoginInput = {
  login: string;
  password: string;
};

export function validateLogin(data: any): LoginInput {
  const login = data?.login ?? data?.email;

  if (!login || !data?.password) {
    throw new Error("Login and password are required");
  }

  return {
    login: String(login).trim(),
    password: data.password,
  };
}
