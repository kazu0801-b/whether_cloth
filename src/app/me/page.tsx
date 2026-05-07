"use client";

import { useState } from "react";
import { getMe } from "@/lib/api/auth";

export default function MePage() {
  const [userInfo, setUserInfo] = useState("");
  const [error, setError] = useState("");

  const handleGetMe = async () => {
    setUserInfo("");
    setError("");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("ログイン情報がありません。先にログインしてください。");
      return;
    }

    try {
      const result = await getMe(token);

      setUserInfo(`ID: ${result.id} / Email: ${result.email}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("failed to fetch me");
      }
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>ログイン中ユーザー確認</h1>

      <p>保存したJWTトークンを使って、Goバックエンドの /me を呼び出します。</p>

      <button onClick={handleGetMe}>ログイン中ユーザーを確認する</button>

      {userInfo && <p style={{ color: "green" }}>{userInfo}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}