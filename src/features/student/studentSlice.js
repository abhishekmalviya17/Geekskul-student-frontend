import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getStudentDashboard,
  getStudentCourses,
  getStudentCourseOutline,
  getUpcomingLectures,
  getModuleLecturesDetail,
  getLectureDetail,
} from "../../services/studentService.js";

function extractErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export const fetchStudentDashboard = createAsyncThunk(
  "student/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await getStudentDashboard();
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "We couldn’t load your dashboard yet.")
      );
    }
  }
);

export const fetchStudentCourses = createAsyncThunk(
  "student/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      return await getStudentCourses();
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "We couldn’t load your courses yet.")
      );
    }
  }
);

export const fetchStudentCourseOutline = createAsyncThunk(
  "student/fetchCourseOutline",
  async (courseId, { rejectWithValue }) => {
    try {
      const outline = await getStudentCourseOutline(courseId);
      return { courseId, outline };
    } catch (error) {
      return rejectWithValue({
        courseId,
        message: extractErrorMessage(
          error,
          "We couldn't load the course outline yet."
        ),
      });
    }
  }
);

export const fetchUpcomingLectures = createAsyncThunk(
  "student/fetchUpcomingLectures",
  async (days = 7, { rejectWithValue }) => {
    try {
      const result = await getUpcomingLectures(days);
      return result.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "We couldn't load upcoming lectures.")
      );
    }
  }
);

export const fetchModuleLectures = createAsyncThunk(
  "student/fetchModuleLectures",
  async (moduleId, { rejectWithValue }) => {
    try {
      const lectures = await getModuleLecturesDetail(moduleId);
      return { moduleId, lectures };
    } catch (error) {
      return rejectWithValue({
        moduleId,
        message: extractErrorMessage(error, "We couldn't load module lectures."),
      });
    }
  }
);

export const fetchLectureDetail = createAsyncThunk(
  "student/fetchLectureDetail",
  async (lectureId, { rejectWithValue }) => {
    try {
      const lecture = await getLectureDetail(lectureId);
      return lecture;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "We couldn't load lecture details.")
      );
    }
  }
);

const initialAsyncState = {
  data: null,
  status: "idle",
  error: null,
};

const defaultCourseOutlineState = Object.freeze({
  data: null,
  status: "idle",
  error: null,
});

const studentSlice = createSlice({
  name: "student",
  initialState: {
    dashboard: { ...initialAsyncState },
    courses: { ...initialAsyncState, data: [] },
    courseOutlines: {},
    upcomingLectures: { ...initialAsyncState, data: [] },
    moduleLectures: {},
    lectureDetail: { ...initialAsyncState },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.dashboard.status = "loading";
        state.dashboard.error = null;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.dashboard.status = "succeeded";
        state.dashboard.data = action.payload;
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.dashboard.status = "failed";
        state.dashboard.error = action.payload || action.error.message;
      })
      .addCase(fetchStudentCourses.pending, (state) => {
        state.courses.status = "loading";
        state.courses.error = null;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.courses.status = "succeeded";
        state.courses.data = action.payload;
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.courses.status = "failed";
        state.courses.error = action.payload || action.error.message;
      })
      .addCase(fetchStudentCourseOutline.pending, (state, action) => {
        const courseId = action.meta.arg;
        state.courseOutlines[courseId] = {
          data: state.courseOutlines[courseId]?.data || null,
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchStudentCourseOutline.fulfilled, (state, action) => {
        const { courseId, outline } = action.payload;
        state.courseOutlines[courseId] = {
          data: outline,
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchStudentCourseOutline.rejected, (state, action) => {
        const courseId = action.payload?.courseId || action.meta.arg;
        const message = action.payload?.message || action.error.message;
        state.courseOutlines[courseId] = {
          data: state.courseOutlines[courseId]?.data || null,
          status: "failed",
          error: message,
        };
      })
      .addCase(fetchUpcomingLectures.pending, (state) => {
        state.upcomingLectures.status = "loading";
        state.upcomingLectures.error = null;
      })
      .addCase(fetchUpcomingLectures.fulfilled, (state, action) => {
        state.upcomingLectures.status = "succeeded";
        state.upcomingLectures.data = action.payload;
      })
      .addCase(fetchUpcomingLectures.rejected, (state, action) => {
        state.upcomingLectures.status = "failed";
        state.upcomingLectures.error = action.payload || action.error.message;
      })
      .addCase(fetchModuleLectures.pending, (state, action) => {
        const moduleId = action.meta.arg;
        state.moduleLectures[moduleId] = {
          data: state.moduleLectures[moduleId]?.data || null,
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchModuleLectures.fulfilled, (state, action) => {
        const { moduleId, lectures } = action.payload;
        state.moduleLectures[moduleId] = {
          data: lectures,
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchModuleLectures.rejected, (state, action) => {
        const moduleId = action.payload?.moduleId || action.meta.arg;
        const message = action.payload?.message || action.error.message;
        state.moduleLectures[moduleId] = {
          data: state.moduleLectures[moduleId]?.data || null,
          status: "failed",
          error: message,
        };
      })
      .addCase(fetchLectureDetail.pending, (state) => {
        state.lectureDetail.status = "loading";
        state.lectureDetail.error = null;
      })
      .addCase(fetchLectureDetail.fulfilled, (state, action) => {
        state.lectureDetail.status = "succeeded";
        state.lectureDetail.data = action.payload;
      })
      .addCase(fetchLectureDetail.rejected, (state, action) => {
        state.lectureDetail.status = "failed";
        state.lectureDetail.error = action.payload || action.error.message;
      });
  },
});

export const selectDashboardState = (state) => state.student.dashboard;
export const selectDashboardData = (state) => state.student.dashboard.data;
export const selectCoursesState = (state) => state.student.courses;
export const selectStudentCourses = (state) => state.student.courses.data;
export const selectCourseOutlineState = (state, courseId) =>
  state.student.courseOutlines[courseId] || defaultCourseOutlineState;
export const selectUpcomingLecturesState = (state) => state.student.upcomingLectures;
export const selectUpcomingLecturesData = (state) => state.student.upcomingLectures.data;
export const selectModuleLecturesState = (state, moduleId) =>
  state.student.moduleLectures[moduleId] || defaultCourseOutlineState;
export const selectLectureDetailState = (state) => state.student.lectureDetail;

export default studentSlice.reducer;
