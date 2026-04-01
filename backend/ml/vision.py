import asyncio
import base64
from typing import Dict, Any
from .classification import classifier

async def analyze_room(image_data: bytes) -> Dict[str, Any]:
    # 1. Perform object detection (currently mock)
    await asyncio.sleep(0.5) 
    objects = [
        {"label": "wall", "confidence": 0.95, "bbox": [0, 0, 500, 300]},
        {"label": "window", "confidence": 0.88, "bbox": [200, 50, 300, 150]},
        {"label": "floor", "confidence": 0.99, "bbox": [0, 300, 500, 500]}
    ]

    # 2. Perform style classification (using real logic from Kaggle notebook)
    style_result = await classifier.predict_style(image_data)
    
    return {
        "status": "success",
        "objects_detected": objects,
        "room_features": {
            "style": style_result.get("style", "neutral"),
            "confidence": style_result.get("confidence", 0.0),
            "is_real_ai": not style_result.get("is_mock", False),
            "lighting": "bright",
            "area_estimate_sqft": 150.5
        }
    }

async def analyze_room_mock(image_data: bytes) -> Dict[str, Any]:
    # Keep the legacy mock for backward compatibility during testing
    await asyncio.sleep(1.0)
    return {
        "status": "success",
        "objects_detected": [
            {"label": "wall", "confidence": 0.95, "bbox": [0, 0, 500, 300]},
        ],
        "room_features": {
            "style": "neutral",
            "lighting": "bright",
            "area_estimate_sqft": 150.5
        }
    }
