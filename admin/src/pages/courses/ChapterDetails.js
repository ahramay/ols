import React, { Component } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import { getChapter } from "../../store/api/chapters";
import { getLessons, rearrangeLesson } from "../../store/api/lessons";
import LessonCard from "../../components/Course/LessonCard";
import { connect } from "react-redux";
import SortableList from "../../components/sortable/SortableList";
import { Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import RichEditor from "../../components/Inputs/RichEditor";
import { basePath } from "../../configs";

import { editChapter } from "../../store/api/chapters";

class ChapterDetails extends Component {
  state = {
    id: "", //chapter Id

    showSave: false,
    chapter: {
      name: "",
      price: 0,
      description: "",
      course: {
        _id: "",
        name: "",
      },
    },

    //lessons
    lessons: [],
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });

    this.loadChapter(id);
    this.loadLessons(id);
  };

  loadChapter = (id) => {
    this.setState({ showLoader: true });

    this.props.getChapter({
      id,
      onSuccess: (res) => {
        const { data: chapter } = res.data;
        this.setState({ chapter });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  saveChapter = () => {
    const {
      chapter: { name, price, description, course },
      id,
    } = this.state;
    this.setState({ showLoader: true });
    this.props.editChapter({
      id,
      body: {
        name,
        price,
        description,
        course: course._id,
      },
      onSuccess: () => {
        this.setState({ showSave: false });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };
  loadLessons = (chapterId) => {
    this.props.getLessons({
      chapterId,
      onSuccess: (res) => {
        this.setState({ lessons: res.data.data });
      },
    });
  };

  createNewLesson = () => {
    const { id } = this.props.match.params;
    const lesson = {
      name: "",
      chapter: id,
      published: false,
    };
    const { lessons } = this.state;
    lessons.push(lesson);
    this.setState({ lessons });
    window.scrollTo(0, document.body.scrollHeight);
  };

  renderLessons = () => {
    const { lessons } = this.state;
    return (
      <ListGroup>
        <SortableList
          data={lessons}
          keyExtractor={(item, index) => {
            return item._id + "lessons" + index;
          }}
          onListSort={(list) => {
            this.setState({ lessons: list });
            this.props.rearrangeLesson({
              body: { orderIds: list.map((lesson) => lesson._id) },
            });
          }}
          renderItem={(item, index) => {
            return (
              <div className="rounded mb-1 bg-white">
                <LessonCard
                  lesson={item}
                  onUpdate={(newLesson) => {
                    lessons[index] = newLesson;
                    this.setState({ lessons });
                  }}
                  onDelete={() => {
                    lessons.splice(index, 1);
                    this.setState({ lessons });
                  }}
                />
              </div>
            );
          }}
        />
      </ListGroup>
    );
  };

  render() {
    const { showLoader, chapter, showSave } = this.state;
    const { course } = chapter;
    return (
      <>
        <Header>
          <div>
            <h1 className="text-center course-title text-secondary">
              {course.name}
            </h1>
          </div>
        </Header>
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">{chapter.name}</h2>
                <h2 className="mb-0 ml-2 float-left">Rs.{chapter.price}</h2>

                {showSave && (
                  <Button
                    size="sm"
                    color="success"
                    className="float-right"
                    onClick={this.saveChapter}
                  >
                    <i className="fa fa-save"></i>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}
              {/* 
              <div>
                <Breadcrumb>
                  <BreadcrumbItem>
                    <Link
                      to={basePath + "/courses/" + course._id}
                      className="course-title"
                    >
                      {course.name}
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Link
                      to={basePath + "/courses/" + course._id}
                      className="course-title"
                    >
                      {chapter.name}
                    </Link>
                  </BreadcrumbItem>
                </Breadcrumb>
              </div> */}

              <div className="row">
                <div className="col-12">
                  <RichEditor
                    label="Chapter Detail"
                    value={chapter.description}
                    onChange={(description) => {
                      const updatedChap = {
                        ...this.state.chapter,
                        description,
                      };
                      this.setState({ chapter: updatedChap, showSave: true });
                    }}
                  />
                </div>
              </div>
              <div className="clearfix my-2">
                <h2 className="float-left">Lessons</h2>
                <Button
                  className="float-right"
                  color="dark"
                  size="sm"
                  onClick={this.createNewLesson}
                >
                  Create Lesson
                </Button>
              </div>
              {/* Lessons */}
              {this.renderLessons()}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  getChapter: (params) => dispatch(getChapter(params)),
  getLessons: (params) => dispatch(getLessons(params)),
  rearrangeLesson: (params) => dispatch(rearrangeLesson(params)),
  editChapter: (params) => dispatch(editChapter(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(ChapterDetails);
