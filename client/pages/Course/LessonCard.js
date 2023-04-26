import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import play_free from "../../assets/img/play_free.png";
import { getLesson } from "../../store/api/lessons";
import VideoLesson from "./VideoLesson";
import QuizBoard from "./QuizBoard";
import {
  setCurrentQuiz,
  resetCurrentQuiz,
} from "../../store/entities/currentQuiz";

export default (props) => {
  const { lessonId, courseId, moveToPrevLesson, moveToNextLesson, setWatched } =
    props;

  const dispatch = useDispatch();

  const [currentLesson, setCurrentLesson] = useState({
    name: "",
    type: "",
    canShow: false,
    accessibility: false,
  });
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    dispatch(
      getLesson({
        id: lessonId,
        onSuccess: (res) => {
          setCurrentLesson(res.data.data);
          if (res.data.data.type === "quiz") {
            dispatch(setCurrentQuiz(res.data.data.quizzes[0]));
          }
        },
        onError: (err) => {},
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  }, [lessonId]);

  const renderLoader = () => {
    return (
      <div
        style={{
          width: "100%",
          height: "390px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Loader />
      </div>
    );
  };

  const [quizEnded, setQuizEnded] = useState(false);
  return (
    <div className="lesson-wrapper">
      {showLoader ? (
        renderLoader()
      ) : (
        <>
          {currentLesson.canShow ? (
            <>
              <div className="row">
                <div className="col-md-9">
                  {currentLesson.type !== "quiz" && (
                    <h2>{currentLesson.name}</h2>
                  )}
                </div>
                <div className="col-md-3 justify-content-end">
                  {currentLesson.accessibility &&
                    currentLesson.accessibility === "free" && (
                      <img className="float-right" src={play_free} />
                    )}
                </div>
              </div>

              <div>
                {currentLesson.type === "video" && (
                  <>
                    <VideoLesson
                      currentLesson={currentLesson}
                      courseId={courseId}
                      lessonId={currentLesson._id}
                      moveToNextLesson={moveToNextLesson}
                      moveToPrevLesson={moveToPrevLesson}
                      setWatched={setWatched}
                    />
                  </>
                )}

                {currentLesson.type === "quiz" && !quizEnded && (
                  <div className="card">
                    <QuizBoard
                      courseId={courseId}
                      lessonId={lessonId}
                      onComplete={() => {
                        setQuizEnded(true);
                      }}
                    />
                  </div>
                )}

                {currentLesson.type === "quiz" && quizEnded && (
                  <div classNam="my-5 py-5">
                    <h3 className="text-center my-5 py-5">Quiz Ended</h3>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="my-5">
              <h1 className="py-5">
                You need to Enroll in this course to view this lesson
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};
