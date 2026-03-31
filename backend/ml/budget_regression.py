import asyncio
from typing import Dict, Any

async def predict_budget_mock(design_data: Dict[str, Any]) -> Dict[str, Any]:
    # Simulate regression model for budget prediction
    await asyncio.sleep(0.5)
    
    style = design_data.get("style", "modern")
    base_cost = 1500
    
    multiplier = 1.0
    if style.lower() == "luxury":
        multiplier = 3.5
    elif style.lower() == "minimalist":
        multiplier = 0.8
        
    estimated_cost = base_cost * multiplier
    
    return {
        "estimated_cost_usd": int(estimated_cost),
        "budget_category": "Premium" if estimated_cost > 4000 else ("Medium" if estimated_cost > 1500 else "Low"),
        "confidence_interval": [int(estimated_cost * 0.9), int(estimated_cost * 1.1)]
    }
