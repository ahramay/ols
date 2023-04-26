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
  loadFooterLinks,
  rearrangeFooterLinks,
  removeFooterLink,
} from "../../../store/api/footerLinks";
import { setFooterLinks } from "../../../store/cms/footerLinks";
import { Link } from "react-router-dom";

import SortableList from "../../../components/sortable/SortableList";

import { basePath } from "../../../configs";

class FooterLinks extends Component {
  state = {
    showLoader: false,
  };
  componentDidMount = () => {
    this.props.loadFooterLinks();
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.removeFooterLink({ id });
  };
  renderList = () => {
    const { list = [] } = this.props.footerLinks;

    return (
      <ListGroup>
        <SortableList
          data={list}
          keyExtractor={(item) => {
            return item._id;
          }}
          onListSort={(list) => {
            this.props.setFooterLinks(list);
            this.props.rearrangeFooterLinks({
              body: { orderIds: list.map((nm) => nm._id) },
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
                        basePath + "/cms/footer_links/" + item._id
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
    const { loading } = this.props.footerLinks;

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Footer Links</h2>
                <Link
                  to={basePath + "/cms/footer_links/add"}
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
    cms: { footerLinks },
  } = state;
  return { footerLinks };
};
const mapDispatchToprops = (dispatch) => ({
  loadFooterLinks: (params) => dispatch(loadFooterLinks(params)),
  setFooterLinks: (params) => dispatch(setFooterLinks(params)),
  rearrangeFooterLinks: (params) => dispatch(rearrangeFooterLinks(params)),
  removeFooterLink: (params) => dispatch(removeFooterLink(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(FooterLinks);
