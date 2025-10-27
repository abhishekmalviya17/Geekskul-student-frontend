import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  upcoming: [
    {
      id: "lecture-figma-handsoff",
      title: "Design-to-Code Handoff",
      moduleId: "module-ui",
      mentor: "Ananya Sharma",
      startTime: "2024-04-09T11:00:00+05:30",
      duration: 90,
      tags: ["Design", "Collaboration"],
      meetingLink: "https://meet.geekskul.com/figma-handoff",
    },
    {
      id: "lecture-sli-survey",
      title: "Service Level Indicators Deep-Dive",
      moduleId: "module-devops",
      mentor: "Ravi Verma",
      startTime: "2024-04-10T19:00:00+05:30",
      duration: 75,
      tags: ["SRE", "Reliability"],
      meetingLink: "https://meet.geekskul.com/sli-deepdive",
    },
  ],
  completed: [
    {
      id: "lecture-adv-react",
      title: "Advanced React Patterns",
      moduleId: "module-ui",
      mentor: "Ananya Sharma",
      startTime: "2024-03-31T11:00:00+05:30",
      duration: 85,
      tags: ["React", "Performance"],
      recordingLink: "https://vod.geekskul.com/adv-react",
      resources: [
        {
          type: "deck",
          label: "Slide deck",
          url: "https://cdn.geekskul.com/react-patterns.pdf",
        },
        {
          type: "github",
          label: "Live coding repo",
          url: "https://github.com/geekskul/live-react-patterns",
        },
      ],
    },
  ],
};

const lecturesSlice = createSlice({
  name: "lectures",
  initialState,
  reducers: {
    setUpcomingLectures(state, action) {
      state.upcoming = action.payload;
    },
    setCompletedLectures(state, action) {
      state.completed = action.payload;
    },
    updateLecture(state, action) {
      const { id, collection = "upcoming", changes } = action.payload;
      state[collection] = state[collection].map((lecture) =>
        lecture.id === id ? { ...lecture, ...changes } : lecture,
      );
    },
  },
});

export const { setUpcomingLectures, setCompletedLectures, updateLecture } = lecturesSlice.actions;

export const selectUpcomingLectures = (state) => state.lectures.upcoming;
export const selectCompletedLectures = (state) => state.lectures.completed;
export const selectLectureById = (state, lectureId) =>
  state.lectures.upcoming.find((lecture) => lecture.id === lectureId) ||
  state.lectures.completed.find((lecture) => lecture.id === lectureId);

export default lecturesSlice.reducer;
