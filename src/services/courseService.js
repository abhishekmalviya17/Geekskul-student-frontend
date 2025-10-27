import apiClient from "./apiClient.js";

export async function fetchCourses() {
  const response = await apiClient.get("/courses");
  return response.data;
}
