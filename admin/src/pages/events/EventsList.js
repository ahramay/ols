import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";

import Header from "components/Headers/Header.jsx";

import EventsTable from "../../components/Table/EventsTable";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getAllEvents, deleteEvent } from "../../store/api/events";
import { basePath } from "../../configs";

class EventsList extends Component {
  state = {
    showLoader: true,
    events: [],
  };

  componentDidMount = () => {
    this.loadEvents();
  };
  loadEvents = () => {
    this.setState({ showLoader: true });
    this.props.getAllEvents({
      onSuccess: (res) => {
        this.setState({ events: res.data.data });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };
  deleteEvent = (id, index) => {
    const conf = window.confirm("Are you sure you want to delete?");
    if (!conf) return;

    this.props.deleteEvent({
      id,
      onSuccess: (res) => {
        const tableRow = document.getElementById(id);
        if (tableRow) tableRow.style.display = "none";
      },
      onEnd: () => {},
    });
  };

  render() {
    const { events, showLoader } = this.state;
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Events & Webinars</h2>
                <Link
                  to={basePath + "/events/add"}
                  className="btn btn-sm btn-primary float-right"
                >
                  <i className="fas fa-plus"></i> Add
                </Link>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary">
              {!showLoader && (
                <EventsTable
                  events={events}
                  history={this.props.history}
                  onDelete={this.deleteEvent}
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
  return {};
};
const mapDispatchToprops = (dispatch) => ({
  getAllEvents: (params) => dispatch(getAllEvents(params)),
  deleteEvent: (params) => dispatch(deleteEvent(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EventsList);
