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
  loadAboutInfoCards,
  rearrangeAboutInfoCard,
  removeAboutInfoCard,
} from "../../../store/api/aboutInfoCards";
import { setAboutInfoCards } from "../../../store/cms/aboutInfoCards";
import { Link } from "react-router-dom";

import SortableList from "../../../components/sortable/SortableList";

import { basePath } from "../../../configs";

class InfoCards extends Component {
  state = {
    showLoader: false,
  };
  componentDidMount = () => {
    this.props.loadAboutInfoCards();
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.removeAboutInfoCard({ id });
  };
  renderList = () => {
    const { list = [] } = this.props.aboutInfoCards;

    return (
      <ListGroup>
        <SortableList
          data={list}
          keyExtractor={(item) => {
            return item._id;
          }}
          onListSort={(list) => {
            this.props.setAboutInfoCards(list);
            this.props.rearrangeAboutInfoCard({
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
                        basePath + "/cms/about_info_cards/" + item._id
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
    const { loading } = this.props.aboutInfoCards;

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">About Info Cards</h2>
                <Link
                  to={basePath + "/cms/about_info_cards/add"}
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
    cms: { aboutInfoCards },
  } = state;
  return { aboutInfoCards };
};
const mapDispatchToprops = (dispatch) => ({
  loadAboutInfoCards: (params) => dispatch(loadAboutInfoCards(params)),
  setAboutInfoCards: (params) => dispatch(setAboutInfoCards(params)),
  rearrangeAboutInfoCard: (params) => dispatch(rearrangeAboutInfoCard(params)),
  removeAboutInfoCard: (params) => dispatch(removeAboutInfoCard(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(InfoCards);
