# 天気に応じた服装提案アプリ

現在地の天気情報を取得し、気温に基づいて服装を提案するWebアプリケーションです。

## 機能

- 位置情報の取得
- OpenWeatherMap APIを使用した天気情報の取得
- 気温に基づく服装提案
- レスポンシブデザイン（モバイル対応）

## セットアップ

1. プロジェクトのセットアップ:
```bash
cd weather_cloth
npm install
```

2. OpenWeatherMap APIキーの設定:
   - [OpenWeatherMap](https://openweathermap.org/api)で無料アカウントを作成
   - APIキーを取得
   - `.env.example`を`.env.local`にコピー: `cp .env.example .env.local`
   - `.env.local`ファイルの`your_api_key_here`を実際のAPIキーに置き換え

3. 開発サーバーの起動:
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 にアクセス

## 使用技術

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイル**: Tailwind CSS
- **API**: OpenWeatherMap API
- **位置情報**: Geolocation API

## 服装提案ロジック

- 5℃未満: ダウンジャケットとマフラー
- 5℃以上15℃未満: コート
- 15℃以上25℃未満: 長袖シャツ
- 25℃以上: 半袖Tシャツ

## 今後の拡張予定

- 湿度や天気を考慮したより詳細な提案
- ユーザー設定（性別・年齢）によるパーソナライズ
- 服装のビジュアル表示
- PWA対応
