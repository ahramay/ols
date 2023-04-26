import React, { Component } from "react";
import ReactDOM from "react-dom";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { handleErrors } from "../../helpers/error";
import { basePath } from "../../configs";
$.DataTable = require("datatables.net-bs4");

class QuizTable extends Component {
  componentDidMount = () => {
    const { token, courseId } = this.props;
    $("#QuizAssignedTable").DataTable({
      language: {
        paginate: {
          next:
            '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
          previous:
            '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
        },
      },
      processing: true,
      serverSide: true,
      order: [[0, "_id"]],
      ajax: {
        url: apiPath + "/quizes/teacher_courses_quizzes/" + courseId,
        type: "GET",
        headers: { "x-auth-token": token },
      },
      columns: [
        { data: "_id" },
        { data: "_id" },
        { data: "markedByTeacher" },
        { data: "_id" },
      ],
      columnDefs: [
        {
          targets: 0,
          createdCell: this.renderQuizName,
        },
        {
          targets: 1,
          createdCell: this.renderCourseColumn,
        },
        {
          targets: 3,
          createdCell: this.renderActionsColumn,
        },
      ],
    });
  };

  navigateToMarkQuiz = (_id) => {
    this.props.history.push("/mark_quiz/" + _id);
  };

  renderQuizName = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(<div>{rowData.quiz.name}</div>, td);
  };

  renderCourseColumn = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(<div>{rowData.course.name}</div>, td);
  };

  renderActionsColumn = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            this.navigateToMarkQuiz(rowData._id);
          }}
        >
          <i className="fa fa-clipboard"></i>
        </button>
      </div>,
      td
    );
  };

  render() {
    return (
      <table id="QuizAssignedTable" className="w-100 table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Marked</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(QuizTable);
