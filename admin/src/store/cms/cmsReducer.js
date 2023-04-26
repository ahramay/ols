import { combineReducers } from "redux";
import navbar from "./navbar";
import footerLinks from "./footerLinks";
import homeSliders from "./homeSliders";
import OutclassVideo from "./outclassVideos"
import infoCards from "./infoCards";
import unis from "./universities";
import students from "./students";
import stats from "./stats";
import aboutInfoCards from "./aboutInfoCards";
import teamMembers from "./teamMembers";
import whyPageBoards from "./whyPageBoards";
import paymentMethods from "./paymentMethods";
import contactInfoCards from "./contactInfoCards";
import faqs from "./faqs";
import links from "./links";
import freeVideos from './freeVideos'
import testimonials from "./testimonials";

export default combineReducers({
  navbar,
  footerLinks,
  homeSliders,
  OutclassVideo,
  infoCards,
  unis,
  students,
  stats,
  aboutInfoCards,
  teamMembers,
  whyPageBoards,
  paymentMethods,
  contactInfoCards,
  faqs,
  links,
  freeVideos,
  testimonials
});
