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
  loadUniversities,
  rearrangeUnis,
  removeUni,
} from "../../../store/api/unis";
import { setUniversity } from "../../../store/cms/universities";
import { Link } from "react-router-dom";

import SortableList from "../../../components/sortable/SortableList";

import { basePath } from "../../../configs";

class Universities extends Component {
  state = {
    showLoader: false,
  };
  componentDidMount = () => {
    this.props.loadUniversities();
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.removeUni({ id });
  };
  renderList = () => {
    const { list = [] } = this.props.unis;

    return (
      <ListGroup>
        <SortableList
          data={list}
          keyExtractor={(item) => {
            return item._id;
          }}
          onListSort={(list) => {
            this.props.setUniversity(list);
            this.props.rearrangeUnis({
              body: { orderIds: list.map((nm) => nm._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <ListGroupItem className="rounded mb-1">
                <div className="clearfix">
                  <span>
                    <img src={item.image} style={{ maxWidth: "60px" }} />
                  </span>
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
                </div>
              </ListGroupItem>
            );
          }}
        />
      </ListGroup>
    );
  };

  render() {
    const { loading } = this.props.unis;

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Universities</h2>
                <Link
                  to={basePath + "/cms/universities/add"}
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
    cms: { unis },
  } = state;
  return { unis };
};
const mapDispatchToprops = (dispatch) => ({
  loadUniversities: (params) => dispatch(loadUniversities(params)),
  setUniversity: (params) => dispatch(setUniversity(params)),
  rearrangeUnis: (params) => dispatch(rearrangeUnis(params)),
  removeUni: (params) => dispatch(removeUni(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(Universities);
