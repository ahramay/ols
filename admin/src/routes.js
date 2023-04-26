import { lazy } from "react";
const Dashboard = lazy(() => import("./pages/Dashboard"));

//Subscription Plans
const SubscriptionsPlan = lazy(() =>
  import("./pages/subscriptionPlans/SubscriptionPlans")
);

// Course Menue
//Subscription Plans
const CourseMenu = lazy(() => import("./pages/courseMenu/courseMenu"));

//Users List
const UsersList = lazy(() => import("./pages/users/UsersList"));
const CreateUser = lazy(() => import("./pages/users/CreateUser"));
const EditUser = lazy(() => import("./pages/users/EditUser"));
//Categories
const EditCategory = lazy(() => import("./pages/categories/EditCategory"));
const CreateCategory = lazy(() => import("./pages/categories/CreateCategory"));
const CategoriesList = lazy(() => import("./pages/categories/CategoriesList"));

//Subscription Plans
const EditSubscriptionPlan = lazy(() =>
  import("./pages/subscriptionPlans/EditSubscriptionPlans")
);
const CreateSubscriptionPlan = lazy(() =>
  import("./pages/subscriptionPlans/CreateSubscriptionPlan")
);
const SubscriptionPlans = lazy(() =>
  import("./pages/subscriptionPlans/SubscriptionPlans")
);

//Price Plans
const EditPricePlan = lazy(() => import("./pages/pricePlans/EditPricePlan"));
const CreatePricePlan = lazy(() =>
  import("./pages/pricePlans/CreatePricePlan")
);

//Blog Categories
const EditBlogCategory = lazy(() =>
  import("./pages/blogCategories/EditBlogCategory")
);
const CreateBlogCategory = lazy(() =>
  import("./pages/blogCategories/CreateBlogCategory")
);
const BlogCategoriesList = lazy(() =>
  import("./pages/blogCategories/BlogCategoriesList")
);

//subscription plans.
const CourseFeedbacks = lazy(() =>
  import("./pages/courseFeedbacks/CourseFeedbacks")
);

//Languages
const EditLanguage = lazy(() => import("./pages/languages/EditLanguage"));
const CreateLanguage = lazy(() => import("./pages/languages/CreateLanguage"));
const LanguagesList = lazy(() => import("./pages/languages/LanguagesList"));

//Levels
const EditLevel = lazy(() => import("./pages/levels/EditLevel"));
const CreateLevel = lazy(() => import("./pages/levels/CreateLevel"));
const LevelsList = lazy(() => import("./pages/levels/LevelsList"));
const TrialRequests = lazy(() => import("./pages/trials/TrialRequests"));

//Coupons
const EditCoupon = lazy(() => import("./pages/coupons/EditCoupon"));
const CreateCoupon = lazy(() => import("./pages/coupons/CreateCoupon"));
const CouponsList = lazy(() => import("./pages/coupons/CouponsList"));

//Events
const EditEvent = lazy(() => import("./pages/events/EditEvent"));
const CreateEvent = lazy(() => import("./pages/events/CreateEvent"));
const EventsList = lazy(() => import("./pages/events/EventsList"));

//checkouts
const OrdersList = lazy(() => import("./pages/orders/OrdersList"));
const OrderDetail = lazy(() => import("./pages/orders/OrderDetail"));

//Courses
const CoursesList = lazy(() => import("./pages/courses/CoursesList"));
const CreateCourse = lazy(() => import("./pages/courses/CreateCourse"));
const EditCourse = lazy(() => import("./pages/courses/EditCourse"));
const ChapterDetails = lazy(() => import("./pages/courses/ChapterDetails"));
const LessonDetails = lazy(() => import("./pages/courses/LessonDetails"));
const QuizDetails = lazy(() => import("./pages/courses/QuizDetails"));
//Navbar CMS Routes
const NavbarMenus = lazy(() => import("./pages/cms/navbar/NavbarMenus"));
const CreateNavbarMenu = lazy(() =>
  import("./pages/cms/navbar/CreateNavbarMenu")
);
const EditNavbarMenu = lazy(() => import("./pages/cms/navbar/EditNavbarMenu"));

const EditFooter = lazy(() => import("./pages/cms/footer/Footer"));

//DynamicPages
const EditDynamicPage = lazy(() =>
  import("./pages/cms/dynamicPages/EditDynamicPage")
);
const CreateDynamicPage = lazy(() =>
  import("./pages/cms/dynamicPages/CreateDynamicPage")
);
const DynamicPagesList = lazy(() =>
  import("./pages/cms/dynamicPages/DynamicPagesList")
);
//commonData
const EditCommonData = lazy(() => import("./pages/cms/commonData/CommonData"));
const LoginImage = lazy(() => import("./pages/cms/commonData/LoginImage"));
const RegisterImage = lazy(() =>
  import("./pages/cms/commonData/RegisterImage")
);

///cms/common_data

//Footer Links CMS Routes
const FooterLinks = lazy(() => import("./pages/cms/footerLinks/FooterLinks"));
const CreateFooterLink = lazy(() =>
  import("./pages/cms/footerLinks/CreateFooterLink")
);
const EditFooterLink = lazy(() =>
  import("./pages/cms/footerLinks/EditFooterLink")
);

//Home Sliders
const EditHomeSlider = lazy(() =>
  import("./pages/cms/homeSliders/EditHomeSlider")
);
const CreateHomeSlider = lazy(() =>
  import("./pages/cms/homeSliders/CreateHomeSlider")
);
const HomeSliders = lazy(() => import("./pages/cms/homeSliders/HomeSliders"));

//Info Cards
const EditInfoCard = lazy(() => import("./pages/cms/infocards/EditInfoCard"));
const CreateInfoCard = lazy(() =>
  import("./pages/cms/infocards/CreateInfoCard")
);
const InfoCards = lazy(() => import("./pages/cms/infocards/InfoCards"));

//Universities

const CreateUni = lazy(() => import("./pages/cms/unis/CreateUnis"));
const Unis = lazy(() => import("./pages/cms/unis/Unis"));

//Student Reviews
const EditStudent = lazy(() => import("./pages/cms/students/EditStudent"));
const CreateStudent = lazy(() => import("./pages/cms/students/CreateStudent"));
const Students = lazy(() => import("./pages/cms/students/Students"));

//Student Reviews
const EditStat = lazy(() => import("./pages/cms/stats/EditStat"));
const CreateStat = lazy(() => import("./pages/cms/stats/CreateStat"));
const Stats = lazy(() => import("./pages/cms/stats/Stats"));

//Home Join
const HomeJoin = lazy(() => import("./pages/cms/home/HomeJoin"));
const HomeFreeVideoSec = lazy(() =>
  import("./pages/cms/home/HomeFreeVideoSec")
);

//Home Page
const HomePageCMS = lazy(() => import("./pages/cms/home/HomePage"));

//FreeVideos Page
const FreeVideosPageCMS = lazy(() =>
  import("./pages/cms/freeVideosPage/FreeVideosPageCMS")
);
const FreeVideosSec = lazy(() =>
  import("./pages/cms/freeVideosPage/FreeVideosSec")
);
//
const SubscriptionPageCms = lazy(() =>
  import("./pages/cms/subscriptionPage/SubscriptionPage")
);
//Student Testimonials

const CreateTestimonial = lazy(() =>
  import("./pages/cms/testimonial/CreateTestimonial")
);
const EditTesimonial = lazy(() =>
  import("./pages/cms/testimonial/EditTesimonial")
);
const Testimonials = lazy(() => import("./pages/cms/testimonial/Testimonials"));

// const CreateStudent = lazy(() => import("./pages/cms/students/CreateStudent"));
// const Students = lazy(() => import("./pages/cms/students/Students"));
//About Story
const AboutStory = lazy(() => import("./pages/cms/about/AboutStory"));
const AboutPageCMS = lazy(() => import("./pages/cms/about/AboutPageCMS"));

//About Info Cards
const EditAboutInfoCard = lazy(() =>
  import("./pages/cms/aboutInfoCards/EditAboutInfoCard")
);
const CreateAboutInfoCard = lazy(() =>
  import("./pages/cms/aboutInfoCards/CreateAboutInfoCard")
);
const AboutInfoCards = lazy(() =>
  import("./pages/cms/aboutInfoCards/AboutInfoCards")
);

//Team Members
const EditTeamMembers = lazy(() =>
  import("./pages/cms/teammembers/EditTeamMembers")
);
const CreateTeamMember = lazy(() =>
  import("./pages/cms/teammembers/CreateTeamMembers")
);
const TeamMembers = lazy(() => import("./pages/cms/teammembers/TeamMembers"));

//Why Outclass Page
const EditWhyPageBoard = lazy(() =>
  import("./pages/cms/whyPageBoards/EditWhyPageBoard")
);
const CreateWhyPageBoard = lazy(() =>
  import("./pages/cms/whyPageBoards/CreateWhyPageBoard")
);
const WhyPageBoards = lazy(() =>
  import("./pages/cms/whyPageBoards/WhyPageBoards")
);
const WhyOutclassPage = lazy(() =>
  import("./pages/cms/whyoutclass/WhyOutclassPage")
);

const HowToPayPage = lazy(() => import("./pages/cms/howToPay/HowToPayPage"));

//Payment Methods
const EditPM = lazy(() => import("./pages/cms/paymentMethods/EditPM"));
const CreatePM = lazy(() => import("./pages/cms/paymentMethods/CreatePM"));
const PMs = lazy(() => import("./pages/cms/paymentMethods/PMs"));

//Contact Info Cards
const EditContactInfoCard = lazy(() =>
  import("./pages/cms/contactInfo/EditInfoCard")
);
const CreateContactInfoCard = lazy(() =>
  import("./pages/cms/contactInfo/CreateInfoCard")
);
const ContactInfoCards = lazy(() =>
  import("./pages/cms/contactInfo/InfoCards")
);

//contact Page
const ContactPageCMS = lazy(() => import("./pages/cms/contact/ContactPage"));

const TeacherPage = lazy(() => import("./pages/cms/teacher/TeacherPage"));

const CartPage = lazy(() => import("./pages/cms/cart/Cart"));

const FreeVideos = lazy(() => import("./pages/cms/freeVideos/FreeVideos"));
const AddFreeVideo = lazy(() => import("./pages/cms/freeVideos/AddFreeVideo"));
const EditFreeVideo = lazy(() =>
  import("./pages/cms/freeVideos/EditFreeVideo")
);

const AllCoursesPage = lazy(() =>
  import("./pages/cms/allCourses/AllCoursesPage")
);

//Faqs
const EditFaq = lazy(() => import("./pages/cms/faqs/EditFaq"));
const CreateFaq = lazy(() => import("./pages/cms/faqs/CreateFaq"));
const Faqs = lazy(() => import("./pages/cms/faqs/Faqs"));
const Enrollments = lazy(() => import("./pages/enrollment/EnrollmentList"));
const CreateEnrollment = lazy(() =>
  import("./pages/enrollment/CreateEnrollment")
);
const CreateCategoryEnrollment = lazy(() =>
  import("./pages/enrollment/CreateCategoryEnrollment")
);

const EditEnrollment = lazy(() => import("./pages/enrollment/EditEnrollment"));

export const authenticatedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/subscription_plan", component: SubscriptionsPlan },
  { path: "/course_menu", component: CourseMenu },
  { path: "/users/add", component: CreateUser },
  { path: "/users/:id", component: EditUser },
  { path: "/users", component: UsersList },

  { path: "/blog_categories/add", component: CreateBlogCategory },
  { path: "/blog_categories/:id", component: EditBlogCategory },
  { path: "/blog_categories", component: BlogCategoriesList },

  { path: "/categories/add", component: CreateCategory },
  { path: "/categories/:id", component: EditCategory },
  { path: "/categories", component: CategoriesList },

  { path: "/subscription_plans/add", component: CreateSubscriptionPlan },
  { path: "/subscription_plans/:id", component: EditSubscriptionPlan },
  { path: "/subscription_plans", component: SubscriptionPlans },

  { path: "/price_plans/:subscriptionPlan/add", component: CreatePricePlan },
  { path: "/price_plans/:subscriptionPlan/:id", component: EditPricePlan },

  { path: "/languages/add", component: CreateLanguage },
  { path: "/languages/:id", component: EditLanguage },
  { path: "/languages", component: LanguagesList },
  { path: "/trial_requests", component: TrialRequests },
  { path: "/levels/add", component: CreateLevel },
  { path: "/levels/:id", component: EditLevel },
  { path: "/levels", component: LevelsList },

  { path: "/coupons/add", component: CreateCoupon },
  { path: "/coupons/:id", component: EditCoupon },
  { path: "/coupons", component: CouponsList },

  { path: "/events/add", component: CreateEvent },
  { path: "/events/:id", component: EditEvent },
  { path: "/events", component: EventsList },

  {
    path: "/orders/:id",
    component: OrderDetail,
  },
  {
    path: "/orders",
    component: OrdersList,
  },
  { path: "/courses/chapters/lessons/quiz/:id", component: QuizDetails },
  { path: "/courses/chapters/lessons/:id", component: LessonDetails },
  { path: "/courses/chapters/:id", component: ChapterDetails },
  { path: "/courses/add", component: CreateCourse },
  { path: "/courses/:id", component: EditCourse },
  { path: "/courses", component: CoursesList },

  {
    path: "/enrollments/add",
    component: CreateEnrollment,
  },
  {
    path: "/enrollments/category_enrollment",
    component: CreateCategoryEnrollment,
  },
  {
    path: "/enrollments/:id",
    component: EditEnrollment,
  },
  { path: "/enrollments", component: Enrollments },

  { path: "/cms/navbar/add", component: CreateNavbarMenu },
  { path: "/cms/navbar/:id", component: EditNavbarMenu },
  { path: "/cms/navbar", component: NavbarMenus },

  ////dynamic pages
  { path: "/cms/dynamic_pages/add", component: CreateDynamicPage },
  { path: "/cms/dynamic_pages/:id", component: EditDynamicPage },
  { path: "/cms/dynamic_pages", component: DynamicPagesList },

  //footer
  { path: "/cms/footer", component: EditFooter },

  //footer links
  { path: "/cms/footer_links/add", component: CreateFooterLink },
  { path: "/cms/footer_links/:id", component: EditFooterLink },
  { path: "/cms/footer_links", component: FooterLinks },

  //commmon data
  { path: "/cms/common_data", component: EditCommonData },

  //home sliders
  { path: "/cms/home_sliders/add", component: CreateHomeSlider },
  { path: "/cms/home_sliders/:id", component: EditHomeSlider },
  { path: "/cms/home_sliders", component: HomeSliders },

  //Info Cards
  { path: "/cms/info_cards/add", component: CreateInfoCard },
  { path: "/cms/info_cards/:id", component: EditInfoCard },
  { path: "/cms/info_cards", component: InfoCards },

  //Universities
  { path: "/cms/universities/add", component: CreateUni },
  { path: "/cms/universities", component: Unis },

  //students
  { path: "/cms/student_reviews/add", component: CreateStudent },
  { path: "/cms/student_reviews/:id", component: EditStudent },
  { path: "/cms/student_reviews", component: Students },

  //Stats
  { path: "/cms/stats/add", component: CreateStat },
  { path: "/cms/stats/:id", component: EditStat },
  { path: "/cms/stats", component: Stats },

  {
    path: "/cms/home_free_video_section",
    component: HomeFreeVideoSec,
  },
  //home Join
  {
    path: "/cms/home_join_section",
    component: HomeJoin,
  },

  //home_page_cms
  {
    path: "/cms/home_page",
    component: HomePageCMS,
  },

  {
    path: "/cms/freevideos_sec",
    component: FreeVideosSec,
  },
  {
    path: "/cms/freevideos_page",
    component: FreeVideosPageCMS,
  },

  {
    path: "/cms/subscription_page",
    component: SubscriptionPageCms,
  },
  {
    path: "/cms/about_page_cms",
    component: AboutPageCMS,
  },
  ///about page story section
  {
    path: "/cms/about_story_section",
    component: AboutStory,
  },

  //About Info Cards
  { path: "/cms/about_info_cards/add", component: CreateAboutInfoCard },
  { path: "/cms/about_info_cards/:id", component: EditAboutInfoCard },
  { path: "/cms/about_info_cards", component: AboutInfoCards },

  //Team Members
  { path: "/cms/team_members/add", component: CreateTeamMember },
  { path: "/cms/team_members/:id", component: EditTeamMembers },
  { path: "/cms/team_members", component: TeamMembers },

  //Why Page Boards
  { path: "/cms/why_page_boards/add", component: CreateWhyPageBoard },
  { path: "/cms/why_page_boards/:id", component: EditWhyPageBoard },
  { path: "/cms/why_page_boards", component: WhyPageBoards },
  //Why Page
  {
    path: "/cms/why_outclass_page",
    component: WhyOutclassPage,
  },
  //HowToPayPage
  { path: "/cms/how_to_pay", component: HowToPayPage },

  // Payment Methods
  { path: "/cms/payment_methods/add", component: CreatePM },
  { path: "/cms/payment_methods/:id", component: EditPM },
  { path: "/cms/payment_methods", component: PMs },

  // Payment Methods
  { path: "/cms/contact_info_cards/add", component: CreateContactInfoCard },
  { path: "/cms/contact_info_cards/:id", component: EditContactInfoCard },
  { path: "/cms/contact_info_cards", component: ContactInfoCards },

  {
    path: "/cms/contact_page",
    component: ContactPageCMS,
  },

  {
    path: "/cms/cart",
    component: CartPage,
  },
  //Outclass Videos
  { path: "/cms/free_videos/add", component: AddFreeVideo },
  { path: "/cms/free_videos/:id", component: EditFreeVideo },
  { path: "/cms/free_videos", component: FreeVideos },

  // Faqs
  { path: "/cms/faqs/add", component: CreateFaq },
  { path: "/cms/faqs/:id", component: EditFaq },
  { path: "/cms/faqs", component: Faqs },

  {
    path: "/cms/login_image",
    component: LoginImage,
  },

  {
    path: "/cms/register_image",
    component: RegisterImage,
  },

  {
    path: "/cms/teacher_page",
    component: TeacherPage,
  },
  {
    path: "/cms/all_courses_page",
    component: AllCoursesPage,
  },

  {
    path: "/course_feedbacks",
    component: CourseFeedbacks,
  },
  //Testimonials

  { path: "/cms/testimonial/add", component: CreateTestimonial },
  { path: "/cms/testimonial/:id", component: EditTesimonial },
  { path: "/cms/testimonials", component: Testimonials },
];
