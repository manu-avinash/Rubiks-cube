
import numpy as np
import matplotlib.pyplot as plt

from keras.models import Model
from keras.applications import MobileNetV2
from keras.layers import Dense, Dropout, BatchNormalization, GlobalAveragePooling2D, Input
from keras.regularizers import l2
from tensorflow.keras.preprocessing.image import ImageDataGenerator as img_gen
from keras.callbacks import EarlyStopping
from keras.metrics import Precision, Recall

# Metrics
pre = Precision()
re = Recall()

# Data generators
train_data_gen = img_gen(
    rescale=1./255,
    horizontal_flip=True,
    vertical_flip=True,
    shear_range=0.2,
    zoom_range=0.2,
    width_shift_range=0.3,
    height_shift_range=0.3,
    rotation_range=40,
    validation_split=0.1
)

train_data = train_data_gen.flow_from_directory(
    r'D:\python files\datasets\train datasets\cube data',
    target_size=(224, 224),
    subset='training',
    batch_size=32,
    class_mode='binary'
)

val_data = train_data_gen.flow_from_directory(
    r'D:\python files\datasets\train datasets\cube data',
    target_size=(224, 224),
    subset='validation',
    batch_size=32,
    class_mode='binary'
)

# MobileNetV2 base
base_model = MobileNetV2(include_top=False, weights='imagenet', input_tensor=Input(shape=(224, 224, 3)))
base_model.trainable = False  # freeze base layers

# Custom head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation='relu', kernel_regularizer=l2(0.01))(x)
x = Dropout(0.3)(x)
output = Dense(1, activation='sigmoid')(x)  # binary classification

model = Model(inputs=base_model.input, outputs=output)

# Compile model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.summary()

# Early stopping
early_stopping = EarlyStopping(patience=2, verbose=1, restore_best_weights=True)

# Training
history = model.fit(train_data, epochs=20, validation_data=val_data, callbacks=[early_stopping])

# Plotting
plt.plot(history.history['loss'], label='Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.plot(history.history['accuracy'], label='Accuracy')
plt.plot(history.history['val_accuracy'], label='Val Accuracy')
plt.ylabel('Loss and Accuracy')
plt.xlabel('Epochs')
plt.legend()
plt.show()

# Evaluation
loss, acc = model.evaluate(val_data)
print(f'Loss: {loss}, Accuracy: {acc*100}%')

# Save
model.save('solvedandscrambled.keras')

# Precision and Recall
for i in range(len(val_data)):
    X, y = val_data[i]
    y_pred = model.predict(X)
    y_pred_labels = (y_pred > 0.5).astype(int)
    pre.update_state(y, y_pred_labels)
    re.update_state(y, y_pred_labels)

print(f'Precision: {pre.result().numpy()}, Recall: {re.result().numpy()}')
