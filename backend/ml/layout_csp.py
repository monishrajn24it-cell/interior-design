import asyncio
import numpy as np
from typing import Dict, Any, List

async def optimize_layout_mock(room_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates a Constraint Satisfaction Problem (CSP) solver.
    Heuristically places furniture based on room style and area.
    """
    await asyncio.sleep(0.8)
    
    features = room_data.get("room_features", {})
    style = features.get("style", "modern").lower()
    area = features.get("area_estimate_sqft", 150)
    
    # Heuristic item selection based on style
    if style == "minimalist":
        items_to_place = ["sofa", "coffee_table", "floor_lamp"]
    elif style == "luxury":
        items_to_place = ["sofa", "armchair", "coffee_table", "chandelier", "rug", "side_table"]
    else:
        items_to_place = ["sofa", "coffee_table", "tv_stand", "rug"]
        
    optimized_items = []
    # Simple placement logic: distribute items in a grid based on area
    grid_size = int(np.sqrt(area * 100)) # Scale for visualization
    
    for i, item_type in enumerate(items_to_place):
        # Deterministic but style-aware placement
        optimized_items.append({
            "type": item_type,
            "x": 50 + (i * 80) % (grid_size - 100),
            "y": 100 + (i * 60) % (grid_size - 150),
            "width": 120 if "sofa" in item_type else 60,
            "height": 60 if "sofa" in item_type else 40,
            "rotation": 0 if i % 2 == 0 else 90
        })
    
    return {
        "status": "success",
        "optimization_score": round(0.88 + (0.1 * (len(optimized_items) / 10)), 2),
        "grid_size": {"width": grid_size, "height": grid_size},
        "items": optimized_items,
        "constraints_applied": ["min_clearance", "wall_alignment", "natural_light_access"]
    }
