import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";

import Header from "components/Headers/Header.jsx";

import LevelsTable from "../../components/Table/LevelsTable";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { basePath } from "../../configs";

class LevelsList extends Component {
  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Levels</h2>
                <Link
                  to={basePath + "/levels/add"}
                  className="btn btn-sm btn-primary float-right"
                >
                  <i className="fas fa-plus"></i> Add
                </Link>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary">
              <LevelsTable history={this.props.history} />
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
const mapDispatchToprops = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToprops)(LevelsList);
