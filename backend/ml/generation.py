import asyncio
from typing import List, Dict, Any

async def generate_designs_mock(image_data: bytes, style: str, intensity: int = 50) -> List[Dict[str, str]]:
    # Simulate processing time for Diffusion models
    await asyncio.sleep(3.0)
    
    # We will generate mock URLs returning placeholder images that fit interior design
    # Using deterministic seed/colors for consistency
    results = []
    
    # Instead of actual SD generation, we use a placeholder image service
    mock_keywords = ["interior", "room", "sofa", "minimalist", "modern", "design"]
    
    # Generate 52 placeholders to simulate the 50+ requirement
    for i in range(52):
        style_seed = f"{style}-{i}"
        image_url = f"https://picsum.photos/seed/{style_seed}/800/600"
        results.append({
            "id": f"design-{i}",
            "url": image_url,
            "style": style,
            "materials": ["Wood", "Metal", "Fabric"] if i % 2 == 0 else ["Glass", "Concrete", "Leather"],
            "model_confidence": round(0.7 + (0.3 * (i % 10) / 10.0), 2)
        })
        
    return results
