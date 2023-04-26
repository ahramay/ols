import React, { Component } from "react";
import ReactDOM from "react-dom";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { deleteUser } from "../../store/api/users";
import { createSession } from "../../store/api/auth";
import { handleErrors } from "../../helpers/error";
import { basePath } from "../../configs";
import moment from "moment";

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
          next: '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
          previous:
            '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
        },
      },
      processing: true,
      serverSide: true,
      order: [[0, "_id"]],

      ajax: {
        url: apiPath + "/users",
        type: "GET",
        headers: { "x-auth-token": token },
      },

      columns: [
        { data: "_id" },
        { data: "firstName" },
        { data: "lastName" },
        { data: "school" },
        { data: "dateOfBirth" },
        { data: "role" },
        { data: "phoneNumber" },
        { data: "email" },
        { data: "createdAt" },
        { data: "_id" },
      ],

      columnDefs: [
        {
          targets: 4,
          createdCell: this.renderAgeCell,
        },
        {
          targets: 7,
          createdCell: this.renderEmailCell,
        },
        { targets: 8, createdCell: this.renderCreatedAt },
        {
          targets: 9,
          createdCell: this.renderLinkButtons,
        },
      ],
    });
  };

  renderEmailCell = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>
        {cellData}{" "}
        <span className="ml-1">
          <i
            className={
              rowData.emailVerified != true
                ? "fa fa-times text-danger"
                : "fas fa-check text-success"
            }
          ></i>
        </span>
      </div>,
      td
    );
  };

  renderAgeCell = (td, cellData, rowData, row, col) => {
    const age = calculateAge(new Date(cellData));
    return ReactDOM.render(<div>{age}</div>, td);
  };

  renderCreatedAt = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>{cellData && moment(cellData).format("DD/MM/YYYY")} </div>,
      td
    );
  };

  renderLinkButtons = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div className="btn-group">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            this.navigateToEditUser(rowData._id);
          }}
        >
          <i className="fa fa-pencil-alt"></i>
        </button>
        <button
          className="btn btn-success btn-sm "
          onClick={() => {
            this.createUserSession(rowData._id);
          }}
        >
          <i className="fa fa-user"></i>
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            this.onDeleteUser(rowData._id, td);
          }}
        >
          <i className="fa fa-trash-alt"></i>
        </button>
      </div>,
      td
    );
  };
  onDeleteUser = async (id, td) => {
    var consent = window.confirm("Are you sure you want to delete?");
    if (!consent) return;
    this.props.deleteUser({
      id,
      onSuccess: () => {
        td.parentNode.style.display = "none";
      },
    });
  };

  navigateToEditUser = (_id) => {
    this.props.history.push(basePath + "/users/" + _id);
  };

  createUserSession = async (userId) => {
    const conf = window.confirm(
      "Are you sure you want to use this users session?"
    );
    if (!conf) return;

    this.setState({ loading: true });

    this.props.createSession({
      id: userId,
      onSuccess: (res) => {
        window.location.href = "/";
      },
      onEnd: () => {
        this.setState({ loading: false });
      },
    });
  };
  render() {
    const { loading } = this.state;
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table id="userTable" className="w-100 table table-striped">
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>School</th>
              <th>Age</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Signup Date</th>
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

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteUser: (params) => dispatch(deleteUser(params)),
    createSession: (params) => dispatch(createSession(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserTable);

function calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
