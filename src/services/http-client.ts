import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
});
