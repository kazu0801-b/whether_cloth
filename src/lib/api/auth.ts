const API_BASE_URL = "http://localhost:8080";

export type SignupInput = {
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function signup(input: SignupInput): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "signup failed");
  }

  return text;
}

export async function login(input: LoginInput): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "login failed");
  }

  return text;
}

export async function getMe(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "failed to fetch me");
  }

  return text;
}