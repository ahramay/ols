import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";

import Header from "components/Headers/Header.jsx";
import FeedbackTable from '../../components/Table/FeedbackTable'
import { connect } from "react-redux";

class LevelsList extends Component {
  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Feedbacks</h2>
                
              </div>
            </CardHeader>

            <CardBody className="bg-secondary">
              <FeedbackTable history={this.props.history} />
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
