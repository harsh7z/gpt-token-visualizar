# GPT Token Visualizer

A small project that visualizes GPT tokenization and token usage across prompts and responses. The repository contains a Next.js frontend and a lightweight Python backend used to analyze and serve tokenization information.

**Repository layout**
- `frontend/` — Next.js 15 app that provides the UI and visualization.
- `backend/` — Python FastAPI backend that uses OpenAI's `tiktoken` tokenizer for tokenization.

## Features
- Visualize tokenization for prompts and model outputs
- Simple API for sending text to the backend for token analysis
- Ready to run locally and deploy (frontend deploys to Vercel, backend can run on any Python host)

## Requirements
- Node.js (recommended 18+)
- npm
- Python 3.10+ (for the backend)
- uv (for the backend)

## Frontend (Next.js)

Quick start

1. Change into the `frontend` directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Available scripts (from `frontend/package.json`)

- `dev` — starts Next.js in development mode (`next dev --turbopack`)
- `build` — builds the production bundle (`next build --turbopack`)
- `start` — runs the production server (`next start`)
- `lint` — runs `eslint`

Notes
- The frontend depends on `axios` to call the backend API.
- The included `frontend/README.md` contains the default create-next-app content.

## Backend (Python)

Quick start

1. Change into the `backend` directory:

```bash
cd backend
```

2. Create a virtual environment and install dependencies:

```bash
uv init
uv pip add -r requirements.txt
```

3. Run the backend service:

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Tiktoken / tokenizer notes

The backend uses OpenAI's `tiktoken` tokenizer (via the `tiktoken` Python package) (`tiktoken` is OpenAI’s high-performance Rust-based tokenizer library with Python bindings, providing model-specific byte-pair encoding (BPE) implementations to efficiently convert text to tokens for GPT models) to mirror tokenization behavior used by OpenAI models. The service attempts to select the appropriate encoding with `tiktoken.encoding_for_model(model)` and falls back to the `cl100k_base` encoding when a model-specific encoding isn't available.

API example

```bash
curl -sS -X POST "http://localhost:8000/tokenize" \
	-H "Content-Type: application/json" \
	-d '{"text":"Hello world","model":"gpt-4o-mini"}'
```

Example response (shape):

```json
{
	"count": 2,
	"ids": [15339, 1917],
	"tokens": ["Hello", " world"]
}
```

## Running the full stack locally

1. Start the backend (see steps above).
2. Start the frontend development server.
3. Use the UI to send text to the backend and view tokenization visualizations.
