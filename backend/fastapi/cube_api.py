import sys
from pathlib import Path
import os
current_dir=Path(__file__).resolve()
sys.path.append(os.path.join(current_dir.parents[1],'eval/model'))
from fastapi import FastAPI,File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

from predict import predict_state # Prediction with model loading module

# API app init
app=FastAPI()

# Add the CORS middleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Endpoint to get the predicted state of the uploaded image
@app.post("/push")
async def image_push(img:bytes=File(...)):
    frame=cv2.imdecode(np.frombuffer(img,np.uint8),cv2.IMREAD_COLOR)
    
    state,confidence=predict_state(frame)
    return JSONResponse(content={'message':'State Prediction','state':state,'confidence':confidence},status_code=200)
