import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";

import Header from "components/Headers/Header.jsx";

import EnrollmentsTable from "../../components/Table/EnrollmentsTable";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getEnrollments, deleteEnrollment } from "../../store/api/courses";

import { basePath } from "../../configs";

class EnrollmentsList extends Component {
  state = {
    enrollments: [],
    showLoader: true,
  };

  componentDidMount = () => {
    this.loadEnrollments();
  };
  loadEnrollments = () => {
    this.setState({ showLoader: true });
    this.props.getEnrollments({
      onSuccess: (res) => {
        this.setState({ enrollments: res.data.data });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  deleteEnr = (id, index) => {
    const conf = window.confirm("Are you sure you want to delete?");
    if (!conf) return;

    this.props.deleteEnrollment({
      id,
      onSuccess: (res) => {
        const tableRow = document.getElementById(id);
        if (tableRow) tableRow.style.display = "none";
      },
      onEnd: () => {},
    });
  };

  render() {
    const { showLoader, enrollments } = this.state;
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Enrollments</h2>
                <Link
                  to={basePath + "/enrollments/category_enrollment"}
                  className="btn btn-sm btn-primary mx-1 float-right"
                >
                  <i className="fas fa-plus"></i> Add Category Enrollment
                </Link>
                <Link
                  to={basePath + "/enrollments/add"}
                  className="btn btn-sm btn-primary float-right"
                >
                  <i className="fas fa-plus"></i> Add
                </Link>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary">
              {!showLoader && (
                <EnrollmentsTable
                  enrollments={enrollments}
                  history={this.props.history}
                  onDelete={this.deleteEnr}
                />
              )}
            </CardBody>
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
  getEnrollments: (params) => dispatch(getEnrollments(params)),
  deleteEnrollment: (params) => dispatch(deleteEnrollment(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EnrollmentsList);
