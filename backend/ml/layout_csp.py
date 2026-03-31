import asyncio
from typing import Dict, Any, List

async def optimize_layout_mock(room_data: Dict[str, Any]) -> Dict[str, Any]:
    # Simulate constraint satisfaction problem (CSP) optimization
    await asyncio.sleep(1.0)
    
    optimized_items = [
        {"type": "sofa", "x": 100, "y": 150, "width": 200, "height": 80, "rotation": 0},
        {"type": "coffee_table", "x": 140, "y": 250, "width": 120, "height": 60, "rotation": 0},
        {"type": "tv_stand", "x": 100, "y": 50, "width": 200, "height": 40, "rotation": 0},
        {"type": "rug", "x": 80, "y": 130, "width": 240, "height": 200, "rotation": 0}
    ]
    
    return {
        "status": "success",
        "optimization_score": 0.92,
        "grid_size": {"width": 500, "height": 500},
        "items": optimized_items
    }
