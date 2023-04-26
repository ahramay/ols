import React, { useEffect } from "react";
import loadable from "@loadable/component";
import { useDispatch, useSelector } from "react-redux";
import { renderRoutes } from "react-router-config";

import Footer from "./components/Footer";
import BackToTopButton from "./shared/BackToTopButton";

// loadCat;
import { loadCategories } from "./store/api/categories";
import { loadCourses, loadLastActivities } from "./store/api/courses";
import { loadSubscriptionPlans } from "./store/api/subscriptionPlans";
import { loadCourseMenu } from "./store/api/courseMenu";

import { getMe } from "./store/api/auth";
import { getMyCart } from "./store/api/cart";
import { getNavbarMenus } from "./store/api/navbar";
import { getFooterMenus } from "./store/api/footerLinks";
import { loadFooter } from "./store/api/footer";
import { loadCommonData } from "./store/api/commonData";
import { getFreeVideosImageSec } from "./store/api/subscriptionPageCms";
import { setTrialModalVisibility } from "./store/ui/trialModal";

import ScrollToTop from "./hocs/ScrollToTop";

const NavBar = loadable(() => import("./components/NavBar"), { ssr: false });
const LoginModal = loadable(() => import("./components/modals/LoginModal"), {
  ssr: false,
});

const RegisterModal = loadable(
  () => import("./components/modals/RegisterModal"),
  {
    ssr: false,
  }
);
const SubscriptionModal = loadable(
  () => import("./components/modals/SubscriptionModal"),
  {
    ssr: false,
  }
);

const TrialModal = loadable(() => import("./components/modals/TrialModal"), {
  ssr: false,
});
const ToastContainerWrapper = loadable(
  () => import("./components/ToastContainerWrapper"),
  {
    ssr: false,
  }
);

const App = (props) => {
  const { route } = props;
  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authToken) {
      //authenticated tasks
      dispatch(getMe());
      dispatch(getMyCart());
      // dispatch(loadLastActivities());
    }
    dispatch(getFooterMenus());
    dispatch(getNavbarMenus());
    dispatch(loadCategories());
    dispatch(loadCourses());
    dispatch(loadFooter());
    dispatch(loadCommonData());
    dispatch(loadSubscriptionPlans());
    dispatch(getFreeVideosImageSec());
    dispatch(loadCourseMenu());
  }, []);
  return (
    <>
      <ToastContainerWrapper />
      <ScrollToTop />
      <NavBar history={props.history} />
      <LoginModal />
      <RegisterModal />
      <div>{renderRoutes(route.routes)}</div>
      <SubscriptionModal />
      <TrialModal />
      <Footer />
      <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 10 }}>
        <button
          className="btn more"
          style={{
            margin: 0,
            width: "160px",
            fontSize: "16px",
            padding: "9px 13px",
            borderRadius: "8px",
          }}
          onClick={(e) => {
            dispatch(setTrialModalVisibility(true));
          }}
        >
          Start your free trial now.
        </button>
      </div>
      <BackToTopButton />
    </>
  );
};

App.loadData = ({ store }) => {
  const { token } = store.getState().auth;
  const { dispatch } = store;
  const promiseArray = [];
  promiseArray.push(dispatch(loadCategories()));
  promiseArray.push(dispatch(loadSubscriptionPlans()));
  promiseArray.push(dispatch(loadCourseMenu()));
  if (token) {
    promiseArray.push(dispatch(getMe()));
    promiseArray.push(dispatch(loadLastActivities()));
  }
  return Promise.all(promiseArray);
};

export default App;
