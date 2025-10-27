import apiClient from "./apiClient.js";

export async function getStudentDashboard() {
  const response = await apiClient.get("/student/dashboard");
  return response.data;
}

export async function getStudentCourses() {
  const response = await apiClient.get("/student/courses");
  return response.data;
}

export async function getStudentCourse(courseId) {
  const response = await apiClient.get(`/student/courses/${courseId}`);
  return response.data;
}

export async function getStudentCourseOutline(courseId) {
  const response = await apiClient.get(`/student/courses/${courseId}/outline`);
  return response.data;
}

export async function getModuleLectures(moduleId) {
  const response = await apiClient.get(`/student/modules/${moduleId}/lectures`);
  return response.data;
}

export async function getUpcomingLectures(days = 7) {
  const response = await apiClient.get(`/student/lectures/upcoming`, {
    params: { days },
  });
  return response.data;
}

export async function getModuleLecturesDetail(moduleId) {
  const response = await apiClient.get(`/student/modules/${moduleId}/lectures`);
  return response.data;
}

export async function getLectureDetail(lectureId) {
  const response = await apiClient.get(`/student/lectures/${lectureId}`);
  return response.data;
}
