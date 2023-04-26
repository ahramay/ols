import React, { useState, useEffect } from "react";
import renderHTML from "react-render-html";
import Toggle from "../../components/Toggle";

let timer = null;
let interval = null;
export default (props) => {
  const { question, number, onNext, isLast = false } = props;
  //managing timer

  const [secondsAvailable, setSecondsAvailable] = useState(0);
  useEffect(() => {
    if (timer) clearTimeout(timer);
    if (interval) clearInterval(interval);

    /// reseting
    setWritenAnswer("");
    setOptionsMap([]);
    if (question.allowedTime) {
      const availabletime = timeToSeconds(question.allowedTime);

      setSecondsAvailable(availabletime);
      timer = setTimeout(() => {
        const answer = { writtenAnswer, selectedOptions: optionsMap };
        if (timer) clearTimeout(timer);
        if (interval) clearInterval(interval);
        if (onNext) onNext(answer);
      }, (availabletime + 1) * 1000);

      let count = 0;
      interval = setInterval(() => {
        ++count;
        const left = availabletime - count;
        if (left >= 0) setSecondsAvailable(left);
      }, 1000);
    }
  }, [question]);
  let correctCount = 0;
  if (question.type !== "writable") {
    question.options.forEach((op) => {
      if (op.isCorrect) ++correctCount;
    });
  }
  const renderQuestion = () => {
    return (
      <>
        <div className="clearfix">
          <h5 className="float-left">Question {number}</h5>
          {question.allowedTime && (
            <span className="badge badge-danger float-right">
              {secondsToTime(secondsAvailable)}
            </span>
          )}
        </div>
        {question.name && renderHTML(question.name)}
        {question.image && (
          <img
            src={question.image}
            style={{ weight: "200px", width: "500px" }}
          />
        )}
      </>
    );
  };
  const [optionsMap, setOptionsMap] = useState({});

  useEffect(() => {
    const optMap = {};
    if (question.type !== "writable") {
      (question.options || []).forEach((opt) => {
        optMap[opt.id] = false;
      });

      setOptionsMap(optMap);
    }
  }, [question.options]);

  const renderOptions = () => {
    return (
      <div>
        {question.options.map((op) => {
          return (
            <div
              key={op.id + op.name}
              style={{
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
              }}
              className="mb-2"
            >
              <div>
                <Toggle
                  checked={optionsMap[op.id]}
                  onChange={(checked) => {
                    const newOptMap = { ...optionsMap };
                    if (correctCount == 1) {
                      for (let key in newOptMap) newOptMap[key] = false;
                    }
                    newOptMap[op.id] = checked;
                    setOptionsMap(newOptMap);
                    console.log("OPT MAPPP =>>>", newOptMap);
                  }}
                />
              </div>
              <div className="ml-2">{renderHTML(op.name)}</div>
            </div>
          );
        })}
      </div>
    );
  };
  const [writtenAnswer, setWritenAnswer] = useState("");
  const renderWritable = () => {
    return (
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          rows="7"
          placeholder="Write Answer"
          value={writtenAnswer}
          onChange={(e) => {
            setWritenAnswer(e.target.value);
          }}
        ></textarea>
      </div>
    );
  };

  return (
    <div
      className="question-card rounded mb-2 p-3"
      style={{ backgroundColor: "#fafafa" }}
    >
      {renderQuestion()}
      {question.type === "writable" ? renderWritable() : renderOptions()}

      <div className="clearfix">
        <button
          className="btn btn-primary float-right"
          onClick={() => {
            const answer = { writtenAnswer, selectedOptions: optionsMap };
            if (onNext) {
              if (timer) clearTimeout(timer);
              if (interval) clearInterval(interval);
              onNext(answer);
            }
          }}
        >
          {!isLast ? (
            <>
              Next <i className="ml-1 fa fa-chevron-right"></i>
            </>
          ) : (
            "Done"
          )}
        </button>
        <button
          className="btn btn-secondary mr-1 float-right"
          onClick={() => {
            const answer = { writtenAnswer: "", selectedOptions: {} };
            if (onNext) {
              if (timer) clearTimeout(timer);
              if (interval) clearInterval(interval);
              onNext(answer);
            }
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
};

function timeToSeconds(hms) {
  // var hms = "02:04:33"; // your input string
  var a = hms.split(":"); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  return seconds;
}

const secondsToTime = (seconds = 0) => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};
