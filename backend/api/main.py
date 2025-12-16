# backend/api/main.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.datastructures import UploadFile as UP
import io

# ONNX inference
from api.stage1_predict_onnx import predict_stage1_onnx
from api.stage2_breed_predict_onnx import predict_breed_onnx

app = FastAPI(
    title="NandiVision Backend API",
    description="API for Indian Cattle Type & Breed Classification",
    version="1.0.0"
)

# CORS (Vercel + browser safe)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "NandiVision backend is running successfully!"}

@app.post("/classify")
async def classify(file: UploadFile = File(...)):

    bytes_data = await file.read()

    # Stage 1: Cow / Buffalo / None
    stage1_file = UP(filename=file.filename, file=io.BytesIO(bytes_data))
    stage1 = await predict_stage1_onnx(stage1_file)

    if stage1["class"] == "none":
        return {
            "type": "none",
            "type_confidence": stage1["confidence"],
            "message": "The uploaded image is not of cattle."
        }

    # Stage 2: Breed classification
    stage2_file = UP(filename=file.filename, file=io.BytesIO(bytes_data))
    breed = await predict_breed_onnx(stage2_file)

    return {
        "type": stage1["class"],
        "type_confidence": stage1["confidence"],
        "breed": breed["breed"],
        "breed_confidence": breed["confidence"]
    }
