import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { useSelector } from "react-redux";
$.DataTable = require("datatables.net-bs4");

export default (props) => {
  const user = useSelector((state) => state.auth.user);
  const { courses = [] } = props;

  useEffect(() => {
    $("#teacherCoursesTable").DataTable();
  });

  return (
    <table
      id="teacherCoursesTable"
      className="table table-striped table-bordered"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          {user.role === "TEACHER" && <th>Buy Count</th>}
          <th>Quizzes</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, courseIndex) => {
          return (
            <tr key={`${course._id} ${courseIndex}`}>
              <td>{course.name}</td>
              <td>{course.category.name}</td>
              {user.role === "TEACHER" && <td>{course.buyCount}</td>}
              <td>
                <Link
                  className="btn btn-primary"
                  to={"/dashboard/quizzes/" + course._id}
                >
                  Quizes
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
