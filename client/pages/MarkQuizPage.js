import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import renderHTML from "react-render-html";
import DashboardSideBar from "../components/DashboardSideBar";
import { getQuizWithAnswer, assignMarksToQuiz } from "../store/api/quizes";
const DashboardCourses = (props) => {
  const { answerId } = props.match.params;
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState({
    quiz: {
      name: "",
    },
    questions: [],
    answers: {},
    questionMarks: {},
    totalQuizMarks: 0,
  });
  useEffect(() => {
    dispatch(
      getQuizWithAnswer({
        id: answerId,
        onSuccess: (res) => {
          setQuizAnswer(res.data.data);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  }, []);

  const onMarksSave = () => {
    const { questionMarks, questions } = quizAnswer;
    let totalQuizMarks = 0;
    questions.forEach((q) => {
      totalQuizMarks += q.marks || 0;
    });

    let obtainedMarks = 0;
    for (let key in questionMarks) {
      obtainedMarks += parseInt(questionMarks[key]) || 0;
    }

    console.log("TOTAL MARKS => ", totalQuizMarks);
    console.log("Obtained MARKS => ", obtainedMarks);
    dispatch(
      assignMarksToQuiz({
        id: answerId,
        body: { obtainedMarks, questionMarks, totalQuizMarks },
        onSuccess: (res) => {
          alert("Marks Saved");
        },
      })
    );
  };

  const renderQuestions = () => {
    const { questions, questionMarks } = quizAnswer;
    return questions.map((q, qIndex) => {
      let marks = 0;
      if (questionMarks && questionMarks[q._id]) marks = questionMarks[q._id];
      return (
        <div className="card shadow mt-1 p-2" key={q._id}>
          <div className="clearfix">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <h3 className="mr-auto">
                <b>Q#{qIndex + 1}.</b>
              </h3>
              {user.role == "TEACHER" || user.role == "TEACHER_ASSISTANT" ? (
                <input
                  className="form-control"
                  placeholder="Marks"
                  style={{ width: "80px" }}
                  value={marks || ""}
                  onChange={(e) => {
                    const newQuizAnswer = {
                      ...quizAnswer,
                      questionMarks: { ...questionMarks },
                    };
                    newQuizAnswer.questionMarks[q._id] = e.target.value;
                    setQuizAnswer(newQuizAnswer);
                  }}
                />
              ) : (
                marks
              )}
              /{q.marks}
            </div>
          </div>
          <div>{q.name && renderHTML(q.name)}</div>
          <div>
            {q.image && (
              <img src={q.image} style={{ weight: "200px", width: "500px" }} />
            )}
          </div>
          <div>
            {q.type === "multi-choice"
              ? renderQuestionOptions(q)
              : renderQuestionWrittenAnswer(q)}
          </div>
        </div>
      );
    });
  };

  const renderQuestionOptions = (q) => {
    let selectedOptions = {};
    const { answers } = quizAnswer;
    if (answers[q._id] && answers[q._id].selectedOptions) {
      selectedOptions = answers[q._id].selectedOptions;
    }

    return (
      <table>
        <tr>
          <th>Marked</th>
          <th></th>
          <th>Correct</th>
        </tr>
        {q.options.map((o) => {
          const isSelected = selectedOptions[o.id] || false;
          return (
            <tr key={o.id}>
              <td>
                {isSelected ? (
                  <i className="fas fa-check text-success"></i>
                ) : (
                  <i className="fas fa-times text-danger"></i>
                )}
              </td>
              <td>
                <div className="my-2 ">{o.name && renderHTML(o.name)}</div>
              </td>

              <td>
                {o.isCorrect && (
                  <i className="fas fa-check text-success ml-2"></i>
                )}
              </td>
            </tr>
          );
        })}
      </table>
    );
  };

  const renderQuestionWrittenAnswer = (q) => {
    const { answers } = quizAnswer;
    let ans = "";
    if (answers[q._id]) ans = answers[q._id].writtenAnswer;

    return (
      <p>
        <b>Ans: </b>
        {ans}
      </p>
    );
  };
  return (
    <section className="dash_board">
      <div className="row m-0">
        <DashboardSideBar activeTab="assigned_courses" />
        <div className="col-lg-11  col-12">
          <div className="tab-content" id="DashboardContent">
            <div className="col-lg-11 pt-5 col-12">
              <div className="tab-content" id="DashboardContent">
                <h3>{quizAnswer.quiz.name}</h3>
                <div>{renderQuestions()}</div>

                {(user.role == "TEACHER" ||
                  user.role == "TEACHER_ASSISTANT") && (
                  <div className="text-center">
                    <button
                      className="btn btn-primary my-5"
                      onClick={onMarksSave}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardCourses;
