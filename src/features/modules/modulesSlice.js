import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "module-ui",
      title: "Interface Engineering",
      status: "in-progress",
      completion: 56,
      highlights: ["Design systems", "Accessible UI", "Animation"],
    },
    {
      id: "module-backend",
      title: "Service Architecture",
      status: "completed",
      completion: 100,
      highlights: ["Node.js", "API resilience", "Caching"],
    },
    {
      id: "module-devops",
      title: "Deploy & Observability",
      status: "queued",
      completion: 12,
      highlights: ["CI/CD", "K8s intro", "SLO design"],
    },
  ],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules(state, action) {
      state.items = action.payload;
    },
    updateModule(state, action) {
      const { id, changes } = action.payload;
      state.items = state.items.map((module) =>
        module.id === id ? { ...module, ...changes } : module,
      );
    },
  },
});

export const { setModules, updateModule } = modulesSlice.actions;

export const selectModules = (state) => state.modules.items;

export default modulesSlice.reducer;
