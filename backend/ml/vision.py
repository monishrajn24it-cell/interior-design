import asyncio
import base64
from typing import Dict, Any

async def analyze_room_mock(image_data: bytes) -> Dict[str, Any]:
    # Simulate processing time for CNN feature extraction and object detection
    await asyncio.sleep(1.5)
    return {
        "status": "success",
        "objects_detected": [
            {"label": "wall", "confidence": 0.95, "bbox": [0, 0, 500, 300]},
            {"label": "window", "confidence": 0.88, "bbox": [200, 50, 300, 150]},
            {"label": "floor", "confidence": 0.99, "bbox": [0, 300, 500, 500]}
        ],
        "room_features": {
            "style": "neutral",
            "lighting": "bright",
            "area_estimate_sqft": 150.5
        }
    }
