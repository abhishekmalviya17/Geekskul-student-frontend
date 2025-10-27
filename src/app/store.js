import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import batchesReducer from "../features/batches/batchesSlice.js";
import modulesReducer from "../features/modules/modulesSlice.js";
import lecturesReducer from "../features/lectures/lecturesSlice.js";
import profileReducer from "../features/profile/profileSlice.js";
import studentReducer from "../features/student/studentSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    batches: batchesReducer,
    modules: modulesReducer,
    lectures: lecturesReducer,
    profile: profileReducer,
    student: studentReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});
