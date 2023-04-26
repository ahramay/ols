import React, { Component } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import Header from "components/Headers/Header.jsx";
import Loader from "../../../components/Loader";

import { connect } from "react-redux";

import {
  loadTestimonials,
  rearrangeTestimonial,
  removeTestimonial,
} from "../../../store/api/Testimonials";

import { setTestimonial } from "../../../store/cms/testimonials";
import { Link } from "react-router-dom";

import SortableList from "../../../components/sortable/SortableList";

import { basePath } from "../../../configs";

class Testimonial extends Component {
  state = {
    showLoader: false,
  };
  componentDidMount = () => {
    this.props.loadTestimonials();
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.removeTestimonial({ id });
  };
  renderList = () => {
    const { list = [] } = this.props.testimonials;

    return (
      <ListGroup>
        <SortableList
          data={list}
          keyExtractor={(item) => {
            return item._id;
          }}
          onListSort={(list) => {
            console.log(
              "LIST => ",
              list.map((ts) => ts._id)
            );
            this.props.setTestimonial(list);
            this.props.rearrangeTestimonial({
              body: { orderIds: list.map((ts) => ts._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <ListGroupItem className="rounded mb-1">
                <div className="clearfix">
                  <span>{item.name}</span>
                  <Button
                    color="danger"
                    size="sm"
                    className="float-right"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.deleteItem(item._id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    className="float-right mr-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      this.props.history.push(
                        basePath + "/cms/testimonial/" + item._id
                      );
                    }}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </Button>
                </div>
              </ListGroupItem>
            );
          }}
        />
      </ListGroup>
    );
  };

  render() {
    const { loading } = this.props.testimonials;

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Testimonials</h2>
                <Link
                  to={basePath + "/cms/testimonial/add"}
                  className="btn btn-sm btn-primary float-right"
                >
                  <i className="fas fa-plus"></i> Add
                </Link>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {loading && (
                <div
                  className="overlapping-loader"
                  style={{ minHeight: "200px" }}
                >
                  <Loader />
                </div>
              )}
              {this.renderList()}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    cms: { testimonials },
  } = state;
  return { testimonials };
};
const mapDispatchToprops = (dispatch) => ({
  loadTestimonials: (params) => dispatch(loadTestimonials(params)),
  setTestimonial: (params) => dispatch(setTestimonial(params)),
  rearrangeTestimonial: (params) => dispatch(rearrangeTestimonial(params)),
  removeTestimonial: (params) => dispatch(removeTestimonial(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(Testimonial);
