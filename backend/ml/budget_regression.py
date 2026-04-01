import asyncio
from typing import Dict, Any

async def predict_budget_mock(design_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates a regression model for budget prediction.
    Calculates estimated cost based on style and estimated room area.
    """
    await asyncio.sleep(0.4)
    
    style = design_data.get("style", "modern").lower()
    # Assume 150 sqft if not provided (should be passed from session analysis ideally)
    area = design_data.get("area_sqft", 150) 
    
    # Base rates per square foot
    rates = {
        "modern": 25,
        "minimalist": 18,
        "luxury": 65,
        "industrial": 22,
        "scandinavian": 20
    }
    
    base_rate = rates.get(style, 22)
    estimated_cost = base_rate * area
    
    # Components breakdown
    breakdown = {
        "furniture": int(estimated_cost * 0.5),
        "labor": int(estimated_cost * 0.2),
        "materials": int(estimated_cost * 0.3)
    }
    
    return {
        "status": "success",
        "estimated_total_usd": int(estimated_cost),
        "breakdown": breakdown,
        "price_sqft": base_rate,
        "budget_category": "Premium" if estimated_cost > 8000 else ("Mid-Range" if estimated_cost > 3000 else "Budget"),
        "confidence": 0.89
    }
