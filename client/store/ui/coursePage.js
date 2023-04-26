import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",
    _id: "",
    name: "",
    image: "",
    price: 0,
    description: "",
    rating: 0,
    totalRatingCount: "",
    duration: "",
    videoDuration: "",
    lectures: "",
    teachers: [],
    chapters: [],
    category: {
      name: "",
    },
    language: {
      name: "",
    },
    skillLevel: {
      name: "",
    },
    isEnrolled: false,
    enrolledChapters: [],
    watchedVideos: [],
  },
};

const slice = createSlice({
  name: "coursePageData",
  initialState,
  reducers: {
    setCoursePageLoader: (state, action) => {
      state.loading = action.payload;
    },
    setCoursePageData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setCoursePageLoader, setCoursePageData } = slice.actions;
