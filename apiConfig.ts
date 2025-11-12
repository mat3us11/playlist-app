// apiConfig.ts
export const API_BASE = "https://despisable-arnette-tartrated.ngrok-free.dev"; 

import axios from "axios";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});
