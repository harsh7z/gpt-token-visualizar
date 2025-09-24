from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tiktoken

app = FastAPI()

# Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust if deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str
    model: str = "gpt-4o-mini"

@app.post("/tokenize")
def tokenize(req: TextRequest):
    enc = tiktoken.encoding_for_model(req.model) or tiktoken.get_encoding("cl100k_base")
    ids = enc.encode(req.text)
    tokens = [enc.decode([tid]) for tid in ids]
    return {"count": len(ids), "ids": ids, "tokens": tokens}
