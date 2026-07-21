import os
import glob

frontend_dir = r"d:\New folder\RAG Python\frontend\src"

python_backend = "https://ai-pdf-assistant-backend-vasqdq-11c032-35-180-95-158.sslip.io"
golang_backend = "https://ai-pdf-assistant-authservicego-kkuhec-86a036-35-180-95-158.sslip.io"

old_python_fallback = '"http://localhost:8000"'
old_golang_fallback = '"http://localhost:8002"'

new_python_fallback = f'"{python_backend}"'
new_golang_fallback = f'"{golang_backend}"'

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(".tsx"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            modified = False
            if 'process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"' in content:
                content = content.replace('process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"', 
                                          f'process.env.NEXT_PUBLIC_API_URL || {new_python_fallback}')
                modified = True
            
            if 'process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8002"' in content:
                content = content.replace('process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8002"', 
                                          f'process.env.NEXT_PUBLIC_AUTH_URL || {new_golang_fallback}')
                modified = True
                
            if modified:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {file_path}")
