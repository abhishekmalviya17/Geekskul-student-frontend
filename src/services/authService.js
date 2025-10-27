import apiClient from "./apiClient.js";

export async function signupStudent(payload) {
  const response = await apiClient.post("/auth/signup/student", payload);
  return response.data;
}

export async function loginStudent(credentials) {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
}

export async function confirmEmailVerification(verificationId) {
  const response = await apiClient.post("/auth/verify-email/confirm", {
    verificationId,
  });
  return response.data;
}

export async function requestEmailVerification(email) {
  const response = await apiClient.post("/auth/verify-email/request", {
    email,
  });
  return response.data;
}
