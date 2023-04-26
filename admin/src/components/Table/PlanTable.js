import React, { Component } from "react";
import ReactDOM from "react-dom";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { handleErrors } from "../../helpers/error";
import { basePath } from "../../configs";
import { deletePlan } from "../../store/api/subscriptionPlans";
$.DataTable = require("datatables.net-bs4");

class CategoryTable extends Component {
  componentDidMount = () => {
    const { token } = this.props;
    $("#subscriptionPlanTable").DataTable({
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
        url: apiPath + "/subscription_plans/data_table",
        type: "GET",
        headers: { "x-auth-token": token },
      },
      columns: [{ data: "name" }, { data: "_id" }, { data: "_id" }],
      columnDefs: [
        {
          targets: 1,
          createdCell: this.renderParentColumn,
        },
        {
          targets: 2,
          createdCell: this.renderLinkButtons,
        },
      ],
    });
  };

  renderParentColumn = (td, cellData, rowData, row, col) => {
    let category = "Null";
    if (rowData.category && rowData.category.name)
      category = rowData.category.name;
    return ReactDOM.render(<div>{category}</div>, td);
  };

  renderLinkButtons = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>
        <button
          className="btn btn-primary btn-sm "
          onClick={() => {
            this.navigateToEditPlan(rowData._id);
          }}
        >
          <i className="fa fa-pencil-alt"></i>
        </button>

        <button
          className="btn btn-danger btn-sm "
          onClick={() => {
            this.deletePlan(rowData._id, td);
          }}
        >
          <i className="fa fa-trash-alt"></i>
        </button>
      </div>,
      td
    );
  };
  deletePlan = async (id, td) => {
    var consent = window.confirm("Are you sure you want to delete?");
    if (!consent) return;

    this.props.deletePlan({
      id,
      onSuccess: () => {
        td.parentNode.style.display = "none";
      },
    });
  };
  navigateToEditPlan = (_id) => {
    this.props.history.push(basePath + "/subscription_plans/" + _id);
  };
  render() {
    return (
      <table id="subscriptionPlanTable" className="w-100 table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
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
  return {
    deletePlan: (params) => dispatch(deletePlan(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CategoryTable);
