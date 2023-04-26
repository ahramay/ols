import { combineReducers } from "redux";
import categoriesReducer from "./categories";
import coursesReducer from "./courses";
import currentQuiz from "./currentQuiz";
import cart from "./cart";
import activities from "./activities";
import blogCategories from "./blogCategories";
import freeVideos from "./freeVideos";
import subscriptionPlans from "./subscriptionPlans";
import courseMenus from "./courseMenus";

export default combineReducers({
  categories: categoriesReducer,
  courses: coursesReducer,
  currentQuiz,
  cart,
  activities,
  blogCategories,
  freeVideos,
  subscriptionPlans,
  courseMenus,
});
