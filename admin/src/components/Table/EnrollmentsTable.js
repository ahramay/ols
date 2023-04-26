import React, { Component } from "react";
import ReactDOM from "react-dom";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { handleErrors } from "../../helpers/error";
import { basePath } from "../../configs";
import { deleteCategory } from "../../store/api/categories";
import moment from "moment";
import { getEnrollments } from "../../store/api/courses";
import { Link } from "react-router-dom";
$.DataTable = require("datatables.net-bs4");

class EnrollmentsTable extends Component {
  componentDidMount = () => {
    $("#enrollmentTable").DataTable({
      language: {
        paginate: {
          next:
            '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
          previous:
            '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
        },
      },
    });
  };

  render() {
    const { enrollments, onDelete } = this.props;
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table id="enrollmentTable" className="w-100 table table-striped">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>Expire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enr, enrIndex) => {
              if (!enr.user)
                enr.user = { firstName: "", lastName: "", email: "" };
              return (
                <tr key={enr._id} id={enr._id}>
                  <td>{enr.user.firstName + " " + enr.user.lastName}</td>
                  <td>{enr.user.email}</td>
                  <td>{enr.course.name}</td>
                  <td>{enr.course.category.name}</td>
                  <td>
                    {moment(enr.startDate, "X").format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td>{moment(enr.endDate, "X").format("DD/MM/YYYY HH:mm")}</td>
                  <td>
                    <div className="btn-group">
                      <Link
                        className="btn btn-primary btn-sm"
                        to={`${basePath}/enrollments/${enr._id}`}
                      >
                        <i className="fa fa-pencil-alt"></i>
                      </Link>

                      <button
                        className="btn btn-danger btn-sm "
                        onClick={() => {
                          onDelete(enr._id, enrIndex);
                        }}
                      >
                        <i className="fa fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
    deleteCategory: (params) => dispatch(deleteCategory(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentsTable);
