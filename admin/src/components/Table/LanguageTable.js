import React, { Component } from "react";
import ReactDOM from "react-dom";
import { apiPath } from "../../configs";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { handleErrors } from "../../helpers/error";
import { basePath } from "../../configs";
import { deleteLanguage } from "../../store/api/languages";
$.DataTable = require("datatables.net-bs4");

class LanguageTable extends Component {
  componentDidMount = () => {
    const { token } = this.props;
    $("#languageTable").DataTable({
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
        url: apiPath + "/languages/data_table",
        type: "GET",
        headers: { "x-auth-token": token },
      },
      columns: [{ data: "name" }, { data: "_id" }],
      columnDefs: [
        {
          targets: 1,
          createdCell: this.renderLinkButtons,
        },
      ],
    });
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
            this.deleteLanguage(rowData._id, td);
          }}
        >
          <i className="fa fa-trash-alt"></i>
        </button>
      </div>,
      td
    );
  };
  deleteLanguage = async (id, td) => {
    var consent = window.confirm("Are you sure you want to delete?");
    if (!consent) return;

    this.props.deleteLanguage({
      id,
      onSuccess: () => {
        td.parentNode.style.display = "none";
      },
    });
  };
  navigateToEditCategory = (_id) => {
    this.props.history.push(basePath + "/languages/" + _id);
  };

  render() {
    return (
      <table id="languageTable" className="w-100 table table-striped">
        <thead>
          <tr>
            <th>Name</th>

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
    deleteLanguage: (params) => dispatch(deleteLanguage(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LanguageTable);
