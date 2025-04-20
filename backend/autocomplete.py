from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import re

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = pipeline("text-generation", model="gpt2")

class Prompt(BaseModel):
    input: str

@app.post("/autocomplete")
def complete_text(prompt: Prompt):
    # Add a space after input so GPT2 treats it like a continuing sentence
    base_input = prompt.input.strip() + " "
    responses = generator(
        base_input,
        max_new_tokens=3,           # slightly more tokens to extract a word cleanly
        num_return_sequences=5,     # multiple outputs
        do_sample=True,             # enable randomness
        top_k=40,
        top_p=0.9,
        temperature=1.0,
    )

    # Extract first word that comes *after* the prompt
    suggestions = []
    for r in responses:
        generated = r["generated_text"].replace(base_input, "").strip()
        word = re.findall(r"\b\w+\b", generated)
        if word:
            suggestions.append(word[0])

    # Deduplicate + fallback
    unique = list(set(suggestions)) or ["password", "access", "login", "code", "secure"]

    return {"suggestions": unique}
