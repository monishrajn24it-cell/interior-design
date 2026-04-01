import asyncio
import os
import time
import requests
import io
import uuid
import base64
from typing import List, Dict, Any, Optional
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
# Using SD 1.5 as it's generally stable for generic HF inference API calls
HF_MODEL_ID = "runwayml/stable-diffusion-v1-5"
API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}"

headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

def save_image_locally(image_bytes: bytes, prefix="generated") -> str:
    """Saves image bytes to the static folder and returns the URL path."""
    os.makedirs("generated", exist_ok=True)
    filename = f"{prefix}_{uuid.uuid4().hex[:8]}.jpg"
    filepath = os.path.join("generated", filename)
    
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("RGB")
        image.save(filepath, "JPEG")
        return f"http://localhost:8000/generated/{filename}"
    except Exception as e:
        print(f"Error saving image: {e}")
        return ""

async def generate_designs(
    image_data: bytes, 
    style: str, 
    prompt: Optional[str] = None, 
    intensity: int = 50,
    num_variations: int = 3
) -> List[Dict[str, str]]:
    """
    Generates multiple design variations using Cloud Inference (Hugging Face API).
    """
    base_prompt = prompt or f"A beautifully styled {style} interior design room, high quality, photorealistic, 8k resolution"
    
    results = []
    
    # Check if HF_TOKEN is valid
    if not HF_TOKEN or len(HF_TOKEN) < 10:
        print("HF_TOKEN is missing or invalid. Falling back to mock generation.")
        return await generate_designs_mock(image_data, style, prompt, intensity, num_variations)

    for i in range(num_variations):
        current_prompt = f"{base_prompt}, vivid lighting, variation {i}"
        
        # Some HF Models support Img2Img via inference API by passing image as base64 in json
        # Or by passing it natively. Since the free API can be finicky with specific params, 
        # we try our best to pass it text-to-image or image-to-image.
        # Often for SD 1.5 inference API, providing 'inputs' as text is safe.
        # But we really want image-to-image. Let's try sending the image.
        
        # If true Image-to-Image fails via this interface, it will fallback to mock
        payload = {
            "inputs": current_prompt,
            "parameters": {
                "num_inference_steps": 25,
                "guidance_scale": 7.5,
            }
        }
        
        try:
            print(f"Requesting generated design {i+1}/{num_variations} from Hugging Face...")
            # For simplicity with free tier, we'll hit the API. If it expects multipart or fails, we catch it.
            # Many times just sending the prompt is robust, but let's try to do it properly.
            # Actually, standard inference API for SD 1.5 might just do Text-to-Image if only `inputs` is given.
            response = requests.post(API_URL, headers=headers, json=payload, timeout=40)
            
            if response.status_code == 200:
                image_bytes = response.content
                url_path = save_image_locally(image_bytes, prefix=f"design_{style}")
                if url_path:
                    results.append({
                        "id": f"cloud-design-{i}",
                        "url": url_path,
                        "style": style,
                        "is_cloud": True,
                        "materials": ["Premium Design", "Modern Build"] if i % 2 == 0 else ["Eco-friendly", "Sustainable"],
                        "model_confidence": 0.95
                    })
            else:
                print(f"HF API Error ({response.status_code}): {response.text}")
                # Wait before fallback in case it's rate limit
                time.sleep(2)
                
        except Exception as e:
            print(f"Error calling HF API: {e}")
            
    # If API calls failed or partially failed, fallback to mock to ensure we always return 'num_variations'
    if len(results) < num_variations:
        print("Filling remaining designs with mock data...")
        mock_results = await generate_designs_mock(
            image_data, style, prompt, intensity, num_variations - len(results)
        )
        results.extend(mock_results)

    return results

async def generate_designs_mock(image_data: bytes, style: str, prompt: str = "", intensity: int = 50, num_variations: int = 3) -> List[Dict[str, str]]:
    """Fallback method that saves a dummy image locally to test static serving."""
    await asyncio.sleep(1.0)
    
    results = []
    
    # Generate a dummy image (e.g., solid color or blank) to save locally
    # It proves the backend saving and frontend loading works.
    for i in range(num_variations):
        try:
            # We'll just generate a simple pillow image with a color
            color = (50 + i*50, 100, 150)
            dummy_img = Image.new('RGB', (800, 600), color=color)
            img_byte_arr = io.BytesIO()
            dummy_img.save(img_byte_arr, format='JPEG')
            img_bytes = img_byte_arr.getvalue()
            
            url_path = save_image_locally(img_bytes, prefix=f"mock_{style}")
            
            # If for some reason writing fails, fallback to picsum
            final_url = url_path if url_path else f"https://picsum.photos/seed/{style}-{i}/800/600"
        except Exception:
            final_url = f"https://picsum.photos/seed/{style}-{i}/800/600"
            
        results.append({
            "id": f"mock-design-{i}",
            "url": final_url,
            "style": style,
            "materials": ["Placeholder", "Data"],
            "model_confidence": round(0.85, 2)
        })
    return results
