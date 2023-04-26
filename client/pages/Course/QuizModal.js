import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Loader from "../../components/Loader";

import QuizBoard from "./QuizBoard";

import { useSelector } from "react-redux";
//redux actions
import { setQuizModalVisibility } from "../../store/ui/quizModal";

function QuizModal(props) {
  const quizModal = useSelector((state) => state.ui.quizModal);
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  const onQuizDone = () => {
    const { onComplete } = props;
    if (onComplete) onComplete();
  };

  return (
    <Modal show={quizModal.visible}>
      {/* <button className="btn btn-success" onClick={onQuizDone}>
        Skip
      </button> */}
      <QuizBoard onComplete={onQuizDone} />
    </Modal>
  );
}

export default QuizModal;
