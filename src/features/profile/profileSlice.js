import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getStudentProfile,
  updateProfileBasic,
  updateProfileEducation,
  updateProfileLinks,
  updateProfilePreferences,
} from "../../services/profileService.js";

function extractErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export const fetchStudentProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getStudentProfile();
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not load profile data.")
      );
    }
  }
);

export const updateBasicProfile = createAsyncThunk(
  "profile/updateBasic",
  async (profileData, { rejectWithValue }) => {
    try {
      return await updateProfileBasic(profileData);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not update basic profile.")
      );
    }
  }
);

export const updateEducationProfile = createAsyncThunk(
  "profile/updateEducation",
  async (educationData, { rejectWithValue }) => {
    try {
      return await updateProfileEducation(educationData);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not update education profile.")
      );
    }
  }
);

export const updateProfileLinksData = createAsyncThunk(
  "profile/updateLinks",
  async (linksData, { rejectWithValue }) => {
    try {
      return await updateProfileLinks(linksData);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not update profile links.")
      );
    }
  }
);

export const updateProfilePreferencesData = createAsyncThunk(
  "profile/updatePreferences",
  async (preferencesData, { rejectWithValue }) => {
    try {
      return await updateProfilePreferences(preferencesData);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not update preferences.")
      );
    }
  }
);

const initialState = {
  user: null,
  basic: null,
  education: null,
  links: null,
  preferences: {
    notifications: {
      email: true,
      sms: false,
      inApp: true,
    },
    timezone: "Asia/Kolkata",
    communication: "slack",
  },
  snapshot: {
    completion: 0,
    streak: 0,
    mentor: null,
    lastLogin: null,
  },
  achievements: [],
  
  // Loading states
  status: "idle", // idle, loading, succeeded, failed
  error: null,
  updateStatus: {
    basic: { state: "idle", message: "", error: "" },
    education: { state: "idle", message: "", error: "" },
    links: { state: "idle", message: "", error: "" },
    preferences: { state: "idle", message: "", error: "" },
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchStudentProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        // API returns { success: true, data: user }
        const userData = action.payload.data || action.payload;
        
        state.user = userData || null;
        state.basic = userData || null;
        state.education = userData?.education || null;
        state.links = userData?.profileLinks || null;
        
        // Extract snapshot data
        if (userData?.snapshot) {
          state.snapshot = userData.snapshot;
        }
        if (userData?.achievements) {
          state.achievements = userData.achievements;
        }
        if (userData?.preferences) {
          state.preferences = { ...state.preferences, ...userData.preferences };
        }
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      
      // Update Basic Profile
      .addCase(updateBasicProfile.pending, (state) => {
        state.updateStatus.basic = { state: "loading", message: "", error: "" };
      })
      .addCase(updateBasicProfile.fulfilled, (state, action) => {
        state.updateStatus.basic = { 
          state: "succeeded", 
          message: "Successfully saved your personal information",
          error: ""
        };
        // API returns { success: true, message: "...", data: user }
        const userData = action.payload.data || action.payload;
        state.user = userData || state.user;
        state.basic = userData || state.basic;
      })
      .addCase(updateBasicProfile.rejected, (state, action) => {
        state.updateStatus.basic = { 
          state: "failed",
          message: "",
          error: action.payload || "Failed to update personal information"
        };
      })
      
      // Update Education
      .addCase(updateEducationProfile.pending, (state) => {
        state.updateStatus.education = { state: "loading", message: "", error: "" };
      })
      .addCase(updateEducationProfile.fulfilled, (state, action) => {
        state.updateStatus.education = { 
          state: "succeeded",
          message: "Successfully saved your education details",
          error: ""
        };
        // API returns { success: true, message: "...", data: user }
        const userData = action.payload.data || action.payload;
        state.education = userData?.education || state.education;
      })
      .addCase(updateEducationProfile.rejected, (state, action) => {
        state.updateStatus.education = { 
          state: "failed",
          message: "",
          error: action.payload || "Failed to update education details"
        };
      })
      
      // Update Links
      .addCase(updateProfileLinksData.pending, (state) => {
        state.updateStatus.links = { state: "loading", message: "", error: "" };
      })
      .addCase(updateProfileLinksData.fulfilled, (state, action) => {
        state.updateStatus.links = { 
          state: "succeeded",
          message: "Successfully saved your social links",
          error: ""
        };
        // API returns { success: true, message: "...", data: user }
        const userData = action.payload.data || action.payload;
        state.links = userData?.profileLinks || state.links;
      })
      .addCase(updateProfileLinksData.rejected, (state, action) => {
        state.updateStatus.links = { 
          state: "failed",
          message: "",
          error: action.payload || "Failed to update social links"
        };
      })
      
      // Update Preferences
      .addCase(updateProfilePreferencesData.pending, (state) => {
        state.updateStatus.preferences = { state: "loading", message: "", error: "" };
      })
      .addCase(updateProfilePreferencesData.fulfilled, (state, action) => {
        state.updateStatus.preferences = { 
          state: "succeeded",
          message: "Successfully saved your preferences",
          error: ""
        };
        // API returns { success: true, message: "...", data: user }
        const userData = action.payload.data || action.payload;
        if (userData?.preferences) {
          state.preferences = { ...state.preferences, ...userData.preferences };
        }
      })
      .addCase(updateProfilePreferencesData.rejected, (state, action) => {
        state.updateStatus.preferences = { 
          state: "failed",
          message: "",
          error: action.payload || "Failed to update preferences"
        };
      });
  },
});

export const { clearError } = profileSlice.actions;

export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileIsLoading = (state) => state.profile.status === "loading";
export const selectProfileError = (state) => state.profile.error;
export const selectProfileUser = (state) => state.profile.user;
export const selectProfileBasic = (state) => state.profile.basic;
export const selectProfileEducation = (state) => state.profile.education;
export const selectProfileLinks = (state) => state.profile.links;
export const selectProfileSnapshot = (state) => state.profile.snapshot;
export const selectProfileAchievements = (state) => state.profile.achievements;
export const selectProfilePreferences = (state) => state.profile.preferences;
export const selectProfileUpdateStatus = (state) => state.profile.updateStatus;

// Form-specific selectors
export const selectBasicUpdateStatus = (state) => state.profile.updateStatus.basic;
export const selectEducationUpdateStatus = (state) => state.profile.updateStatus.education;
export const selectLinksUpdateStatus = (state) => state.profile.updateStatus.links;
export const selectPreferencesUpdateStatus = (state) => state.profile.updateStatus.preferences;

export default profileSlice.reducer;
