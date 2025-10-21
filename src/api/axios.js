import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8012/api", // ← pastikan ini sesuai server backend kamu
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
