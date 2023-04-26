import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DashboardSideBar from "../components/DashboardSideBar";

import loadable from "@loadable/component";

import { loadMyCourses } from "../store/api/courses";

const MyCoursesTable = loadable(
  () => import("../components/Tables/MyCoursesTable"),
  {
    ssr: false,
  }
);

const DashboardCourses = (props) => {
  const dispatch = useDispatch();

  const [coursesList, setCoursesList] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    setShowLoader(true);
    dispatch(
      loadMyCourses({
        onSuccess: (res) => {
          setCoursesList(res.data.data);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  }, []);
  return (
    <section className="dash_board">
      <div className="row m-0">
        <DashboardSideBar activeTab="quizzes" />
        <div className="col-lg-11  col-12">
          <div className="tab-content" id="DashboardContent">
            <div className="col-lg-11 pt-5 col-12">
              <div className="tab-content" id="DashboardContent">
                {!showLoader && <MyCoursesTable courses={coursesList} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardCourses;
