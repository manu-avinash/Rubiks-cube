import cv2
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt

model=tf.keras.models.load_model(r'solvedandscrambled.keras')

IMG_SIZE = (224, 224)  # Adjust based on your model

# Open the webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Preprocess the frame
    img = cv2.resize(frame, IMG_SIZE)
    img = img / 255.0  # Normalize if required by your model
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    
    # Predict
    predictions = model.predict(img)
    predicted_class = None
    if predictions<=0.5:
        predicted_class='Solved'
    else:
        predicted_class='Scrambled'
    
    
    # Display results
    text = f"Prediction: {predicted_class}"
    cv2.putText(frame, text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Webcam Prediction", frame)
    
    # Exit when 'ESC' is pressed
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
