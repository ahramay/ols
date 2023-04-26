import React, { Component } from "react";
import { connect } from "react-redux";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getAllFeedbacks } from "../../store/api/courseFeedback";

$.DataTable = require("datatables.net-bs4");

class FeedbackTable extends Component {
  state = {
    loading: false,
    feedbacks: [],

    showModal: false,
    currentFeedback: {},
  };
  componentDidMount = () => {
    this.setState({ loading: true });
    this.props.getAllFeedbacks({
      onSuccess: (res) => {
        this.setState({ feedbacks: res.data.data });
        $("#feedbackTable").DataTable({
          language: {
            paginate: {
              next: '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
              previous:
                '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
            },
          },
        });
      },
      onEnd: () => {
        this.setState({ loading: false });
      },
    });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { loading } = this.state;
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table id="feedbackTable" className="w-100 table table-striped">
          <thead>
            <tr>
              <th>Course</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Name</th>
              <th>Email</th>
              <th>Feedback</th>
              <th>Show</th>
            </tr>
          </thead>
          <tbody>
            {this.state.feedbacks.map((feedback) => {
              const { _id, name, email, rating, course, message } = feedback;
              return (
                <tr key={_id}>
                  <td>{course.name}</td>
                  <td>{course.category && course.category.name}</td>
                  <td>{rating}</td>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{message}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm "
                      onClick={() => {
                        this.setState({
                          showModal: true,
                          currentFeedback: feedback,
                        });
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
          <div
            className="pt-5"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <h1 className="text-white text-center ">Loading</h1>
          </div>
        )}

        <Modal isOpen={this.state.showModal} toggle={this.closeModal}>
          <ModalHeader toggle={this.closeModal}>Feedback</ModalHeader>
          <ModalBody>
            <h3>Name: {this.state.currentFeedback.name}</h3>
            <h3>Email: {this.state.currentFeedback.email}</h3>
            <h3>Rating: {this.state.currentFeedback.rating}</h3>
            <h3>Feedback:</h3>
            <p>{this.state.currentFeedback.message}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.closeModal}>
              Ok
            </Button>
          </ModalFooter>
        </Modal>
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
    getAllFeedbacks: (params) => dispatch(getAllFeedbacks(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FeedbackTable);
