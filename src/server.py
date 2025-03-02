from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Load the trained model
model_path = "C:/Users/Piyush/OneDrive/Documents/tp/symptom_treatment_recommendation_model.keras"
recommendation_model = load_model(model_path, compile=False)

# Load dataset
file_path = "C:/Users/Piyush/OneDrive/Documents/tp/Large_Symptom_Management_Treatment_Guide.csv"
symptom_df = pd.read_csv(file_path)
symptom_df.fillna("", inplace=True)

# Function to predict syndromes & treatments
def predict_diagnosis(selected_symptoms):
    matching_rows = symptom_df[symptom_df["Symptom"].isin(selected_symptoms)]

    if matching_rows.empty:
        return {"syndromes": [], "treatments": []}

    # Get unique syndromes
    syndrome_counts = matching_rows["Common_Disorders"].value_counts()
    probable_syndromes = list(set(syndrome_counts.index[:3]))

    # Predict top recommended treatments
    treatment_options = matching_rows[["Medications", "Therapies", "Assistive_Tools"]].drop_duplicates()
    
    return {
        "syndromes": probable_syndromes,
        "treatments": treatment_options.to_dict(orient="records")
    }

# API Route for Diagnosis Predictions
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    symptoms = data.get("symptoms", [])
    result = predict_diagnosis(symptoms)
    return jsonify(result)

# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
