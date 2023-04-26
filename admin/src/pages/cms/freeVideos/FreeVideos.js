import React, { Component } from "react";
import Header from "components/Headers/Header.jsx";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroupItem,
} from "reactstrap";
import { basePath } from "../../../configs";
import { Link } from "react-router-dom";
import SortableList from "../../../components/sortable/SortableList";
import { connect } from "react-redux";
import freeVideos, { setFreeVideos } from "../../../store/cms/freeVideos";
import {
  getAllFreeVideos,
  rearrangeFreeVideos,
  deleteVideo,
} from "../../../store/api/freeVideos";

class FreeVideos extends Component {
  state = {
    showLoader: false,
    freeVideos: [],
  };
  componentDidMount = () => {
    this.loadVideos();
  };

  loadVideos = () => {
    this.setState({ showLoader: true });
    this.props.getAllFreeVideos({
      onSuccess: (res) => {
        this.setState({ freeVideos: res.data.data });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.deleteVideo({ id });
  };

  renderList = () => {
    return (
      <SortableList
        data={this.props.freeVideos.list}
        keyExtractor={(item, index) => {
          return item._id;
        }}
        onListSort={(list) => {
          this.props.setFreeVideos(list);
          this.props.rearrangeFreeVideos({
            body: { orderIds: list.map((nm) => nm._id) },
          });
        }}
        renderItem={(freeVideo, ind) => {
          return (
            <ListGroupItem className="rounded mb-1">
              <div className="clearfix">
                <img
                  src={freeVideo.thumbnail}
                  style={{
                    width: "40px",
                    marginRight: "10px",
                  }}
                  alt=""
                />
                <span>{freeVideo.videoTitle} ({freeVideo.category && freeVideo.category.name})</span>
                <Button
                  color="danger"
                  size="sm"
                  className="float-right"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.deleteItem(freeVideo._id);
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
                      basePath + "/cms/free_videos/" + freeVideo._id
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
    );
  };

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Free Videos</h2>
                <Link
                  to={basePath + "/cms/free_videos/add"}
                  className="btn btn-sm btn-primary float-right"
                >
                  <i className="fas fa-plus"></i> Add
                </Link>
              </div>
            </CardHeader>
            <CardBody className="bg-secondary">{this.renderList()}</CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    freeVideos: state.cms.freeVideos,
  };
};

export default connect(mapStateToProps, {
  setFreeVideos,
  getAllFreeVideos,
  rearrangeFreeVideos,
  deleteVideo,
})(FreeVideos);
