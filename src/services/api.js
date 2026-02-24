import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getContainers = () => API.get("/containers");
export const getAlerts = () => API.get("/alerts");
export const getStats = () => API.get("/stats");
export const generateReport = (data) => API.post("/reports", data);

