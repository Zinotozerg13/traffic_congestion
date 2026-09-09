import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export const getDistance = async (origin, destination) => {
  try {
    const response = await axios.post(`${BASE_URL}/distance/`, {
      origin,
      destination,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "Unable to fetch distance" };
  }
};

export const getPrediction = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/predict/`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "Unable to fetch prediction" };
  }
};