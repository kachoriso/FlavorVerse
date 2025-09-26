#!/usr/bin/env python3
"""
FlavorVerse CORS Proxy Server
AI APIへのCORS問題を解決するためのプロキシサーバー
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.parse
from urllib.error import HTTPError
import os
from http import HTTPStatus

class CORSProxyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS ヘッダーを追加
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        # プリフライトリクエストに対応
        self.send_response(HTTPStatus.OK)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            # ヘルスチェックエンドポイント
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok", "message": "Proxy server is running"}).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            super().do_POST()

    def handle_api_request(self):
        try:
            # リクエストボディを読み取り
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # APIプロバイダーを判定
            if self.path == '/api/gemini':
                response = self.call_gemini_api(request_data)
            elif self.path == '/api/groq':
                response = self.call_groq_api(request_data)
            elif self.path == '/api/cohere':
                response = self.call_cohere_api(request_data)
            else:
                self.send_error(404, "API endpoint not found")
                return
            
            # レスポンスを送信
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            print(f"API Error: {e}")
            self.send_error(500, f"API Error: {str(e)}")


    def call_gemini_api(self, request_data):
        # APIキーはソースコード管理
        api_key = 'AIzaSyCEGUEEDxUZC2-qO0BpOiK4iiYbpYhA0mc'
        prompt = request_data.get('prompt')
        
        if not prompt:
            raise ValueError("Prompt is required")
        
        # Google Gemini API呼び出し（最新のエンドポイント）
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {
            'Content-Type': 'application/json'
        }
        
        data = {
            "contents": [{
                "parts": [{
                    "text": f"""あなたは日本のワイン専門家です。以下のワインについて、美しく詩的な日本語でテイスティングノートを書いてください。

ワインの特徴: {prompt}

条件:
- 必ず日本語で回答してください
- 200文字程度で簡潔にまとめてください
- ワイン専門用語を使用してください
- エレガントで詩的な表現を心がけてください
- 「このワインは」から始めてください

テイスティングノート:"""
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 300,
                "topP": 0.8,
                "topK": 40
            }
        }
        
        req = urllib.request.Request(url,
                                   data=json.dumps(data).encode('utf-8'),
                                   headers=headers)
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'candidates' in result and len(result['candidates']) > 0:
                content = result['candidates'][0]['content']['parts'][0]['text'].strip()
                # 「このワインは」で始まるように調整
                if not content.startswith('このワインは'):
                    content = f"このワインは{content}"
                return {
                    "content": content,
                    "provider": "Google Gemini"
                }
            else:
                raise Exception("No candidates in Gemini response")

    def call_groq_api(self, request_data):
        # Groq APIキー（環境変数から取得）
        api_key = os.getenv('GROQ_API_KEY', 'YOUR_GROQ_API_KEY')
        prompt = request_data.get('prompt')
        
        if not prompt:
            raise ValueError("Prompt is required")
        
        # Groq API呼び出し
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        data = {
            "model": "llama-3.1-8b-instant",  # より軽量で利用可能なモデル
            "messages": [
                {
                    "role": "system",
                    "content": "You are a Japanese wine expert. Write elegant and poetic wine tasting notes in Japanese. Always respond in Japanese only."
                },
                {
                    "role": "user",
                    "content": f"Write a Japanese wine tasting note (about 200 characters) starting with 'このワインは' for a wine with these characteristics: {prompt}. Use elegant and poetic Japanese expressions."
                }
            ],
            "max_tokens": 300,
            "temperature": 0.7,
            "top_p": 0.9
        }
        
        req = urllib.request.Request(url,
                                   data=json.dumps(data).encode('utf-8'),
                                   headers=headers)
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
        except HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"Groq API Error {e.code}: {error_body}")
            raise Exception(f"Groq API Error {e.code}: {error_body}")
            
        if 'choices' in result and len(result['choices']) > 0:
            content = result['choices'][0]['message']['content'].strip()
            
            # 「このワインは」で始まるように調整
            if not content.startswith('このワインは'):
                content = f"このワインは{content}"
            
            return {
                "content": content,
                "provider": "Groq AI"
            }
        else:
            raise Exception("No choices in Groq response")

    def call_cohere_api(self, request_data):
        # Cohere APIキー（環境変数から取得）
        api_key = os.getenv('COHERE_API_KEY', 'YOUR_COHERE_API_KEY')
        prompt = request_data.get('prompt')
        
        if not prompt:
            raise ValueError("Prompt is required")
        
        # Cohere API呼び出し
        url = "https://api.cohere.ai/v1/generate"
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            "model": "command-light",  # 無料プランで使用可能
            "prompt": f"""Please respond ONLY in Japanese. You are a Japanese wine expert.

{prompt}

上記のワインについて、日本語でエレガントなテイスティングノートを200文字程度で書いてください。必ず日本語のみで回答してください。

テイスティングノート: このワインは""",
            "max_tokens": 200,
            "temperature": 0.7,
            "k": 0,
            "stop_sequences": ["English", "english", "In English"],
            "return_likelihoods": "NONE"
        }
        
        req = urllib.request.Request(url,
                                   data=json.dumps(data).encode('utf-8'),
                                   headers=headers)
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if 'generations' in result and len(result['generations']) > 0:
                content = result['generations'][0]['text'].strip()
                # 「このワインは」で始まるように調整
                if not content.startswith('このワインは'):
                    content = f"このワインは{content}"
                return {
                    "content": content,
                    "provider": "Cohere AI"
                }
            else:
                raise Exception("No generations in Cohere response")

def run_server(port=8003):
    handler = CORSProxyHandler
    # IPv6とIPv4の両方でリッスンするように設定
    httpd = socketserver.TCPServer(("0.0.0.0", port), handler)
    print(f"🚀 FlavorVerse CORS Proxy Server running on http://localhost:{port}")
    print(f"🌐 Server listening on 0.0.0.0:{port} (IPv4)")
    print("📡 AI API calls will be proxied through this server")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
