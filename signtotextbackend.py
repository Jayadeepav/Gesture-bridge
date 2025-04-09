import cv2
import torch
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from ultralytics import YOLO
from io import BytesIO
import uvicorn
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load YOLO model
model = YOLO("C:\\Users\\KESAVASUNDARAM\\Desktop\\FinalYear Project\\YOLO_RESULTS\\weights\\best (3).pt")
class_labels = model.names  # Get class names from model

@app.get("/")
def read_root():
    return {"message": "Welcome to the Tamil Sign Detection API!"}

@app.post("/detect/")
async def detect_sign(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        np_img = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        results = model(frame)

        detected_text = ""
        if results and len(results[0].boxes) > 0:
            result = results[0]
            cls_ids = result.boxes.cls.cpu().numpy().astype(int)
            detected_text = "".join([class_labels.get(cls_id, '') for cls_id in cls_ids])
        else:
            detected_text = "No sign detected"  # Explicit message

        print("Detected Text:", detected_text)  # Debugging
        return JSONResponse(content={"detected_text": detected_text})
    
    except Exception as e:
        print("Error:", str(e))  # Debugging
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)