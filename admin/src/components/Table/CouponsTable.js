import React, { Component } from "react";
import ReactDOM from "react-dom";
import Toggle from "../../components/Inputs/Toggle";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { handleErrors } from "../../helpers/error";
import { basePath } from "../../configs";
import { deleteCoupon } from "../../store/api/coupons";
$.DataTable = require("datatables.net-bs4");

class CouponTable extends Component {
  c;
  componentDidMount = () => {
    const { token } = this.props;
    $("#categoryTable").DataTable({
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
        url: apiPath + "/coupons/all_coupons",
        type: "GET",
        headers: { "x-auth-token": token },
      },
      columns: [
        { data: "code" },
        { data: "discount" },
        { data: "discountType" },
        { data: "reusability" },
        { data: "_id" },
        { data: "_id" },
      ],
      columnDefs: [
        {
          targets: 4,
          createdCell: this.renderReusibilityCount,
        },
        {
          targets: 5,
          createdCell: this.renderLinkButtons,
        },
      ],
    });
  };

  renderReusibilityCount = (td, cellData, rowData, row, col) => {
    let count = "";
    if (rowData.reusabilityCount && rowData.reusabilityCount)
      count = rowData.reusabilityCount;
    return ReactDOM.render(<div>{count}</div>, td);
  };

  // renderParentColumn = (td, cellData, rowData, row, col) => {
  //   let parent = "Null";
  //   if (rowData.parent && rowData.parent.name) parent = rowData.parent.name;
  //   return ReactDOM.render(<div>{parent}</div>, td);
  // };

  renderLinkButtons = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>
        <button
          className="btn btn-primary btn-sm "
          onClick={() => {
            this.navigateToEditCoupon(rowData._id);
          }}
        >
          <i className="fa fa-pencil-alt"></i>
        </button>

        <button
          className="btn btn-danger btn-sm "
          onClick={() => {
            this.deleteCoupon(rowData._id, td);
          }}
        >
          <i className="fa fa-trash-alt"></i>
        </button>
      </div>,
      td
    );
  };
  deleteCoupon = async (id, td) => {
    var consent = window.confirm("Are you sure you want to delete?");
    if (!consent) return;

    this.props.deleteCoupon({
      id,
      onSuccess: () => {
        td.parentNode.style.display = "none";
      },
    });
  };

  navigateToEditCoupon = (_id) => {
    this.props.history.push(basePath + "/coupons/" + _id);
  };
  render() {
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table id="categoryTable" className="w-100 table table-striped">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Discount Type</th>
              <th>Reusability</th>
              <th>Reusability Count</th>

              <th>Actions</th>
            </tr>
          </thead>
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
    deleteCoupon: (params) => dispatch(deleteCoupon(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CouponTable);
