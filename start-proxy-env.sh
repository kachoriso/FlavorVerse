#!/bin/bash

# 環境変数を設定
export GEMINI_API_KEY="AIzaSyCEGUEEDxUZC2-qO0BpOiK4iiYbpYhA0mc"
export GROQ_API_KEY="hvLHJgs3tYnRO7Epi3YsZWwaVOoJq8U2LmAiQtxL"

# プロキシサーバーを起動
python3 proxy-server.py
