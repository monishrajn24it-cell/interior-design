from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
import json

from ml.vision import analyze_room, analyze_room_mock
from ml.generation import generate_designs
from ml.layout_csp import optimize_layout_mock
from ml.budget_regression import predict_budget_mock

router = APIRouter()

# In a real app we'd use a database. We'll use memory for now to hold state across endpoints.
session_data = {}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        session_id = f"session_{len(session_data)}"
        session_data[session_id] = {"image": contents}
        return {"status": "success", "session_id": session_id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-room")
async def analyze_room_endpoint(session_id: str = Form(...)):
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    image_data = session_data[session_id]["image"]
    # Use the real ML analyzer (which uses the Kaggle model logic)
    result = await analyze_room(image_data)
    
    session_data[session_id]["analysis"] = result
    return result

@router.post("/generate-designs")
async def generate_designs_endpoint(
    session_id: str = Form(...), 
    style: str = Form("modern"), 
    prompt: Optional[str] = Form(None),
    intensity: int = Form(50)
):
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    image_data = session_data[session_id]["image"]
    # Generate 3 variations to save time
    designs = await generate_designs(image_data, style, prompt, intensity, num_variations=3)
    
    session_data[session_id]["designs"] = designs
    return {"status": "success", "count": len(designs), "designs": designs}

@router.post("/optimize-layout")
async def optimize_layout(session_id: str = Form(...)):
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    analysis = session_data[session_id].get("analysis", {})
    layout = await optimize_layout_mock(analysis)
    
    session_data[session_id]["layout"] = layout
    return layout

@router.post("/predict-budget")
async def predict_budget(session_id: str = Form(...), style: str = Form("modern")):
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    analysis = session_data[session_id].get("analysis", {})
    room_features = analysis.get("room_features", {})
    area_sqft = room_features.get("area_estimate_sqft", 150)
    
    budget = await predict_budget_mock({"style": style, "area_sqft": area_sqft})
    
    session_data[session_id]["budget"] = budget
    return budget

@router.get("/get-results/{session_id}")
async def get_results(session_id: str):
    if session_id not in session_data:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return {
        "analysis": session_data[session_id].get("analysis"),
        "designs": session_data[session_id].get("designs"),
        "layout": session_data[session_id].get("layout"),
        "budget": session_data[session_id].get("budget")
    }
