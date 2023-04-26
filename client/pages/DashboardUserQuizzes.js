import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import DashboardSideBar from "../components/DashboardSideBar";
import loadable from "@loadable/component";
import { getCourseQuizes } from "../store/api/quizes";

const QuizzesTable = loadable(
  () => import("../components/Tables/UserQuizzesAnswerTable"),
  {
    ssr: false,
  }
);

const DashboardCourses = (props) => {
  const { courseId } = props.match.params;

  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => {
    dispatch(
      getCourseQuizes({
        id: courseId,
        onSuccess: (res) => {
          setQuizAnswers(res.data.data);
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
                  <QuizzesTable quizzes={quizAnswers} />
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
