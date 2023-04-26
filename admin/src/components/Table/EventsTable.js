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
    const { events = [], onDelete } = this.props;
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table id="enrollmentTable" className="w-100 table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>

              <th>Start Date</th>
              <th>Expire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, eventIndex) => {
              return (
                <tr key={event._id} id={event._id}>
                  <td>{event.name}</td>
                  <td>{event.type}</td>

                  <td>
                    {moment(event.startDate, "X").format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td>
                    {moment(event.endDate, "X").format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td>
                    <div className="btn-group">
                      <Link
                        className="btn btn-primary btn-sm"
                        to={`${basePath}/events/${event._id}`}
                      >
                        <i className="fa fa-pencil-alt"></i>
                      </Link>

                      <button
                        className="btn btn-danger btn-sm "
                        onClick={() => {
                          onDelete(event._id, eventIndex);
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
