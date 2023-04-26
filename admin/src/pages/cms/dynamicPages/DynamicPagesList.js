import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";

import Header from "components/Headers/Header.jsx";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getPages, deletePage } from "../../../store/api/dynamicPages";
import { basePath } from "../../../configs";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
$.DataTable = require("datatables.net-bs4");

class PagesList extends Component {
  state = {
    showLoader: true,

    pages: [],
  };

  componentDidMount = () => {
    this.props.getPages({
      onSuccess: (res) => {
        console.log("All Pages => ", res.data.data);
        this.setState({ pages: res.data.data });
        setTimeout(() => {
          $("#dynamicpagetable").DataTable({
            language: {
              paginate: {
                next:
                  '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
                previous:
                  '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
              },
            },
          });
        }, 150);
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  delPage = (id, index) => {
    this.setState({ showLoader: true });
    this.props.deletePage({
      id,
      onSuccess: () => {
        const { pages } = this.state;
        pages.splice(index, 1);
        this.setState({ pages });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };
  renderTable = () => {
    const { pages } = this.state;

    return (
      <table
        id="dynamicpagetable"
        className="table table-striped table-bordered"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Is Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page, pageIndex) => {
            return (
              <tr key={`${page._id} ${pageIndex}`}>
                <td>{page.title}</td>
                <td>{page.type}</td>
                <td>{page.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <div className="btn-group">
                    <Link
                      className="btn btn-success btn-sm"
                      target="_blank"
                      to={"/page/" + page.slug}
                    >
                      <i className="fa fa-clipboard"></i>
                    </Link>
                    <Link
                      className="btn btn-primary btn-sm"
                      to={basePath + "/cms/dynamic_pages/" + page._id}
                    >
                      <i className="fa fa-pencil-alt"></i>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        const conf = window.confirm(
                          "are you  sure you want to delete?"
                        );
                        if (!conf) return;
                        this.delPage(page._id, pageIndex);
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
    );
  };
  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Dynamic Pages</h2>
                <Link
                  to={basePath + "/cms/dynamic_pages/add"}
                  className="btn btn-sm btn-primary float-right"
                >
                  <i className="fas fa-plus"></i> Add
                </Link>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary">{this.renderTable()}</CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    cms: { navbar },
  } = state;
  return { navbar };
};
const mapDispatchToprops = (dispatch) => ({
  getPages: (params) => dispatch(getPages(params)),
  deletePage: (params) => dispatch(deletePage(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(PagesList);
