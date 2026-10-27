FROM python:3.13-slim

WORKDIR /backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /backend/fastapi

EXPOSE 8000

CMD ["uvicorn","cube_api:app","--host","0.0.0.0","--port","8000"]