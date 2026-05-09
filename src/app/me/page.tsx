"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/auth";

export default function MePage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      setUserInfo("");
      setError("");
      setLoading(true);

      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("ログイン情報がありません。ログイン画面へ移動します。");
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const result = await getMe(token);
        setUserInfo(`ID: ${result.id} / Email: ${result.email}`);
      } catch (err) {
        localStorage.removeItem("authToken");

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("failed to fetch me");
        }

        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <h1>ログイン中ユーザー確認</h1>

      <p>保存したJWTトークンを使って、Goバックエンドの /me を呼び出します。</p>

      {loading && <p>確認中です...</p>}
      {userInfo && <p style={{ color: "green" }}>{userInfo}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}