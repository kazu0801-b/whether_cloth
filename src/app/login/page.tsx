"use client";

import { useState } from "react";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const result = await login({
        email,
        password,
      });

      setMessage(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("login failed");
      }
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>ログイン</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>パスワード</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: 16 }}>
          ログインする
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
