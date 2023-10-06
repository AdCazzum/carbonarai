# Carbonarai

1. Install dependencies

```bash
cd frontend
npm i
cd ../backend
pip install -r requirements.txt
```

2. Run entire app

```bash
cd backend
uvicorn app.main:app --reload
cd ../frontend
npm run dev
```