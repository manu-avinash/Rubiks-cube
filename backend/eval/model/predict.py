import cv2
from tensorflow.keras.models import load_model
import numpy as np
from pathlib import Path
import os
script_path = Path(__file__).resolve()
MODEL_PATH =os.path.join(script_path.parent,'solvedandscrambled.keras')

IMG_SIZE = (224, 224)  # Adjust based on your model

def predict_state(frame):

    model=load_model(MODEL_PATH)
    try:
        img = cv2.resize(frame, IMG_SIZE)
        img = img / 255.0  
        img = np.expand_dims(img, axis=0)
        
        # Predict
        predictions = model.predict(img)
        predicted_class = None
        if predictions<=0.5:
            predicted_class="Solved"# Solved
            prediction_confidence=((abs(float(predictions[0][0])-0.5)/0.5)*100)
        else:
            predicted_class="Scrambled"# Scrambled
            prediction_confidence=((float(predictions[0][0])-0.5)/0.5)*100
            
        return (predicted_class,prediction_confidence)
    except:
        return (None,None)

        