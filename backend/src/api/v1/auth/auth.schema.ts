export type LoginInput = {
  email: string;
  password: string;
};

export function validateLogin(data: any): LoginInput {
  if (!data?.email || !data?.password) {
    throw new Error("Email and password are required");
  }

  return {
    email: data.email,
    password: data.password,
  };
}
