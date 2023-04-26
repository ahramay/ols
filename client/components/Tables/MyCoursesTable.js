import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
$.DataTable = require("datatables.net-bs4");

export default (props) => {
  const { courses } = props;

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
          <th>Category</th>
          <th>Stats</th>
          <th>Quizzes</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, courseIndex) => {
          return (
            <tr key={`${course._id} ${courseIndex}`}>
              <th>{course.name}</th>
              <th>{course.category.name}</th>
              <th>
                <Link
                  className="btn btn-primary"
                  to={"/dashboard/quiz_stat/" + course._id}
                >
                  Stats
                </Link>
              </th>
              <td>
                <Link
                  className="btn btn-secondary"
                  to={"/dashboard/course_quizzes/" + course._id}
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
