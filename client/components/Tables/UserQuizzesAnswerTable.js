import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
$.DataTable = require("datatables.net-bs4");

export default (props) => {
  const { quizzes = [] } = props;

  useEffect(() => {
    $("#myCourseTable").DataTable();
  }, []);

  return (
    <table
      id="myCourseTable"
      className="table table-striped table-bordered"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Marked</th>
          <th>Quiz</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((quizAns, quizIndex) => {
          return (
            <tr key={`${quizAns._id} ${quizIndex}`}>
              <th>{quizAns.quiz.name}</th>
              <th>{quizAns.markedByTeacher ? "Marked" : "Pending"}</th>
              <td>
                <Link
                  className="btn btn-secondary"
                  to={"/mark_quiz/" + quizAns._id}
                >
                  Quizzes
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
