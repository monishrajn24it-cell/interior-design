import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.densenet import preprocess_input
from typing import Dict, Any, List

class DesignStyleClassifier:
    def __init__(self, model_path: str = "backend/ml/models/ModelXception.h5", labels_path: str = "backend/ml/models/224x224float64_Labels.npy"):
        self.img_size = 224
        
        # Robust path resolution relative to the root directory
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.model_path = os.path.join(base_dir, model_path)
        self.labels_path = os.path.join(base_dir, labels_path)
        
        self.model = None
        # Default labels from the Interior Design style dataset
        self.labels = ["Modern", "Industrial", "Scandinavian", "Bohemian", "Minimalist", "Traditional", "Rustic", "Coastal", "Urban", "Glam"]

        # Try to load labels
        if os.path.exists(self.labels_path):
            try:
                self.labels = np.load(self.labels_path).tolist()
                print(f"Loaded {len(self.labels)} labels from {self.labels_path}")
            except Exception as e:
                print(f"Could not load labels from {self.labels_path}: {e}")

        # Try to load model
        if os.path.exists(self.model_path):
            try:
                # Corrected: load_model from tf.keras.models
                self.model = tf.keras.models.load_model(self.model_path)
                print(f"Loaded AI Classification model from {self.model_path}")
            except Exception as e:
                print(f"Could not load TensorFlow AI model from {self.model_path}: {e}")
                print("Proceeding in Simulation Mode (Inference logic will be mocked).")
        else:
            print(f"[WARNING] Model file NOT found at {self.model_path}. Running in SIMULATION (Mock) mode.")

    def preprocess_image(self, image_bytes: bytes):
        """Prepare image for DenseNet201 input."""
        # Convert bytes to PIL Image
        from io import BytesIO
        from PIL import Image
        img = Image.open(BytesIO(image_bytes))
        
        # Ensure RGB
        if img.mode != "RGB":
            img = img.convert("RGB")
            
        # Resize to 224x224
        img = img.resize((self.img_size, self.img_size))
        
        # Convert to array and add batch dimension
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        
        # Preprocess using DenseNet's specific preprocessing (scaling/etc)
        x = preprocess_input(x)
        return x

    async def predict_style(self, image_data: bytes) -> Dict[str, Any]:
        """Classify the design style of the provided image."""
        if self.model is None:
            # Simulated inference if model is missing
            import asyncio
            import random
            await asyncio.sleep(1.0)
            style_idx = random.randint(0, len(self.labels) - 1)
            confidence = random.uniform(0.7, 0.99)
            return {
                "style": self.labels[style_idx],
                "confidence": confidence,
                "is_mock": True,
                "all_predictions": {l: random.uniform(0, 0.2) for l in self.labels}
            }

        try:
            processed_img = self.preprocess_image(image_data)
            preds = self.model.predict(processed_img)[0]
            
            top_idx = np.argmax(preds)
            style_label = self.labels[top_idx]
            confidence = float(preds[top_idx])

            return {
                "style": style_label,
                "confidence": confidence,
                "is_mock": False,
                "all_predictions": {self.labels[i]: float(preds[i]) for i in range(len(self.labels))}
            }
        except Exception as e:
            print(f"Error during prediction: {e}")
            return {"error": str(e), "status": "failed"}

# Singleton instance
classifier = DesignStyleClassifier()
