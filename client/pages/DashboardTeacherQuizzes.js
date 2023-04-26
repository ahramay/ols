import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import DashboardSideBar from "../components/DashboardSideBar";
import loadable from "@loadable/component";
import { loadCoursesAssignedToTeacher } from "../store/api/courses";

const QuizzesTable = loadable(
  () => import("../components/Tables/QuizAssignedTable"),
  {
    ssr: false,
  }
);

const DashboardCourses = (props) => {
  const { courseId } = props.match.params;

  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    dispatch(
      loadCoursesAssignedToTeacher({
        onSuccess: (res) => {
          setCourses(res.data.data);
        },
      })
    );
  }, []);

  return (
    <section className="dash_board">
      <div className="row m-0">
        <DashboardSideBar activeTab="assigned_courses" />
        <div className="col-lg-11  col-12">
          <div className="tab-content" id="DashboardContent">
            <div className="col-lg-11 pt-5 col-12">
              <div className="tab-content" id="DashboardContent">
                <h3>Quizzes</h3>
                <div>
                  <QuizzesTable courseId={courseId} history={props.history} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardCourses;
