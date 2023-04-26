import { combineReducers } from "redux";
import loginModal from "./loginModal";
import registerModal from "./registerModal";
import subscriptionModal from "./subscriptionModal";
import quizModal from "./quizModal";
import navbarMenusReducer from "./navbarMenus";
import footerLinksReducer from "./footerLinks";
import footerReducer from "./footer";
import commonDataReducer from "./commonData";

import homePage from "./homePage";
import aboutPage from "./aboutPage";
import whyPage from "./whyPage";
import ourTeachersPage from "./ourTeachersPage";
import howToPayPage from "./howToPayPage";
import coursePage from "./coursePage";
import freeVideosPage from "./freeVideosPage";
import subscriptionPage from "./subscriptionPage";
import testimonials from "./testimonials";
import trialModal from "./trialModal";

export default combineReducers({
  loginModal,
  trialModal,
  registerModal,
  subscriptionModal,
  quizModal,
  navbarMenus: navbarMenusReducer,
  footerLinks: footerLinksReducer,
  footer: footerReducer,
  commonData: commonDataReducer,
  subscriptionPage,

  //
  homePage,
  aboutPage,
  whyPage,
  howToPayPage,
  ourTeachersPage,
  coursePage,
  freeVideosPage,
  testimonials,
});
