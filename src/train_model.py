# Import necessary libraries
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Embedding, Flatten, Dot
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load the structured dataset
file_path = "C:/Users/Piyush/OneDrive/Documents/tp/Large_Symptom_Management_Treatment_Guide.csv"
symptom_df = pd.read_csv(file_path)

# Ensure no missing values in categorical columns
symptom_df.fillna("", inplace=True)

# Encode Symptoms & Treatments
symptom_encoder = LabelEncoder()
treatment_encoder = LabelEncoder()

symptom_df["Symptom_Encoded"] = symptom_encoder.fit_transform(symptom_df["Symptom"])
symptom_df["Treatment_Encoded"] = treatment_encoder.fit_transform(
    symptom_df["Medications"].astype(str) + " " + 
    symptom_df["Therapies"].astype(str) + " " + 
    symptom_df["Assistive_Tools"].astype(str)
)

# Extract encoded features for training
symptom_ids = symptom_df["Symptom_Encoded"].values
treatment_ids = symptom_df["Treatment_Encoded"].values

# Split data into training and validation sets
symptom_train, symptom_val, treatment_train, treatment_val = train_test_split(
    symptom_ids, treatment_ids, test_size=0.2, random_state=42
)

# Define embedding size
embedding_size = 50

# Input layers
symptom_input = Input(shape=(1,), name="Symptom_Input")
treatment_input = Input(shape=(1,), name="Treatment_Input")

# Embedding layers
symptom_embedding = Embedding(input_dim=len(symptom_encoder.classes_), output_dim=embedding_size, name="Symptom_Embedding")(symptom_input)
treatment_embedding = Embedding(input_dim=len(treatment_encoder.classes_), output_dim=embedding_size, name="Treatment_Embedding")(treatment_input)

# Flatten embeddings
symptom_vec = Flatten()(symptom_embedding)
treatment_vec = Flatten()(treatment_embedding)

# Compute similarity (dot product)
dot_product = Dot(axes=1, name="Similarity_Score")([symptom_vec, treatment_vec])

# Define the model
recommendation_model = Model(inputs=[symptom_input, treatment_input], outputs=dot_product)
recommendation_model.compile(optimizer="adam", loss="mse")

# Train the model
recommendation_model.fit(
    [symptom_train, treatment_train],
    np.ones(len(symptom_train)),  # Dummy labels (we only need similarity scores)
    epochs=10,  # Adjust epochs based on performance
    batch_size=32,
    validation_data=([symptom_val, treatment_val], np.ones(len(symptom_val)))
)

# Save the trained model for real-time recommendations
from keras.saving import save_model

model_save_path = "C:/Users/Piyush/OneDrive/Documents/tp/symptom_treatment_recommendation_model.keras"

# Save the trained model WITHOUT compilation to prevent loss function errors
save_model(recommendation_model, model_save_path, include_optimizer=False)

print(f"Model successfully saved at {model_save_path}")