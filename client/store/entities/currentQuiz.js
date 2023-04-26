import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  started: false,
  currentQuestion: -1,
  quiz: {
    sortOrder: 0,
    isDeleted: false,
    _id: "",
    name: "",
    type: "video",
    showInVideoTime: "",
    lesson: "",
    __v: 0,
    questions: [],
  },

  answers: {},
};

const slice = createSlice({
  name: "currentQuiz",
  initialState,
  reducers: {
    setCurrentQuiz: (state, action) => {
      state.quiz = action.payload;
    },
    startQuiz: (state, action) => {
      state.started = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    resetCurrentQuiz: (state, action) => {
      for (let key in initialState) state[key] = initialState[key];
    },
  },
});

export default slice.reducer;
export const {
  resetCurrentQuiz,
  setCurrentQuiz,
  startQuiz,
  setCurrentQuestion,
} = slice.actions;

// quiz: {
//   sortOrder: 0,
//   isDeleted: false,
//   _id: "5fb1422be757e90c36a50044",
//   name: "Quiz 1",
//   type: "video",
//   showInVideoTime: "00:01:00",
//   lesson: "5faec9e303ac800869748bd9",
//   __v: 0,
//   questions: [
//     {
//       reference:
//         "<p>Reference of this question <strong>BLA BLA</strong> aklsjdalksjdlakjsd.</p>",
//       options: [
//         {
//           name: "<p>option 1</p>",
//           id: "80824922-834f-4419-8d7c-8a41daaf430e",
//           isCorrect: true,
//         },
//         {
//           name: "<p>option 2</p>",
//           id: "a3859a02-521b-4a7a-a914-e2c1637fcb93",
//           isCorrect: false,
//         },
//       ],
//       allowedTime: "",
//       sortOrder: 0,
//       isDeleted: false,
//       _id: "5fb1423ee757e90c36a50045",
//       name: "<p>Question 1</p>",
//       type: "multi-choice",
//       quiz: "5fb1422be757e90c36a50044",
//       __v: 0,
//       image:
//         "http://localhost:8080/uploads/images/98821d4f-d291-46ef-a536-11b482b7cd1b.png",
//       id: "5fb1423ee757e90c36a50045",
//     },
//     {
//       reference: "<p>details that where this question is made from</p>",
//       image:
//         "http://localhost:8080/uploads/images/98821d4f-d291-46ef-a536-11b482b7cd1b.png",
//       options: [],
//       allowedTime: "00:01:00",
//       sortOrder: 0,
//       isDeleted: false,
//       _id: "5fb2bab85e79990ddfc973cb",
//       name: "<p>Question 2 askdjlaskjdlaskjdalksjd</p>",
//       type: "writable",
//       quiz: "5fb1422be757e90c36a50044",
//       __v: 0,
//       image: "",
//       id: "5fb2bab85e79990ddfc973cb",
//     },
//   ],
// },
