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
  loadWhyPageBoards,
  rearrangeWhyPageBoard,
  removeWhyPageBoard,
} from "../../../store/api/whyPageBoards";

import { setWhyPageBoard } from "../../../store/cms/whyPageBoards";

import { Link } from "react-router-dom";

import SortableList from "../../../components/sortable/SortableList";

import { basePath } from "../../../configs";

class InfoCards extends Component {
  state = {
    showLoader: false,
  };
  componentDidMount = () => {
    this.props.loadWhyPageBoards();
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.removeWhyPageBoard({ id });
  };
  renderList = () => {
    const { list = [] } = this.props.whyPageBoards;

    return (
      <ListGroup>
        <SortableList
          data={list}
          keyExtractor={(item) => {
            return item._id;
          }}
          onListSort={(list) => {
            this.props.setWhyPageBoard(list);
            this.props.rearrangeWhyPageBoard({
              body: { orderIds: list.map((nm) => nm._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <ListGroupItem className="rounded mb-1">
                <div className="clearfix">
                  <span>{item.heading}</span>
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
                        basePath + "/cms/why_page_boards/" + item._id
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
    const { loading } = this.props.whyPageBoards;

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Why Page Boards</h2>
                <Link
                  to={basePath + "/cms/why_page_boards/add"}
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
    cms: { whyPageBoards },
  } = state;
  return { whyPageBoards };
};
const mapDispatchToprops = (dispatch) => ({
  loadWhyPageBoards: (params) => dispatch(loadWhyPageBoards(params)),
  setWhyPageBoard: (params) => dispatch(setWhyPageBoard(params)),
  rearrangeWhyPageBoard: (params) => dispatch(rearrangeWhyPageBoard(params)),
  removeWhyPageBoard: (params) => dispatch(removeWhyPageBoard(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(InfoCards);
