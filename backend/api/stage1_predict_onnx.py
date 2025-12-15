import onnxruntime as ort
import numpy as np
from fastapi import UploadFile
from pathlib import Path
from .utils import preprocess_image_for_onnx
import torch

# -------------------------------------------------------
# Paths
# -------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

CKPT = BASE_DIR / "models" / "stage1_cattle_best.pth"
ONNX_PATH = BASE_DIR / "models" / "stage1_cattle.onnx"

if not CKPT.exists():
    raise FileNotFoundError(f"Stage-1 checkpoint not found at: {CKPT}")

if not ONNX_PATH.exists():
    raise FileNotFoundError(f"Stage-1 ONNX model not found at: {ONNX_PATH}")

# -------------------------------------------------------
# Load metadata
# -------------------------------------------------------
ckpt = torch.load(CKPT, map_location="cpu")

# 🔴 MUST MATCH TRAINING FOLDER ORDER
CLASS_NAMES = ckpt.get(
    "class_names",
    ["buffalo", "cow", "none"]
)

IMG_SIZE = int(ckpt.get("img_size", 224))

# -------------------------------------------------------
# ONNX session
# -------------------------------------------------------
session = ort.InferenceSession(
    ONNX_PATH.as_posix(),
    providers=["CPUExecutionProvider"]
)

def softmax(x: np.ndarray):
    e = np.exp(x - np.max(x))
    return e / e.sum()

# -------------------------------------------------------
# Prediction
# -------------------------------------------------------
async def predict_stage1_onnx(file: UploadFile):
    image_bytes = await file.read()

    x = preprocess_image_for_onnx(image_bytes, IMG_SIZE)

    inputs = {session.get_inputs()[0].name: x}
    outputs = session.run(None, inputs)

    logits = outputs[0][0]       # shape: (3,)
    probs = softmax(logits)

    idx = int(np.argmax(probs))

    predicted_class = CLASS_NAMES[idx]
    confidence = float(probs[idx])

    print("Stage1 logits:", logits)
    print("Stage1 probs:", probs)
    print("Stage1 class:", predicted_class)

    return {
        "class": predicted_class,
        "confidence": confidence
    }
