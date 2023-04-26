import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionCard from "./QuestionCard";
import {
  startQuiz,
  setCurrentQuestion,
  resetCurrentQuiz,
} from "../../store/entities/currentQuiz";
import { answerQuiz } from "../../store/api/quizes";
import renderHTML from "react-render-html";

export default (props) => {
  const { onComplete } = props;
  const dispatch = useDispatch();
  const currentQuiz = useSelector((state) => state.entities.currentQuiz);
  const token = useSelector((state) => state.auth.token);

  const {
    quiz: { questions },
    started,
    currentQuestion,
  } = currentQuiz;

  const [quizAnswers, setQuizAnswers] = useState({});

  const [showAnswerSheet, setShowAnswerSheet] = useState(false);

  const onNextQuestion = (answer, questionId) => {
    const newQuizAns = { ...quizAnswers };
    newQuizAns[questionId] = answer;
    setQuizAnswers(newQuizAns);

    const nextIndex = currentQuiz.currentQuestion + 1;

    if (!questions[nextIndex]) {
      // console.log("Quiz answers => ", newQuizAns);
      if (token)
        dispatch(answerQuiz({ id: currentQuiz.quiz._id, body: newQuizAns }));

      setShowAnswerSheet(true);
      // dispatch(resetCurrentQuiz());
      // if (onComplete) onComplete();
    } else {
      dispatch(setCurrentQuestion(nextIndex));
    }
  };
  const renderQuestions = () => {
    const question = questions[currentQuestion];
    return (
      <>
        {question ? (
          <QuestionCard
            question={question}
            number={currentQuestion + 1}
            onNext={(answer) => onNextQuestion(answer, question._id)}
            isLast={questions.length === currentQuestion + 1}
          />
        ) : null}
      </>
    );
  };

  const renderStartQuiz = () => {
    return (
      <div className="text-center py-5">
        <div className="btn-group">
          <button className="btn btn-danger" onClick={onComplete}>
            Skip Quiz
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              dispatch(setCurrentQuestion(currentQuestion + 1));
              dispatch(startQuiz(true));
            }}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  };

  const isCorrect = (q) => {
    const thisQsAns = quizAnswers[q._id];
    if (!thisQsAns) return false;

    for (let i = 0; i < q.options.length; ++i) {
      if (q.options[i]) {
        console.log("QuestionOption", q.options[i]);
        console.log("answer option ", thisQsAns);

        if (
          q.options[i].isCorrect !== thisQsAns.selectedOptions[q.options[i].id]
        )
          return false;
      }
    }

    return true;
  };
  const renderAnswerSheet = () => {
    return (
      <div>
        <h3 className="text-center my-4">Answer Sheet</h3>
        {questions.map((qu) => {
          let isAnsCorrect = false;
          if (qu.type !== "writable") {
            isAnsCorrect = isCorrect(qu);
          }

          let qDivWrapperClass =
            "question-card rounded mb-2 p-3 " +
            (isAnsCorrect && qu.type !== "writable"
              ? "border border-success"
              : "border border-danger");

          if (qu.type == "writable") {
            qDivWrapperClass =
              "question-card rounded mb-2 p-3 border border-primary";
          }

          let marksObtained = isAnsCorrect ? qu.marks : 0;
          return (
            <div
              key={qu._id}
              className={qDivWrapperClass}
              style={{ backgroundColor: "#fafafa", position: "relative" }}
            >
              <span style={{ position: "absolute", top: 2, right: 2 }}>
                {qu.type !== "writable"
                  ? `Marks: ${marksObtained}/${qu.marks}`
                  : `Marks: Checking Pending`}
              </span>
              <div>{renderHTML(qu.name)}</div>
              {qu.image && (
                <img
                  src={qu.image}
                  style={{ weight: "200px", width: "500px" }}
                />
              )}
              <div>
                {qu.options.map((qo) => {
                  return (
                    <div
                      className="row no-gutters"
                      style={{ maxWidth: "300px" }}
                    >
                      <div className="col">{renderHTML(qo.name)}</div>
                      {qo.isCorrect && (
                        <div claassName="col-2">
                          <i className="fas fa-check text-success"></i>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {qu.reference && <div>{renderHTML(qu.reference)}</div>}
            </div>
          );
        })}

        <div className="clearfix">
          <button
            className="btn btn-primary float-right"
            onClick={() => {
              setShowAnswerSheet(false);
              dispatch(resetCurrentQuiz());
              if (onComplete) onComplete();
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="p-3 rounded bg-white">
      <h1>Quiz: {currentQuiz.quiz.name}</h1>
      {!started && renderStartQuiz()}
      {started && !showAnswerSheet && renderQuestions()}

      {showAnswerSheet && renderAnswerSheet()}
    </div>
  );
};
