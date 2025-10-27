import apiClient from "./apiClient.js";

export async function getStudentProfile() {
  const response = await apiClient.get("/student/profile");
  return response.data;
}

export async function updateProfileBasic(profileData) {
  const response = await apiClient.put("/student/profile/basic", profileData);
  return response.data;
}

export async function updateProfileEducation(educationData) {
  // Backend expects data wrapped in education object
  const payload = {
    education: educationData,
  };
  const response = await apiClient.put("/student/profile/education", payload);
  return response.data;
}

export async function updateProfileLinks(linksData) {
  // Backend expects data wrapped in profileLinks object
  const payload = {
    profileLinks: linksData,
  };
  const response = await apiClient.put("/student/profile/links", payload);
  return response.data;
}

export async function updateProfilePreferences(preferencesData) {
  const response = await apiClient.put("/student/profile/preferences", preferencesData);
  return response.data;
}

export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await apiClient.post("/student/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
