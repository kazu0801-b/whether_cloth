"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setMessage("ログアウトしました。");
    router.push("/login");
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