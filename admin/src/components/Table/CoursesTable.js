import React, { Component } from "react";
import ReactDOM from "react-dom";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { deleteCourse } from "../../store/api/courses";
import { basePath } from "../../configs";
$.DataTable = require("datatables.net-bs4");

class UserTable extends Component {
  state = {
    loading: false,
  };
  componentDidMount = () => {
    const { token } = this.props;
    $("#userTable").DataTable({
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
        url: apiPath + "/courses/all_courses_list",
        type: "GET",
        headers: { "x-auth-token": token },
      },

      columns: [
        { data: "name" },
        { data: "category" },
        { data: "published" },
        { data: "buyCount" },
        { data: "_id" },
      ],

      columnDefs: [
        {
          targets: 1,
          createdCell: this.renderCategoryCell,
        },
        { targets: 2, createdCell: this.renderPublishedCell },
        {
          targets: 4,
          createdCell: this.renderLinkButtons,
        },
      ],
    });
  };

  renderCategoryCell = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(<div>{cellData.name}</div>, td);
  };

  renderPublishedCell = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>
        <span className="ml-1">
          <i
            className={
              cellData != true
                ? "fa fa-times text-danger"
                : "fas fa-check text-success"
            }
          ></i>
        </span>
      </div>,
      td
    );
  };

  renderLinkButtons = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>
        <button
          className="btn btn-danger btn-sm float-right"
          onClick={() => {
            this.deleteCourse(rowData._id, td);
          }}
        >
          <i className="fa fa-trash-alt"></i>
        </button>

        <button
          className="btn btn-primary btn-sm mr-2 float-right"
          onClick={() => {
            this.navigateToEditCourse(rowData._id);
          }}
        >
          <i className="fa fa-pencil-alt"></i>
        </button>
      </div>,
      td
    );
  };

  deleteCourse = (id, td) => {
    var consent = window.confirm("Are you sure you want to delete?");
    if (!consent) return;

    this.props.deleteCourse({
      id,
      onSuccess: () => {
        td.parentNode.style.display = "none";
      },
    });
  };
  navigateToEditCourse = (_id) => {
    this.props.history.push(basePath + "/courses/" + _id);
  };
  render() {
    const { loading } = this.state;
    return (
      <div style={{ position: "relative" }}>
        <table id="userTable" className="w-100 table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Published</th>
              <th>Sales</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
        {loading && (
          <div
            className="pt-5"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <h1 className="text-white text-center ">Generating Session</h1>
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCourse: (params) => dispatch(deleteCourse(params)),
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
