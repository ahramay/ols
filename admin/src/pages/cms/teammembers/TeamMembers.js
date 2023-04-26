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
  loadTeamMembers,
  rearrangeTeamMembers,
  removeTeamMember,
} from "../../../store/api/teamMembers";
import { setTeamMembers } from "../../../store/cms/teamMembers";
import { Link } from "react-router-dom";

import SortableList from "../../../components/sortable/SortableList";

import { basePath } from "../../../configs";

class InfoCards extends Component {
  state = {
    showLoader: false,
  };
  componentDidMount = () => {
    this.props.loadTeamMembers();
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.removeTeamMember({ id });
  };
  renderList = () => {
    const { list = [] } = this.props.teamMembers;

    return (
      <ListGroup>
        <SortableList
          data={list}
          keyExtractor={(item) => {
            return item._id;
          }}
          onListSort={(list) => {
            this.props.setTeamMembers(list);
            this.props.rearrangeTeamMembers({
              body: { orderIds: list.map((nm) => nm._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <ListGroupItem className="rounded mb-1">
                <div className="clearfix">
                  <span>{`${item.name} (${item.category && item.category.name})`}</span>
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
                        basePath + "/cms/team_members/" + item._id
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
    const { loading } = this.props.teamMembers;

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Team Members</h2>
                <Link
                  to={basePath + "/cms/team_members/add"}
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
    cms: { teamMembers },
  } = state;
  return { teamMembers };
};
const mapDispatchToprops = (dispatch) => ({
  loadTeamMembers: (params) => dispatch(loadTeamMembers(params)),
  setTeamMembers: (params) => dispatch(setTeamMembers(params)),
  rearrangeTeamMembers: (params) => dispatch(rearrangeTeamMembers(params)),
  removeTeamMember: (params) => dispatch(removeTeamMember(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(InfoCards);
