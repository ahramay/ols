//REQUIRING CMS ROUTERS
const navbarRouter = require("../controllers/api/cms/navbar");
const footerRouter = require("../controllers/api/cms/footer");

const footerLinksRouter = require("../controllers/api/cms/footerLink");
const homeHeaderSliderRouter = require("../controllers/api/cms/homeHeaderSlider");
const homeJoinRouter = require("../controllers/api/cms/homeJoin");
const infoCardsRouter = require("../controllers/api/cms/infoCards");
const homePageCMSDataRouter = require("../controllers/api/cms/homePageCMSData");
const studentReviewsSliderRouter = require("../controllers/api/cms/studentReviewsSlider");
const commonSiteDataRouter = require("../controllers/api/cms/commonSiteData");
const aboutusInfoCardsRouter = require("../controllers/api/cms/aboutUsInfoCards");
const aboutusCMSDataRouter = require("../controllers/api/cms/aboutUsCMSData");
const aboutStoryRouter = require("../controllers/api/cms/aboutStory");
const statsSliderRouter = require("../controllers/api/cms/statsSlider");
const contactusInfoCardsRouter = require("../controllers/api/cms/contactUsInfoCards");
const whyoutclassListRouter = require("../controllers/api/cms/whyOutClassList");
const paymentMethodsRouter = require("../controllers/api/cms/paymentMethods");
const howtopayCMSDataRouter = require("../controllers/api/cms/howToPayCMSData");
const contactusCMSDataRouter = require("../controllers/api/cms/contactUsCMSData");
const whyOutClassCMSDataRouter = require("../controllers/api/cms/whyoutclassCMSData");
const genericPagesRouter = require("../controllers/api/cms/genreicPages");
const universitiesListRouter = require("../controllers/api/cms/universitiesList");
const whyoutclassInfoCardsRouter = require("../controllers/api/cms/whyOutClassInfoCards");
const teammembersRouter = require("../controllers/api/cms/teamMembers");
const howtopayRouter = require("../controllers/api/cms/howToPay");
const faqsRouter = require("../controllers/api/cms/faqs");
const teacherCMSDataRouter = require("../controllers/api/cms/teacherPageCMSData");
const cartCMSRouter = require("../controllers/api/cms/cartCMS");
const freeVideos = require("../controllers/api/cms/freeVideos");
const freeVideosPageCMSData = require("../controllers/api/cms/freeVideosPageCMSData");
const freeVideosPageSec = require("../controllers/api/cms/freeVideosPageSec");
const subscriptionPageCms = require("../controllers/api/cms/subcriptionPageCms");
const homePageFreeVideoSec = require("../controllers/api/cms/homeFreeVideoSec");
const coursePageCmsData = require("../controllers/api/cms/allCoursesPage");
const testimonialSliderRouter = require("../controllers/api/cms/testimonials");
const popularCourseRouter = require("../controllers/api/cms/popularCourse");
const whatsNewRouter = require("../controllers/api/cms/whatsNew");
const feeRouter = require("../controllers/api/cms/fee");
const studentStatsRouter = require("../controllers/api/cms/studentStats");
const resultRouter = require("../controllers/api/cms/result");
const studyMaterialRouter = require("../controllers/api/cms/studyMaterial");
const bannerRouter = require("../controllers/api/cms/banner");
const homeMiddlePageRouter = require("../controllers/api/cms/homeMiddlePage");
const notificationRouter = require("../controllers/api/cms/notification");

//RQUIRING API ROUTERS
const authRouter = require("../controllers/api/auth");
const userRouter = require("../controllers/api/users");
const courseRouter = require("../controllers/api/courses");
const categoryRouter = require("../controllers/api/categories");
const chapterRouter = require("../controllers/api/chapters");
const lessonRouter = require("../controllers/api/lessons");
const quizRouter = require("../controllers/api/quizes");
const questionRouter = require("../controllers/api/questions");
const languageRouter = require("../controllers/api/languages");
const levelRouter = require("../controllers/api/levels");
const cartRouter = require("../controllers/api/cart");
const couponRouter = require("../controllers/api/coupons");
const ordersRouter = require("../controllers/api/orders");
const contactRouter = require("../controllers/api/contact");
const forumsRouter = require("../controllers/api/forums");
const eventsRouter = require("../controllers/api/events");
const commentsRouter = require("../controllers/api/comments");
const blogCategoryRouter = require("../controllers/api/blogCategories");
const subscriptionPlans = require("../controllers/api/subscriptionPlans");
const pricePlans = require("../controllers/api/pricePlans");
const courseFeedbacks = require("../controllers/api/courseFeedbacks");
const courseMenu = require("../controllers/api/courseMenu");
const trialRequests = require("../controllers/api/trialRequests");

const sitemap = require("../controllers/sitemap");
const robotTxt = require("../controllers/robotTxt");
module.exports = function (app) {
  //CMS Routes
  app.use("/api/cms/navbar", navbarRouter);
  app.use("/api/cms/footer_links", footerLinksRouter);

  app.use("/api/cms/footer", footerRouter);
  app.use("/api/cms/home_header_slider", homeHeaderSliderRouter);
  app.use("/api/cms/info_cards", infoCardsRouter);
  app.use("/api/cms/home_page_cms_data", homePageCMSDataRouter);
  app.use("/api/cms/student_reviews_slider", studentReviewsSliderRouter);
  app.use("/api/cms/testimonial_slider", testimonialSliderRouter);

  app.use("/api/cms/home_join", homeJoinRouter);
  app.use("/api/cms/common_site_data", commonSiteDataRouter);
  app.use("/api/cms/about_story", aboutStoryRouter);
  app.use("/api/cms/about_info_cards", aboutusInfoCardsRouter);
  app.use("/api/cms/about_us_cms_data", aboutusCMSDataRouter);
  app.use("/api/cms/stats_slider", statsSliderRouter);
  app.use("/api/cms/contact_us_info_cards", contactusInfoCardsRouter);
  app.use("/api/cms/why_out_class_list", whyoutclassListRouter);
  app.use("/api/cms/payment_methods", paymentMethodsRouter);
  app.use("/api/cms/how_to_pay_cms_data", howtopayCMSDataRouter);
  app.use("/api/cms/contact_us_cms_data", contactusCMSDataRouter);
  app.use("/api/cms/why_out_class_cms_data", whyOutClassCMSDataRouter);
  app.use("/api/cms/generic_pages", genericPagesRouter);
  app.use("/api/cms/universities_list", universitiesListRouter);
  app.use("/api/cms/why_out_class_info_cards", whyoutclassInfoCardsRouter);
  app.use("/api/cms/teacher_page_cms_data", teacherCMSDataRouter);
  app.use("/api/cms/team_members", teammembersRouter);
  app.use("/api/cms/how_to_pay", howtopayRouter);
  app.use("/api/cms/faqs", faqsRouter);
  app.use("/api/cms/cart", cartCMSRouter);
  app.use("/api/cms/free_videos_cms_data", freeVideosPageCMSData);
  app.use("/api/cms/free_videos_sec", freeVideosPageSec);
  app.use("/api/cms/free_videos", freeVideos);
  app.use("/api/cms/subscription_page_cms", subscriptionPageCms);
  app.use("/api/cms/home_page_free_sec", homePageFreeVideoSec);
  app.use("/api/cms/all_course_page", coursePageCmsData);
  app.use("/api/cms/popular_course", popularCourseRouter);
  app.use("/api/cms/whats_new", whatsNewRouter);
  app.use("/api/cms/fee", feeRouter);
  app.use("/api/cms/student_stats", studentStatsRouter);
  app.use("/api/cms/study_material", studyMaterialRouter);
  app.use("/api/cms/result", resultRouter);
  app.use("/api/cms/banner", bannerRouter);
  app.use("/api/cms/home_middle", homeMiddlePageRouter);
  app.use("/api/cms/notification", notificationRouter);

  //API Routes..
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/courses", courseRouter);
  app.use("/api/chapters", chapterRouter);
  app.use("/api/lessons", lessonRouter);
  app.use("/api/quizes", quizRouter);
  app.use("/api/questions", questionRouter);
  app.use("/api/languages", languageRouter);
  app.use("/api/levels", levelRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/coupons", couponRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/forums", forumsRouter);
  app.use("/api/events", eventsRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/blogs_categories", blogCategoryRouter);
  app.use("/api/subscription_plans", subscriptionPlans);
  app.use("/api/price_plans", pricePlans);
  app.use("/api/course_feedbacks", courseFeedbacks);
  app.use("/api/course_menu", courseMenu);
  app.use("/api/trial_requests", trialRequests);

  app.use("", sitemap);
  app.use("", robotTxt);
};
