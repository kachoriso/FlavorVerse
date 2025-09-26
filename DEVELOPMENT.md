# FlavorVerse 開発ガイド

## ローカル開発環境のセットアップ

### 1. APIキーの設定

1. `env.example` をコピーして `.env` ファイルを作成
2. 実際のAPIキーを設定

```bash
cp env.example .env
```

`.env` ファイルの内容:
```
GEMINI_API_KEY=your_actual_gemini_api_key
GROQ_API_KEY=your_actual_groq_api_key
```

### 2. プロキシサーバーの起動

```bash
python3 proxy-server.py
```

### 3. ローカルサーバーの起動

```bash
# Pythonの簡易サーバーを使用
python3 -m http.server 8000

# または Node.jsのhttp-serverを使用
npx http-server -p 8000
```

### 4. ブラウザでアクセス

```
http://localhost:8000
```

## GitHub Secrets の設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定:

- `GEMINI_API_KEY`: Google Gemini APIキー
- `GROQ_API_KEY`: Groq APIキー
- `AWS_ACCESS_KEY_ID`: AWSアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: AWSシークレットアクセスキー

## デプロイメント

プッシュ時にGitHub Actionsが自動的に:
1. APIキーをシークレットから設定
2. S3にデプロイ
3. CloudFrontキャッシュを無効化

## 注意事項

- `.env` ファイルはGitにコミットしないでください
- APIキーはGitHub Secretsで管理してください
- 本番環境では環境変数からAPIキーを読み取ります
