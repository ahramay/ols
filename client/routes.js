import loadable from "@loadable/component";

import App from "./App";
import requireAuth from "./hocs/requireAuth";
const Home = loadable(() => import("./pages/Home"), { ssr: true });
const About = loadable(() => import("./pages/About"), { ssr: true });
const Contact = loadable(() => import("./pages/Contact"), { ssr: true });
const HowToPay = loadable(() => import("./pages/HowToPay"), { ssr: true });
const WhyOutClass = loadable(() => import("./pages/WhyOutClass"), {
  ssr: true,
});

const DynamicPage = loadable(() => import("./pages/DynamicPage"), {
  ssr: true,
});

const VerifyEmail = loadable(() => import("./pages/VerifyEmail"), {
  ssr: true,
});

const ResetPassword = loadable(() => import("./pages/ResetPassword"), {
  ssr: true,
});

const CoursePage = loadable(() => import("./pages/CoursePage"), {
  ssr: true,
});

const MyOrders = loadable(() => import("./pages/MyOrders"), {
  ssr: true,
});

const OrderDetails = loadable(() => import("./pages/OrderDetails"), {
  ssr: true,
});

const Cart = loadable(() => import("./pages/Cart"), {
  ssr: true,
});

const Events = loadable(() => import("./pages/Events"), { ssr: true });
const Faqs = loadable(() => import("./pages/Faqs"), { ssr: true });
const AllCourses = loadable(() => import("./pages/AllCourses"), { ssr: true });

const StatPage = loadable(() => import("./pages/StatPage"), {
  ssr: true,
});

const BlogPage = loadable(() => import("./pages/Blogs"), {
  ssr: true,
});

const OurTeachers = loadable(() => import("./pages/OurTeachers"), {
  ssr: true,
});
const SearchCourse = loadable(() => import("./pages/SearchCourse"), {
  ssr: true,
});

const LoginPage = loadable(() => import("./pages/LoginPage"), {
  ssr: true,
});

const RegisterPage = loadable(() => import("./pages/RegisterPage"), {
  ssr: false,
});

const DashboardPage = loadable(() => import("./pages/DashboardPage"), {
  ssr: true,
});

const DashboardCourses = loadable(() => import("./pages/DashboardCourses"), {
  ssr: true,
});

const DashboardAssignedCourses = loadable(
  () => import("./pages/DashboardAssignedCourses"),
  {
    ssr: true,
  }
);

const DashboardTeacherQuizzes = loadable(
  () => import("./pages/DashboardTeacherQuizzes"),
  {
    ssr: true,
  }
);

const MarkQuizPage = loadable(() => import("./pages/MarkQuizPage"), {
  ssr: true,
});

const DashboardQuizCourses = loadable(
  () => import("./pages/DashboardQuizCoursesTable"),
  {
    ssr: true,
  }
);

const DashboardUserQuizzes = loadable(
  () => import("./pages/DashboardUserQuizzes"),
  {
    ssr: true,
  }
);
const FreeVideos = loadable(() => import("./pages/FreeVideos"), {
  ssr: true,
});

const Subscription = loadable(() => import("./pages/Subscription"), {
  ssr: true,
});

const ForumPage = loadable(() => import("./pages/ForumPage"), { ssr: true });

const NotFound = loadable(() => import("./pages/NotFound"), { ssr: true });

export default [
  {
    path: "/login",
    component: LoginPage,
  },

  {
    path: "/register",
    component: RegisterPage,
  },
  {
    component: App,
    routes: [
      {
        path: "/about-us",
        component: About,
      },
      {
        path: "/contact-us",
        exact: true,
        component: Contact,
      },
      {
        path: "/how-to-pay",
        exact: true,
        component: HowToPay,
      },
      {
        path: "/events",
        exact: true,
        component: Events,
      },

      {
        path: "/my-orders/:orderId",
        component: OrderDetails,
      },
      {
        path: "/my-orders",
        component: MyOrders,
      },
      {
        path: "/blogs/:categoryId?",
        component: BlogPage,
      },
      {
        path: "/faqs",
        component: Faqs,
      },
      {
        path: "/cart",
        exact: true,
        component: Cart,
      },
      {
        path: "/search/:search",
        component: SearchCourse,
      },
      {
        path: "/why-out-class",
        exact: true,
        component: WhyOutClass,
      },
      {
        path: "/verify-email",
        exact: true,
        component: VerifyEmail,
      },
      {
        path: "/all-courses/:category?",
        component: AllCourses,
      },
      {
        path: "/reset-password",
        exact: true,
        component: ResetPassword,
      },
      { path: "/course/:courseId/:lessonId", component: CoursePage },
      { path: "/course/:courseId", component: CoursePage },
      { path: "/our-teachers", component: OurTeachers },
      {
        path: "/dashboard/assigned_courses",
        component: DashboardAssignedCourses,
      },
      {
        path: "/dashboard/quiz_stat/:courseId",
        component: StatPage,
      },
      {
        path: "/dashboard/my_courses",
        component: DashboardQuizCourses,
      },
      {
        path: "/dashboard/course_quizzes/:courseId",
        component: DashboardUserQuizzes,
      },
      {
        path: "/dashboard/quizzes/:courseId",
        component: DashboardTeacherQuizzes,
      },

      {
        path: "/mark_quiz/:answerId",
        component: MarkQuizPage,
      },
      {
        path: "/dashboard/courses",
        component: DashboardCourses,
      },
      {
        path: "/dashboard",
        component: DashboardPage,
      },
      {
        path: "/forum/:threadId",
        component: ForumPage,
      },
      {
        path: "/page/:slugIdentifier",
        component: DynamicPage,
      },

      {
        path: "/",
        exact: true,
        component: Home,
      },
      {
        path: "/free-videos",
        exact: true,
        component: FreeVideos,
      },

      {
        path: '/subscription/:category?',
        exact: true,
        component : Subscription
      },

      {
        component: NotFound,
      },
    ],
  },
];
