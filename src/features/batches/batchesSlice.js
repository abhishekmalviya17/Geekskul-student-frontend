import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "batch-neo",
      name: "Neo Full-Stack Cohort",
      progress: 68,
      mentors: ["Ananya", "Ravi"],
      nextSession: "Mon, 11:00 AM",
      focus: "Advanced React Patterns",
    },
    {
      id: "batch-aurora",
      name: "Aurora Data Science",
      progress: 82,
      mentors: ["Sanya"],
      nextSession: "Wed, 6:30 PM",
      focus: "Model Deployment",
    },
  ],
};

const batchesSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {
    setBatches(state, action) {
      state.items = action.payload;
    },
    updateBatch(state, action) {
      const { id, changes } = action.payload;
      state.items = state.items.map((batch) =>
        batch.id === id ? { ...batch, ...changes } : batch,
      );
    },
  },
});

export const { setBatches, updateBatch } = batchesSlice.actions;

export const selectBatches = (state) => state.batches.items;

export default batchesSlice.reducer;
