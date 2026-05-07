"use client";

import { useState } from "react";

export default function LogoutPage() {
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setMessage("ログアウトしました。");
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>ログアウト</h1>

      <p>保存されているログイントークンを削除します。</p>

      <button onClick={handleLogout}>ログアウトする</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
    </main>
  );
}