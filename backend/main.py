from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .utils import transcribe_audio, find_best_match, split_tamil_graphemes
import os
import shutil
import whisper

app = FastAPI()

# Enable CORS for React Native frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static folder to serve GIFs and image files
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

# Load Whisper model
model = whisper.load_model("small")

@app.post("/transcribe")
async def transcribe_audio_route(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")  # Debugging
    temp_audio_path = f"temp_{file.filename}"
    with open(temp_audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = transcribe_audio(temp_audio_path, model)
    gif_name, score = find_best_match(text)

    os.remove(temp_audio_path)
    if gif_name:
        return {"match": "gif", "value": gif_name, "transcription": text}
    else:
        letters = split_tamil_graphemes(text)
        return {"match": "letters", "value": letters, "transcription": text}