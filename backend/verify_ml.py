import asyncio
import os
from ml.classification import DesignStyleClassifier

async def test_classification():
    print("Testing ML Classification Service...")
    classifier = DesignStyleClassifier()
    
    # Create a dummy image (just bytes)
    dummy_image = b'\x00' * 1024 
    
    print("\nAttempting prediction with dummy data...")
    try:
        # Note: In real use, this would fail on PIL open if bytes are invalid, 
        # but our classifier handles errors. Let's mock a valid-looking image if needed 
        # or just check if the service is alive.
        result = await classifier.predict_style(dummy_image)
        print(f"Result: {result}")
        if "style" in result:
            print(f"SUCCESS: Predicted style: {result['style']}")
        else:
            print(f"INFO: Service returned: {result.get('error', 'unknown error')}")
            
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    # Add project root to sys.path if running from terminal
    import sys
    sys.path.append(os.getcwd())
    
    asyncio.run(test_classification())
