import React, { Component } from "react";
import ReactDOM from "react-dom";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { handleErrors } from "../../helpers/error";
import { basePath } from "../../configs";
import { deleteCategory } from "../../store/api/blogCategories";
$.DataTable = require("datatables.net-bs4");

class CategoryTable extends Component {
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
        url: apiPath + "/blogs_categories/data_table",
        type: "GET",
        headers: { "x-auth-token": token },
      },
      columns: [{ data: "name" }, { data: "_id" }],
      columnDefs: [
        // {
        //   targets: 1,
        //   createdCell: this.renderParentColumn,
        // },
        {
          targets: 1,
          createdCell: this.renderLinkButtons,
        },
      ],
    });
  };

  renderParentColumn = (td, cellData, rowData, row, col) => {
    let parent = "Null";
    if (rowData.parent && rowData.parent.name) parent = rowData.parent.name;
    return ReactDOM.render(<div>{parent}</div>, td);
  };

  renderLinkButtons = (td, cellData, rowData, row, col) => {
    return ReactDOM.render(
      <div>
        <button
          className="btn btn-primary btn-sm "
          onClick={() => {
            this.navigateToEditCategory(rowData._id);
          }}
        >
          <i className="fa fa-pencil-alt"></i>
        </button>

        <button
          className="btn btn-danger btn-sm "
          onClick={() => {
            this.deleteCategory(rowData._id, td);
          }}
        >
          <i className="fa fa-trash-alt"></i>
        </button>
      </div>,
      td
    );
  };
  deleteCategory = async (id, td) => {
    var consent = window.confirm("Are you sure you want to delete?");
    if (!consent) return;

    this.props.deleteCategory({
      id,
      onSuccess: () => {
        td.parentNode.style.display = "none";
      },
    });
  };
  navigateToEditCategory = (_id) => {
    this.props.history.push(basePath + "/blog_categories/" + _id);
  };
  render() {
    return (
      <table id="categoryTable" className="w-100 table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            {/* <th>Parent</th> */}
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
    deleteCategory: (params) => dispatch(deleteCategory(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CategoryTable);
