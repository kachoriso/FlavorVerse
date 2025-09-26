#!/bin/bash

# FlavorVerse プロキシサーバー起動スクリプト
# 環境変数を読み込んでプロキシサーバーを起動

echo "🚀 FlavorVerse プロキシサーバーを起動中..."

# .envファイルが存在する場合は読み込み
if [ -f .env ]; then
    echo "📄 .envファイルから環境変数を読み込み中..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  .envファイルが見つかりません。env.exampleをコピーして設定してください。"
    echo "   cp env.example .env"
    echo "   その後、.envファイルに実際のAPIキーを設定してください。"
fi

# 環境変数の確認
echo "🔑 設定された環境変数:"
echo "   GROQ_API_KEY: ${GROQ_API_KEY:0:10}..."
echo "   COHERE_API_KEY: ${COHERE_API_KEY:0:10}..."

# プロキシサーバーを起動
echo "🌐 プロキシサーバーを起動中..."
python3 proxy-server.py
