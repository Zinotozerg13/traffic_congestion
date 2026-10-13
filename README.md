# 🚦 Traffic Congestion Prediction and Travel Time Estimation

##  Overview

This project presents a machine learning-based system for traffic congestion prediction and travel time estimation. The system uses historical traffic information along with contextual factors such as distance, time, weather, road type, and date to predict the expected level of traffic congestion and estimate travel time.

The project was developed as part of a research study focused on applying machine learning techniques to intelligent transportation systems.


##  Objectives

The main objectives of this research are:
 Predict the level of traffic congestion using machine learning. Estimate the expected travel time for a given journey. Analyze the relationship between traffic congestion and different environmental and temporal factors. Develop a system that can provide predictions through a web-based interface. Explore the potential of machine learning for intelligent traffic management. 




##  Machine Learning

The system uses trained machine learning models for two primary prediction tasks:

### 1. Traffic Congestion Prediction

The congestion model predicts the expected traffic congestion level based on input features such as:
 Distance Time of day Weather Road type Date and temporal information 
### 2. Travel Time Estimation

The travel-time model estimates the expected journey duration using relevant traffic and trip-related features.

The trained models are stored separately from the GitHub repository because of their large file size.



##  Input Features

The prediction system can use information including:

| Feature   | Description                                             |
| --------- | ------------------------------------------------------- |
| Distance  | Distance between the starting and destination locations |
| Time      | Time associated with the journey                        |
| Weather   | Weather condition during the journey                    |
| Road Type | Type/category of road                                   |
| Date      | Date selected for the prediction                        |

Additional temporal features can be extracted from the date, such as:
 Day Month Year Day of week Weekend/weekday 


##  Technologies Used

### Frontend
 React Vite JavaScript Tailwind CSS 
### Backend
 Python Django Django REST Framework 
### Machine Learning
 Python Pandas NumPy Scikit-learn Joblib Jupyter Notebook 
### Development Tools
 Git GitHub Visual Studio Code 
---

##  Project Structure

text
traffic_congestion/
│
├── backend/
│   ├── ml/
│   │   ├── analysis2.ipynb
│   │   ├── eda/
│   │   └── mlfinal/
│   │
│   ├── traffic_congestion_project/
│   │   ├── distance/
│   │   ├── predictions/
│   │   ├── users/
│   │   ├── manage.py
│   │   └── traffic_congestion_project/
│   │
│   └── env/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md


> The `env/` directory and other generated files are excluded from version control.



##  Installation

### Prerequisites

Make sure the following are installed:
 Python 3.x Node.js npm Git 
---

## Backend Setup

Navigate to the backend directory:

bash
cd backend


Create a virtual environment:

bash
python -m venv env


Activate it on Windows:

powershell
.\env\Scripts\activate


Install the required Python packages:

bash
pip install -r requirements.txt


Run the Django development server:

bash
python traffic_congestion_project/manage.py runserver


The backend should then be available at:

text
http://127.0.0.1:8000/


---

##  Frontend Setup

Open another terminal and navigate to the frontend:

bash
cd frontend


Install dependencies:

bash
npm install


Start the development server:

bash
npm run dev


The frontend will normally be available at:

text
http://localhost:5173/




##  Machine Learning Workflow

The machine learning workflow consists of the following stages:

text
Data Collection
      ↓
Data Preprocessing
      ↓
Exploratory Data Analysis
      ↓
Feature Engineering
      ↓
Model Training
      ↓
Model Evaluation
      ↓
Model Selection
      ↓
Prediction


### Data Preprocessing

The dataset is processed to:
 Handle missing values Remove unnecessary data Transform categorical variables Extract useful temporal features Prepare data for machine learning 
### Exploratory Data Analysis

Jupyter notebooks are included in the `backend/ml/` directory for analyzing:
 Traffic patterns Feature distributions Relationships between variables Congestion trends Model-related statistics 
---

##  Model Evaluation

The trained models are evaluated using appropriate regression/classification performance metrics depending on the prediction task.

Examples of evaluation metrics include:
 Accuracy Precision Recall F1-score Mean Absolute Error (MAE) Root Mean Squared Error (RMSE) R² Score 
The detailed experimental results and analysis are presented in the associated research paper.



##  Web Application

The web application provides an interface through which users can provide trip-related information and receive:
 Predicted traffic congestion Estimated travel time 
The frontend communicates with the Django backend through API requests.



## Machine Learning Models

The trained `.pkl` model files are not included in this repository because they are very large.

The application expects the trained models at the appropriate location inside:

text
backend/ml/


Before running the prediction system, the required trained model files must be obtained and placed in the expected directory.



##  Research

This repository contains the implementation and experimental materials associated with the research study on machine-learning-based traffic congestion prediction and travel time estimation.

The repository includes:
 Data analysis notebooks Exploratory data analysis Machine learning experiments Backend implementation Frontend implementation Prediction APIs 


##  Future Improvements

Potential future improvements include:
 Real-time traffic data integration GPS-based live traffic prediction Integration with Google Maps or other mapping services Larger and more diverse datasets Real-time weather data Advanced deep learning models Deployment as a cloud-based service Continuous model retraining using newly collected traffic data 




##  License

This project was developed for academic and research purposes.
