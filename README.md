# 天気に応じた服装提案アプリ（weather_cloth）

現在地（位置情報）または都市名から天気を取得し、気温・湿度・風速・天気（雨/雪/晴れ）をまとめて判断して服装を提案するWebアプリです。  
「何を着ればいいか迷う」を減らすために、基本の服装に加えて雨対策や体感面の注意も表示します。

---

## 主な機能

- 現在地の天気取得（Geolocation API）
- 都市名検索（日本語/英語に対応）
  - 例：`東京` / `Tokyo` / `杉並区` / `川崎市` / `埼玉県`
- 服装提案（カテゴリ別）
  - 基本アイテム / アウター / 履物 / 小物
  - 気温（7段階）をベースに湿度・風速・天気で調整
- 時間帯別（朝/昼/夜）のアドバイス
- 降水確率の表示（予報データから現在に近い値を表示）
- 位置情報エラー時の案内（権限拒否・HTTPS など）

---

## 技術スタック

- Next.js（App Router）
- React / TypeScript
- Chakra UI
- OpenWeatherMap API（現在天気 + 予報）
- Geolocation API

---

## セットアップ

### 1) インストール

````bash
git clone <repository-url>
cd weather_cloth
npm install

### 2) フロントエンドを起動

```bash
npm run dev
````

起動後、ブラウザで以下にアクセスします。

```text
http://localhost:3000
```

---

## Goバックエンド連携について

このアプリの認証機能は、別リポジトリの Go バックエンドと連携しています。

フロントエンドだけを起動している場合、ログイン・新規登録などの認証機能は動作しません。

認証機能を使う場合は、別ターミナルで Go バックエンドも起動してください。

### Goバックエンドの起動

```bash
cd /Users/apple/Documents/weather-outfit-portfolio/backend
go run cmd/api/main.go
```

起動できると、以下のように表示されます。

```text
database connected
server is running on :8080
```

---

## 認証機能の確認手順

### 1) 新規登録

ブラウザで以下にアクセスします。

```text
http://localhost:3000/signup
```

入力例：

```text
ユーザー名: testuser
メールアドレス: frontend-test@example.com
パスワード: abc12345
```

成功すると、ユーザーが作成されます。

すでに登録済みのメールアドレスを使った場合は、以下のようなエラーになります。

```text
email already exists
```

### 2) ログイン

ブラウザで以下にアクセスします。

```text
http://localhost:3000/login
```

登録済みのメールアドレスとパスワードを入力します。

成功すると、JWTトークンがブラウザの `localStorage` に保存され、自動で `/me` に移動します。

### 3) マイページ確認

```text
http://localhost:3000/me
```

ログイン済みの場合、保存済みJWTトークンを使ってGoバックエンドの `/me` を呼び出し、ログイン中ユーザー情報を表示します。

表示例：

```text
ID: 7 / Email: frontend-test2@example.com
```

### 4) ログアウト

```text
http://localhost:3000/logout
```

ログアウトすると、`localStorage` に保存されている `authToken` が削除され、ログイン画面へ移動します。

---

## よくあるエラー

### Failed to fetch

ログインや新規登録で `Failed to fetch` が表示される場合、Goバックエンドが起動していない可能性があります。

以下を確認してください。

```bash
cd /Users/apple/Documents/weather-outfit-portfolio/backend
go run cmd/api/main.go
```

Goバックエンドが起動しているか確認するには、別ターミナルで以下を実行します。

```bash
curl http://localhost:8080/me
```

以下が返れば、Goバックエンドは起動しています。

```text
authorization header required
```

この表示は、`/me` にJWTトークンを付けていないために出るもので、Goバックエンドが反応している証拠です。

---

## 認証関連ページ

| パス      | 内容                   |
| --------- | ---------------------- |
| `/signup` | 新規登録               |
| `/login`  | ログイン               |
| `/me`     | ログイン中ユーザー確認 |
| `/logout` | ログアウト             |

---

## 補足

ローカル開発では、フロントエンドは以下で起動します。

```text
http://localhost:3000
```

Goバックエンドは以下で起動します。

```text
http://localhost:8080
```

そのため、認証機能を確認する場合は、フロントエンドとGoバックエンドの両方を起動してください。
